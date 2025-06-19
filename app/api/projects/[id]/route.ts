import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";

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

// GET - Fetch single project
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { db } = await connectToDatabase();
    
    // Find project by either custom id or MongoDB _id
    let project;
    try {
      // Try to find by ObjectId first
      project = await db.collection("projects").findOne({ _id: new ObjectId(params.id) });
    } catch (error) {
      // If ObjectId fails, try by custom id field
      project = await db.collection("projects").findOne({ id: params.id });
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check permissions
    if (auth.user?.userType === "company") {
      const companyProfile = await db.collection("companies").findOne({ email: auth.user.email });
      if (project.company?.id !== companyProfile?.id && project.company?.id !== companyProfile?._id?.toString()) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else if (auth.user?.userType === "employee") {
      if (!project.assignedEmployees?.includes(auth.user.email)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Transform project to match frontend expectations
    const transformedProject = {
      ...project,
      id: project.id || project._id?.toString(),
      progress: project.progress || 0,
      spent: project.spent || 0,
      milestones: project.milestones || 0,
      completedMilestones: project.completedMilestones || 0,
      teamSize: project.teamSize || 1,
      tags: project.tags || [],
      client: project.client || { id: project.clientId, name: "Unknown Client" },
      company: project.company || { id: project.companyId, name: "Unknown Company" }
    };

    return NextResponse.json({ project: transformedProject });

  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update project
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only owners, companies, and assigned employees can update projects
    if (!["owner", "company", "employee"].includes(auth.user?.userType)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { db } = await connectToDatabase();
    
    // Find project
    let project;
    try {
      project = await db.collection("projects").findOne({ _id: new ObjectId(params.id) });
    } catch (error) {
      project = await db.collection("projects").findOne({ id: params.id });
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check permissions
    if (auth.user?.userType === "company") {
      const companyProfile = await db.collection("companies").findOne({ email: auth.user.email });
      if (project.company?.id !== companyProfile?.id && project.company?.id !== companyProfile?._id?.toString()) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else if (auth.user?.userType === "employee") {
      if (!project.assignedEmployees?.includes(auth.user.email)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const body = await req.json();
    const updates = { 
      ...body, 
      updatedAt: new Date(),
      updatedBy: auth.user?.email || ""
    };

    // Update project
    const result = await db.collection("projects").updateOne(
      { _id: project._id },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log(`Project ${params.id} updated by ${auth.user?.email}`);
    return NextResponse.json({ message: "Project updated successfully" });

  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete project (hard delete)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only owners can delete projects
    if (auth.user?.userType !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { db } = await connectToDatabase();
    
    // Find project first to get details for logging
    let project;
    try {
      project = await db.collection("projects").findOne({ _id: new ObjectId(params.id) });
    } catch (error) {
      project = await db.collection("projects").findOne({ id: params.id });
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Perform hard delete of the project
    const result = await db.collection("projects").deleteOne({ _id: project._id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log(`Project ${project.name} (${params.id}) permanently deleted by ${auth.user?.email}`);
    return NextResponse.json({ 
      message: "Project permanently deleted from database",
      deletedProject: {
        id: project.id || project._id?.toString(),
        name: project.name
      }
    });

  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
