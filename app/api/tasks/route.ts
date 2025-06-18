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
    const employeeEmail = url.searchParams.get('employeeEmail');    let tasks: any[] = [];
    if (projectId) {
      tasks = await getTasksByProject(projectId);
    } else if (employeeEmail && auth.user?.userType === "employee" && auth.user.email === employeeEmail) {
      tasks = await getTasksByEmployee(employeeEmail);
    } else if (auth.user?.userType === "employee") {
      tasks = await getTasksByEmployee(auth.user.email);
    } else {
      // For owners and companies, get all tasks or tasks by project
      const { db } = await connectToDatabase();
      if (auth.user?.userType === "owner") {
        tasks = await db.collection("tasks").find({}).toArray();
      } else if (auth.user?.userType === "company") {
        // Get tasks for projects belonging to this company
        const companyProfile = await db.collection("companies").findOne({ email: auth.user.email });
        const projects = await db.collection("projects").find({ 
          companyId: companyProfile?._id?.toString() || auth.user.email 
        }).toArray();
        const projectIds = projects.map(p => p._id?.toString()).filter(Boolean);
        tasks = await db.collection("tasks").find({ 
          projectId: { $in: projectIds }
        }).toArray();
      } else {
        tasks = [];
      }
    }

    // Add project and employee details to each task
    const { db } = await connectToDatabase();
    const tasksWithDetails = await Promise.all(
      tasks.map(async (task) => {
        const { ObjectId } = await import("mongodb");
        const project = await db.collection("projects").findOne({ 
          _id: new ObjectId(task.projectId) 
        });
        const employee = await db.collection("employees").findOne({ 
          email: task.assignedTo 
        });
        
        return {
          ...task,
          id: task._id?.toString(),
          projectName: project?.title || "Unknown Project",
          employeeName: employee?.fullName || task.assignedTo
        };
      })
    );

    return NextResponse.json({ tasks: tasksWithDetails });

  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ 
      error: "Failed to fetch tasks" 
    }, { 
      status: 500 
    });
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
    if (auth.user?.userType === "employee") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const { title, description, projectId, assignedTo, estimatedHours, dueDate, priority } = data;

    if (!title || !projectId || !assignedTo) {
      return NextResponse.json({ 
        error: "Title, project ID, and assigned employee are required" 
      }, { 
        status: 400 
      });
    }

    // Verify project access for companies
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
      if (project.companyId !== companyProfile?._id?.toString() && project.companyId !== auth.user.email) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const task: Omit<Task, '_id'> = {
      title,
      description,
      status: "todo",
      priority: priority || "medium",
      projectId,
      assignedTo,
      estimatedHours,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdAt: new Date(),
      createdBy: auth.user?.email || ""
    };

    const result = await createTask(task);

    return NextResponse.json({ 
      success: true, 
      taskId: result.insertedId,
      message: "Task created successfully"
    });

  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ 
      error: "Failed to create task" 
    }, { 
      status: 500 
    });
  }
}

// PATCH - Update task
export async function PATCH(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const data = await req.json();
    const { taskId, updates } = data;

    if (!taskId) {
      return NextResponse.json({ 
        error: "Task ID is required" 
      }, { 
        status: 400 
      });
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
      // Limit what employees can update
      const allowedFields = ['status', 'actualHours', 'completedAt'];
      const filteredUpdates = Object.keys(updates)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updates[key];
          return obj;
        }, {} as any);
      
      // If marking as completed, set completedAt
      if (filteredUpdates.status === 'completed' && !filteredUpdates.completedAt) {
        filteredUpdates.completedAt = new Date();
      }
      
      await updateTask(taskId, filteredUpdates);
    } else {
      // Companies and owners can update more fields
      await updateTask(taskId, updates);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ 
      error: "Failed to update task" 
    }, { 
      status: 500 
    });
  }
}
