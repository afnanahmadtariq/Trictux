import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { verify } from "jsonwebtoken";
import { createProject, getAllProjects, getProjectsByCompany, updateProject, Project } from "@/lib/actors";

const JWT_SECRET = process.env.JWT_SECRET || "trictux-secret-key";

// Helper function to verify authentication
async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  
  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  try {
    const decoded = verify(token, JWT_SECRET);
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ 
      email: (decoded as any).email 
    });

    return { user, decoded };
  } catch (error) {
    return { error: "Invalid token", status: 401 };
  }
}

// GET - Fetch projects
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const url = new URL(req.url);
    const companyId = url.searchParams.get('companyId');
    const clientId = url.searchParams.get('clientId');

    let projects;
    if (auth.user?.userType === "owner") {
      // Owners can see all projects
      projects = companyId ? await getProjectsByCompany(companyId) : await getAllProjects();
    } else if (auth.user?.userType === "company") {
      // Companies can only see their own projects
      const { db } = await connectToDatabase();
      const companyProfile = await db.collection("companies").findOne({ email: auth.user.email });
      projects = await getProjectsByCompany(companyProfile?.id || companyProfile?._id?.toString() || auth.user.email);
    } else {
      // Employees can see projects they're assigned to
      const { db } = await connectToDatabase();
      projects = await db.collection("projects").find({ 
        assignedEmployees: { $in: [auth.user?.email] }
      }).toArray();
    }

    // Filter by client if specified
    if (clientId) {
      projects = projects.filter((p: any) => p.client?.id === clientId);
    }

    return NextResponse.json({ projects });

  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new project
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only owners and companies can create projects
    if (!["owner", "company"].includes(auth.user?.userType)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { 
      name, 
      description, 
      clientId, 
      companyId, 
      status, 
      priority, 
      phase,
      budget, 
      startDate, 
      endDate, 
      teamLead,
      teamSize,
      milestones,
      nextMilestone,
      risk,
      tags,
      assignedEmployees 
    } = body;

    // Validate required fields
    if (!name || !description || !clientId || !companyId) {
      return NextResponse.json({ 
        error: "Missing required fields: name, description, clientId, companyId" 
      }, { status: 400 });
    }

    // Get client and company details
    const { db } = await connectToDatabase();
    const client = await db.collection("clients").findOne({ 
      $or: [{ id: clientId }, { _id: clientId }]
    });
    const company = await db.collection("companies").findOne({ 
      $or: [{ id: companyId }, { _id: companyId }]
    });

    if (!client || !company) {
      return NextResponse.json({ 
        error: "Invalid client or company ID" 
      }, { status: 400 });
    }

    // Generate project ID
    const projectId = `PRJ-${Date.now()}`;

    // Create project data
    const projectData: Omit<Project, '_id'> = {
      id: projectId,
      name,
      description,
      client: {
        id: client.id || client._id?.toString(),
        name: client.name
      },
      company: {
        id: company.id || company._id?.toString(),
        name: company.name || company.companyName
      },
      status: status || "Planning",
      priority: priority || "Medium",
      phase: phase || "Planning",
      progress: 0,
      budget: budget || 0,
      spent: 0,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || "",
      teamLead: teamLead || "",
      teamSize: teamSize || 1,
      milestones: milestones || 0,
      completedMilestones: 0,
      nextMilestone: nextMilestone || "",
      risk: risk || "Low",
      tags: tags || [],
      createdAt: new Date(),
      createdBy: auth.user?.email || ""
    };

    // Create project in database
    const result = await createProject(projectData);

    // Return the created project
    const createdProject = await db.collection("projects").findOne({ _id: result.insertedId });

    return NextResponse.json({ 
      project: createdProject,
      message: "Project created successfully" 
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update project
export async function PUT(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only owners, companies, and assigned employees can update projects
    if (!["owner", "company", "employee"].includes(auth.user?.userType)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const projectId = url.searchParams.get('id');
    
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Check permissions
    if (auth.user?.userType === "company") {
      const { db } = await connectToDatabase();
      const { ObjectId } = await import("mongodb");
      const project = await db.collection("projects").findOne({ 
        _id: new ObjectId(projectId) 
      });

      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      const companyProfile = await db.collection("companies").findOne({ email: auth.user.email });
      if (project.company?.id !== companyProfile?.id && project.company?.id !== companyProfile?._id?.toString()) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const body = await req.json();
    const updates = { ...body, updatedAt: new Date() };

    const result = await updateProject(projectId, updates);
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project updated successfully" });

  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete project
export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only owners can delete projects
    if (auth.user?.userType !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const projectId = url.searchParams.get('id');
    
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const { ObjectId } = await import("mongodb");
    
    // Delete the project
    const result = await db.collection("projects").deleteOne({ 
      _id: new ObjectId(projectId) 
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted successfully" });

  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
