import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";

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
    if (!companyData.name || !companyData.location || !companyData.teamSize) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Connect to the database
    const { db } = await connectToDatabase();
    
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
    
    return NextResponse.json({ 
      success: true, 
      message: "Company added successfully",
      company
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
