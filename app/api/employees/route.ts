import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { verify } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createEmployeeProfile, getEmployeesByCompany, updateEmployeeProfile, EmployeeProfile } from "@/lib/actors";

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

// GET - Fetch employees
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const url = new URL(req.url);
    const companyEmail = url.searchParams.get('companyEmail');

    let employees;
    if (auth.user?.userType === "owner") {
      // Owners can see all employees
      const { db } = await connectToDatabase();
      employees = companyEmail 
        ? await getEmployeesByCompany(companyEmail)
        : await db.collection("employees").find({ status: "active" }).toArray();
    } else if (auth.user?.userType === "company") {
      // Companies can only see their own employees
      employees = await getEmployeesByCompany(auth.user.email);
    } else {
      // Employees can only see themselves
      const { db } = await connectToDatabase();
      employees = await db.collection("employees").find({ 
        email: auth.user?.email, 
        status: "active" 
      }).toArray();
    }

    // Add task statistics for each employee
    const { db } = await connectToDatabase();
    const employeesWithStats = await Promise.all(
      employees.map(async (employee) => {
        const tasks = await db.collection("tasks").find({ 
          assignedTo: employee.email 
        }).toArray();
        
        const completedTasks = tasks.filter(t => t.status === "completed").length;
        const activeTasks = tasks.filter(t => t.status !== "completed").length;
        
        return {
          ...employee,
          id: employee._id?.toString(),
          totalTasks: tasks.length,
          completedTasks,
          activeTasks,
          completionRate: tasks.length > 0 ? ((completedTasks / tasks.length) * 100).toFixed(1) : "0"
        };
      })
    );

    return NextResponse.json({ employees: employeesWithStats });

  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ 
      error: "Failed to fetch employees" 
    }, { 
      status: 500 
    });
  }
}

// POST - Create new employee (owner and company only)
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only owners and companies can create employees
    if (auth.user?.userType === "employee") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const { email, fullName, position, department, phone, bio, salary, hireDate, skills, companyEmail } = data;

    if (!email || !fullName) {
      return NextResponse.json({ 
        error: "Email and full name are required" 
      }, { 
        status: 400 
      });
    }

    // Determine company association
    let finalCompanyEmail = companyEmail;
    if (auth.user?.userType === "company") {
      finalCompanyEmail = auth.user.email;
    }

    // Check if employee already exists
    const { db } = await connectToDatabase();
    const existing = await db.collection("users").findOne({ email });
    
    if (existing) {
      return NextResponse.json({ 
        error: "Employee email already exists" 
      }, { 
        status: 409 
      });
    }

    // Create user record
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      userType: "employee",
      createdAt: new Date(),
      status: "active"
    });

    // Create employee profile
    const employeeProfile: EmployeeProfile = {
      email,
      fullName,
      position,
      department,
      userType: "employee",
      companyEmail: finalCompanyEmail,
      createdAt: new Date(),
      status: "active",
      phone,
      bio,
      salary,
      hireDate: hireDate ? new Date(hireDate) : undefined,
      skills: skills || []
    };

    await createEmployeeProfile(employeeProfile);

    return NextResponse.json({ 
      success: true, 
      tempPassword,
      message: "Employee created successfully. Send the temporary password to the employee."
    });

  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ 
      error: "Failed to create employee" 
    }, { 
      status: 500 
    });
  }
}

// PATCH - Update employee
export async function PATCH(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const data = await req.json();
    const { email, updates } = data;

    if (!email) {
      return NextResponse.json({ 
        error: "Employee email is required" 
      }, { 
        status: 400 
      });
    }

    // Check permissions
    if (auth.user?.userType === "employee") {
      // Employees can only update themselves (limited fields)
      if (auth.user.email !== email) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const allowedFields = ['phone', 'bio', 'skills'];
      const filteredUpdates = Object.keys(updates)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updates[key];
          return obj;
        }, {} as any);
      
      await updateEmployeeProfile(email, filteredUpdates);
    } else if (auth.user?.userType === "company") {
      // Companies can update their own employees
      const { db } = await connectToDatabase();
      const employee = await db.collection("employees").findOne({ email });
      
      if (!employee) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
      }
      
      if (employee.companyEmail !== auth.user.email) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      
      await updateEmployeeProfile(email, updates);
    } else {
      // Owners can update any employee
      await updateEmployeeProfile(email, updates);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json({ 
      error: "Failed to update employee" 
    }, { 
      status: 500 
    });
  }
}
