import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import bcrypt from "bcryptjs";
import { 
  createOwnerProfile, 
  createCompanyProfile, 
  createEmployeeProfile, 
  OwnerProfile, 
  CompanyProfile, 
  EmployeeProfile 
} from "@/lib/actors";

export async function POST(req: NextRequest) {
  const { email, password, userType, name, companyName, contactPerson, fullName, position, department } = await req.json();
  
  if (!email || !password || !userType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  
  const { db } = await connectToDatabase();
  const existing = await db.collection("users").findOne({ email });
  
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }
  
  // Create user authentication record
  const hashed = await bcrypt.hash(password, 10);
  const user = { email, password: hashed, userType, createdAt: new Date() };
  const result = await db.collection("users").insertOne(user);
  
  // Create appropriate profile based on user type
  try {
    const now = new Date();
    
    if (userType === "owner") {
      const ownerProfile: OwnerProfile = {
        email,
        name: name || email.split('@')[0], // Use part of email as name if not provided
        userType: "owner",
        createdAt: now
      };
      await createOwnerProfile(ownerProfile);
    } 
    else if (userType === "company") {
      const companyProfile: CompanyProfile = {
        email,
        companyName: companyName || "New Company", 
        contactPerson: contactPerson || name || email.split('@')[0],
        userType: "company",
        createdAt: now
      };
      await createCompanyProfile(companyProfile);
    } 
    else if (userType === "employee") {
      const employeeProfile: EmployeeProfile = {
        email,
        fullName: fullName || name || email.split('@')[0],
        position,
        department,
        userType: "employee",
        createdAt: now
      };
      await createEmployeeProfile(employeeProfile);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating user profile:", error);
    
    // Rollback user creation if profile creation fails
    await db.collection("users").deleteOne({ _id: result.insertedId });
    
    return NextResponse.json({ 
      error: "Failed to create user profile" 
    }, { 
      status: 500 
    });
  }
}
