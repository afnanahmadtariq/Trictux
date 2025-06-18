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

    let projects;
    if (auth.user?.userType === "owner") {
      // Owners can see all projects
      projects = companyId ? await getProjectsByCompany(companyId) : await getAllProjects();
    } else if (auth.user?.userType === "company") {
      // Companies can only see their own projects
      const { db } = await connectToDatabase();
      const companyProfile = await db.collection("companies").findOne({ email: auth.user.email });
      projects = await getProjectsByCompany(companyProfile?._id?.toString() || auth.user.email);    } else {
      // Employees can see projects they're assigned to
      const { db } = await connectToDatabase();
      projects = await db.collection("projects").find({ 
        assignedEmployees: { $in: [auth.user?.email] }
      }).toArray();
    }

    // Add client and company details to each project
    const { db } = await connectToDatabase();
    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        const client = await db.collection("clients").findOne({ 
          _id: project.clientId 
        });
        const company = await db.collection("companies").findOne({ 
          _id: project.companyId 
        });
        
        return {
          ...project,
          id: project._id?.toString(),
          clientName: client?.name || "Unknown Client",
          companyName: company?.companyName || "Unknown Company"
        };
      })
    );

    return NextResponse.json({ projects: projectsWithDetails });

  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ 
      error: "Failed to fetch projects" 
    }, { 
      status: 500 
    });
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
    if (auth.user?.userType === "employee") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const { title, description, clientId, companyId, assignedEmployees, startDate, endDate, budget, priority } = data;

    if (!title || !description || !clientId || !companyId) {
      return NextResponse.json({ 
        error: "Title, description, client ID, and company ID are required" 
      }, { 
        status: 400 
      });
    }

    const project: Omit<Project, '_id'> = {
      title,
      description,
      status: "planning",
      priority: priority || "medium",
      companyId,
      clientId,
      assignedEmployees: assignedEmployees || [],
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,      budget,
      progress: 0,
      createdAt: new Date(),
      createdBy: auth.user?.email || ""
    };

    const result = await createProject(project);

    return NextResponse.json({ 
      success: true, 
      projectId: result.insertedId,
      message: "Project created successfully"
    });

  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ 
      error: "Failed to create project" 
    }, { 
      status: 500 
    });
  }
}

// PATCH - Update project
export async function PATCH(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const data = await req.json();
    const { projectId, updates } = data;

    if (!projectId) {
      return NextResponse.json({ 
        error: "Project ID is required" 
      }, { 
        status: 400 
      });
    }

    // Check permissions
    const { db } = await connectToDatabase();
    const { ObjectId } = await import("mongodb");
    const project = await db.collection("projects").findOne({ 
      _id: new ObjectId(projectId) 
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Owners can update any project, companies can update their own projects
    if (auth.user?.userType === "company") {
      const companyProfile = await db.collection("companies").findOne({ email: auth.user.email });
      if (project.companyId !== companyProfile?._id?.toString() && project.companyId !== auth.user.email) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }    } else if (auth.user?.userType === "employee") {
      // Employees can only update their assigned projects (limited fields)
      if (!project.assignedEmployees.includes(auth.user.email)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      // Limit what employees can update
      const allowedFields = ['progress', 'actualCost'];
      const filteredUpdates = Object.keys(updates)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updates[key];
          return obj;
        }, {} as any);
      
      await updateProject(projectId, filteredUpdates);
    } else {
      await updateProject(projectId, updates);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ 
      error: "Failed to update project" 
    }, { 
      status: 500 
    });
  }
}
