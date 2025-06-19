import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { verify } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createCompanyProfile, getAllCompanies, updateCompanyProfile, CompanyProfile } from "@/lib/actors";

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

// GET - Fetch all companies
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const companies = await getAllCompanies();
    
    // Add project statistics for each company
    const { db } = await connectToDatabase();
    const companiesWithStats = await Promise.all(
      companies.map(async (company: any) => {
        const projects = await db.collection("projects").find({ 
          "company.id": company.id || company._id?.toString()
        }).toArray();
        
        const employees = await db.collection("employees").find({ 
          companyEmail: company.email,
          status: "Active"
        }).toArray();

        const activeProjects = projects.filter((p: any) => 
          ["In Progress", "Testing", "Deploying"].includes(p.status)
        ).length;
        
        const completedProjects = projects.filter((p: any) => p.status === "Completed").length;
        
        const currentWorkload = activeProjects > 0 ? Math.min((activeProjects / (company.teamSize || 10)) * 100, 100) : 0;
        
        const successRate = projects.length > 0 ? (completedProjects / projects.length) * 100 : 0;

        return {
          ...company,
          currentWorkload: Math.round(currentWorkload),
          successRate: Math.round(successRate * 10) / 10,
          activeProjects,
          completedProjects,
          teamSize: employees.length || company.teamSize || 0,
          revenue: projects.reduce((sum: number, p: any) => sum + (p.budget || 0), 0)
        };
      })
    );

    return NextResponse.json({ companies: companiesWithStats });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new company
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only owners can create companies
    if (auth.user?.userType !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, location, teamSize, specialties, description, email, password } = body;

    // Validate required fields
    if (!name || !location || !email || !password) {
      return NextResponse.json({ 
        error: "Missing required fields: name, location, email, password" 
      }, { status: 400 });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ 
        error: "Password must be at least 8 characters, include uppercase, lowercase, number, and special character" 
      }, { status: 400 });
    }

    // Check if email already exists
    const { db } = await connectToDatabase();
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate company ID
    const companyId = `COMP-${Date.now()}`;

    // Create company profile
    const companyData: Omit<CompanyProfile, '_id'> = {
      id: companyId,
      email,
      name,
      location,
      specialties: specialties || [],
      currentWorkload: 0,
      successRate: 0,
      avgDeliveryTime: "0 months",
      activeProjects: 0,
      completedProjects: 0,
      teamSize: parseInt(teamSize) || 0,
      rating: 0,
      lastDelivery: "No deliveries yet",
      revenue: 0,
      status: "Active",
      joinDate: new Date().toISOString().split('T')[0],
      userType: "company",
      createdAt: new Date(),
      verified: false,
      description: description || ""
    };

    // Create company in database
    const result = await createCompanyProfile(companyData);

    // Create user account for company
    await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      userType: "company",
      companyId: result.insertedId.toString(),
      createdAt: new Date(),
      status: "Active"
    });

    // Return the created company
    const createdCompany = await db.collection("companies").findOne({ _id: result.insertedId });

    return NextResponse.json({ 
      company: createdCompany,
      message: "Company created successfully" 
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update company
export async function PUT(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only owners and the company itself can update
    if (!["owner", "company"].includes(auth.user?.userType)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const companyId = url.searchParams.get('id');
    
    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    // Check if company is updating their own profile
    if (auth.user?.userType === "company") {
      const { db } = await connectToDatabase();
      const companyProfile = await db.collection("companies").findOne({ email: auth.user.email });
      if (companyProfile?.id !== companyId && companyProfile?._id?.toString() !== companyId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const body = await req.json();
    const updates = { ...body, updatedAt: new Date() };

    const result = await updateCompanyProfile(auth.user?.email || "", updates);
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Company updated successfully" });

  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete company
export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only owners can delete companies
    if (auth.user?.userType !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const companyId = url.searchParams.get('id');
    
    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const { ObjectId } = await import("mongodb");
    
    // Update status to inactive instead of deleting
    const result = await db.collection("companies").updateOne(
      { _id: new ObjectId(companyId) },
      { $set: { status: "Inactive", updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Company deactivated successfully" });

  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
