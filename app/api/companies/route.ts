import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import bcrypt from "bcryptjs";
import { createCompanyProfile, CompanyProfile } from "@/lib/actors";

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    // Get all companies from the database
    const companies = await db.collection("companies").find({}).toArray();
    
    return NextResponse.json({ 
      companies 
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ 
      error: "Failed to fetch companies" 
    }, { 
      status: 500 
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const companyData = await req.json();
    
    // Validate required fields
    if (!companyData.name || !companyData.location || !companyData.teamSize || 
        !companyData.email || !companyData.password || !companyData.contactPerson) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Check if user with this email already exists
    const existingUser = await db.collection("users").findOne({ email: companyData.email });
    if (existingUser) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(companyData.password, 10);
    
    // Create user auth record
    const user = { 
      email: companyData.email, 
      password: hashedPassword, 
      userType: "company", 
      createdAt: new Date() 
    };
    
    await db.collection("users").insertOne(user);
    
    // Format the company data with default values for metrics
    const company = {
      ...companyData,
      id: `COMP-${Math.floor(Math.random() * 10000)}`, // Generate a unique ID
      teamSize: parseInt(companyData.teamSize), // Convert to number
      currentWorkload: 0, // Default values for new companies
      successRate: 100,
      avgDeliveryTime: "0 months",
      activeProjects: 0,
      completedProjects: 0,
      rating: 5.0,
      revenue: 0,
      status: "Active",
      joinDate: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
      createdAt: new Date()
    };
    
    // Insert the company into the database
    await db.collection("companies").insertOne(company);
    
    // Create company profile
    const companyProfile: CompanyProfile = {
      email: companyData.email,
      companyName: companyData.name,
      contactPerson: companyData.contactPerson,
      userType: "company",
      createdAt: new Date()
    };
    
    await createCompanyProfile(companyProfile);
    
    // Remove password from response
    const { password, ...companyWithoutPassword } = company;
    
    return NextResponse.json({ 
      success: true, 
      message: "Company added successfully",
      company: companyWithoutPassword
    });
  } catch (error) {
    console.error("Error adding company:", error);
    return NextResponse.json({ 
      error: "Failed to add company" 
    }, { 
      status: 500 
    });
  }
}
