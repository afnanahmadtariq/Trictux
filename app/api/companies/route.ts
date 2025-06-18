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
      companies.map(async (company) => {
        const projects = await db.collection("projects").find({ 
          companyId: company._id?.toString() || company.email 
        }).toArray();
        
        const employees = await db.collection("employees").find({ 
          companyEmail: company.email,
          status: "active"
        }).toArray();

        const completedProjects = projects.filter(p => p.status === "completed").length;
        const activeProjects = projects.filter(p => p.status === "in-progress").length;
        const totalProjects = projects.length;
        
        return {
          ...company,
          id: company._id?.toString(),
          name: company.companyName,
          location: company.address || "Not specified",
          activeProjects,
          completedProjects,
          totalProjects,
          teamSize: employees.length,
          successRate: totalProjects > 0 ? ((completedProjects / totalProjects) * 100) : 0,
          currentWorkload: activeProjects * 15, // Rough estimate
          avgDeliveryTime: "2.5 months", // This could be calculated from actual data
          specialties: employees.map(e => e.skills || []).flat().slice(0, 5)
        };
      })
    );

    return NextResponse.json({ companies: companiesWithStats });

  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ 
      error: "Failed to fetch companies" 
    }, { 
      status: 500 
    });
  }
}

// POST - Create new company (owner only)
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

    const data = await req.json();
    const { email, companyName, contactPerson, phone, website, industry, size, description, address } = data;

    if (!email || !companyName || !contactPerson) {
      return NextResponse.json({ 
        error: "Email, company name, and contact person are required" 
      }, { 
        status: 400 
      });
    }

    // Check if company already exists
    const { db } = await connectToDatabase();
    const existing = await db.collection("users").findOne({ email });
    
    if (existing) {
      return NextResponse.json({ 
        error: "Company email already exists" 
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
      userType: "company",
      createdAt: new Date(),
      status: "active"
    });

    // Create company profile
    const companyProfile: CompanyProfile = {
      email,
      companyName,
      contactPerson,
      userType: "company",
      createdAt: new Date(),
      status: "active",
      verified: false,
      phone,
      website,
      industry,
      size,
      description,
      address
    };

    await createCompanyProfile(companyProfile);

    return NextResponse.json({ 
      success: true, 
      tempPassword,
      message: "Company created successfully. Send the temporary password to the company contact person."
    });

  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json({ 
      error: "Failed to create company" 
    }, { 
      status: 500 
    });
  }
}

// PATCH - Update company
export async function PATCH(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const data = await req.json();
    const { email, updates } = data;

    // Owners can update any company, companies can update themselves
    if (auth.user?.userType !== "owner" && auth.user?.email !== email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await updateCompanyProfile(email, updates);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json({ 
      error: "Failed to update company" 
    }, { 
      status: 500 
    });
  }
}
