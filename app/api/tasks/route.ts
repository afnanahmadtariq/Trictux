import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { verify } from "jsonwebtoken";
import { createTask, getTasksByProject, getTasksByEmployee, updateTask, Task } from "@/lib/actors";

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

// GET - Fetch tasks
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');
    const employeeEmail = url.searchParams.get('employeeEmail');

    let tasks: any[] = [];
    const { db } = await connectToDatabase();

    if (projectId) {
      tasks = await db.collection("tasks").find({ project: projectId }).toArray();
    } else if (employeeEmail && auth.user?.userType === "employee" && auth.user.email === employeeEmail) {
      tasks = await db.collection("tasks").find({ assignedTo: employeeEmail }).toArray();
    } else if (auth.user?.userType === "employee") {
      tasks = await db.collection("tasks").find({ assignedTo: auth.user.email }).toArray();
    } else if (auth.user?.userType === "owner") {
      tasks = await db.collection("tasks").find({}).toArray();
    } else if (auth.user?.userType === "company") {
      // Get tasks for projects belonging to this company
      const companyProfile = await db.collection("companies").findOne({ email: auth.user.email });
      const projects = await db.collection("projects").find({ 
        "company.id": companyProfile?.id || companyProfile?._id?.toString()
      }).toArray();
      const projectNames = projects.map(p => p.name);
      tasks = await db.collection("tasks").find({ 
        project: { $in: projectNames }
      }).toArray();
    }

    // Transform tasks to match frontend expectations
    const transformedTasks = tasks.map((task: any) => ({
      ...task,
      id: task.id || task._id?.toString(),
      // Ensure all required fields exist with defaults
      progress: task.progress || 0,
      loggedHours: task.loggedHours || 0,
      estimatedHours: task.estimatedHours || 0,
      deliverables: task.deliverables || [],
      submittedFiles: task.submittedFiles || [],
      aiReview: task.aiReview || { status: "Not Started", feedback: null }
    }));

    return NextResponse.json({ tasks: transformedTasks });

  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new task
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only owners and companies can create tasks
    if (!["owner", "company"].includes(auth.user?.userType)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { 
      title, 
      project, 
      client, 
      description, 
      status, 
      priority, 
      dueDate, 
      assignedBy, 
      assignedTo, 
      estimatedHours,
      deliverables 
    } = body;

    if (!title || !project || !client || !assignedTo) {
      return NextResponse.json({ 
        error: "Missing required fields: title, project, client, assignedTo" 
      }, { status: 400 });
    }

    // Generate task ID
    const taskId = `TASK-${Date.now()}`;

    const taskData: Omit<Task, '_id'> = {
      id: taskId,
      title,
      project,
      client,
      description: description || "",
      status: status || "Pending",
      priority: priority || "Medium",
      dueDate: dueDate || "",
      progress: 0,
      assignedBy: assignedBy || auth.user?.email || "",
      assignedTo,
      estimatedHours: estimatedHours || 0,
      loggedHours: 0,
      deliverables: deliverables || [],
      submittedFiles: [],
      aiReview: {
        status: "Not Started",
        feedback: null
      },
      createdAt: new Date(),
      createdBy: auth.user?.email || ""
    };

    const result = await createTask(taskData);

    // Return the created task
    const { db } = await connectToDatabase();
    const createdTask = await db.collection("tasks").findOne({ _id: result.insertedId });

    return NextResponse.json({ 
      task: createdTask,
      message: "Task created successfully" 
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update task
export async function PUT(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const url = new URL(req.url);
    const taskId = url.searchParams.get('id');
    
    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    // Check permissions
    const { db } = await connectToDatabase();
    const { ObjectId } = await import("mongodb");
    const task = await db.collection("tasks").findOne({ 
      _id: new ObjectId(taskId) 
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Employees can only update their own tasks
    if (auth.user?.userType === "employee") {
      if (task.assignedTo !== auth.user.email) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const body = await req.json();
    const updates = { ...body, updatedAt: new Date() };

    const result = await updateTask(taskId, updates);
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task updated successfully" });

  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete task
export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only owners and companies can delete tasks
    if (!["owner", "company"].includes(auth.user?.userType)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const taskId = url.searchParams.get('id');
    
    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const { ObjectId } = await import("mongodb");
    
    // Delete the task
    const result = await db.collection("tasks").deleteOne({ 
      _id: new ObjectId(taskId) 
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });

  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
