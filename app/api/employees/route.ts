import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import bcrypt from "bcryptjs";
import { createEmployeeProfile, EmployeeProfile } from "@/lib/actors";

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    // Get all employees from the database
    const employees = await db.collection("employees").find({}).toArray();
    
    return NextResponse.json({ 
      employees 
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ 
      error: "Failed to fetch employees" 
    }, { 
      status: 500 
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const employeeData = await req.json();
    
    // Validate required fields
    if (!employeeData.name || !employeeData.email || !employeeData.password || !employeeData.role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Check if user with this email already exists
    const existingUser = await db.collection("users").findOne({ email: employeeData.email });
    if (existingUser) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(employeeData.password, 10);
    
    // Create user auth record
    const user = { 
      email: employeeData.email, 
      password: hashedPassword, 
      userType: "employee", 
      createdAt: new Date() 
    };
    
    await db.collection("users").insertOne(user);
    
    // Format employee data
    const skills = employeeData.skills ? 
      employeeData.skills.split(',').map((skill: string) => skill.trim()) : 
      [];
    
    const employee = {
      id: `EMP-${Math.floor(Math.random() * 10000)}`, // Generate a unique ID
      name: employeeData.name,
      role: employeeData.role,
      email: employeeData.email,
      phone: employeeData.phone || "",
      skills: skills,
      currentTasks: 0,
      completedTasks: 0,
      availability: "Available",
      joinDate: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
      performance: 100,
      projects: [],
      createdAt: new Date()
    };
    
    // Insert the employee into the database
    await db.collection("team_members").insertOne(employee);
    
    // Create employee profile
    const employeeProfile: EmployeeProfile = {
      email: employeeData.email,
      fullName: employeeData.name,
      position: employeeData.role,
      department: "",
      userType: "employee",
      createdAt: new Date()
    };
    
    await createEmployeeProfile(employeeProfile);
    
    // Remove password from response
    const { password, ...employeeWithoutPassword } = employeeData;
    
    return NextResponse.json({ 
      success: true, 
      message: "Employee added successfully",
      employee: employeeWithoutPassword
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    return NextResponse.json({ 
      error: "Failed to add employee" 
    }, { 
      status: 500 
    });
  }
}
