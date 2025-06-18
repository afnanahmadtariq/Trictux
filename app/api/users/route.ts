import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "trictux-secret-key";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const token = req.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    let decoded;
    try {
      decoded = verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check if user is owner
    const { db } = await connectToDatabase();
    const currentUser = await db.collection("users").findOne({ 
      email: (decoded as any).email 
    });    if (!currentUser || currentUser.userType !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get the owner's profile to understand their company context
    const ownerProfile = await db.collection("owners").findOne({ email: currentUser.email });
    const ownerEmail = currentUser.email;

    // Build the list of relevant users:
    // 1. The owner himself
    // 2. Partner companies (companies in the system)
    // 3. Employees of those partner companies

    // Get the owner user record
    const ownerUser = currentUser;

    // Get all company users (partner companies)
    const companyUsers = await db.collection("users").find({ 
      userType: "company" 
    }, {
      projection: { password: 0 }
    }).toArray();

    // Get all employees that belong to partner companies
    const companies = await db.collection("companies").find({}).toArray();
    const companyEmails = companies.map(c => c.email);
    
    const employeeUsers = await db.collection("users").find({ 
      userType: "employee" 
    }, {
      projection: { password: 0 }
    }).toArray();

    // Filter employees to only include those belonging to partner companies
    const relevantEmployeeUsers = [];
    for (const empUser of employeeUsers) {
      const empProfile = await db.collection("employees").findOne({ email: empUser.email });
      if (empProfile && empProfile.companyEmail && companyEmails.includes(empProfile.companyEmail)) {
        relevantEmployeeUsers.push(empUser);
      }
    }

    // Combine all relevant users
    const users = [ownerUser, ...companyUsers, ...relevantEmployeeUsers];

    // Fetch additional profile details for each user
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        let profile = null;
        
        if (user.userType === "owner") {
          profile = await db.collection("owners").findOne({ email: user.email });
        } else if (user.userType === "company") {
          profile = await db.collection("companies").findOne({ email: user.email });
        } else if (user.userType === "employee") {
          profile = await db.collection("employees").findOne({ email: user.email });
        }        return {
          id: user._id.toString(),
          email: user.email,
          userType: user.userType,
          createdAt: user.createdAt || null,
          lastLogin: user.lastLogin || null,
          status: user.status || "active",
          profile: profile || null
        };
      })
    );

    // Get user statistics
    const stats = {
      total: users.length,
      owners: users.filter(u => u.userType === "owner").length,
      companies: users.filter(u => u.userType === "company").length,
      employees: users.filter(u => u.userType === "employee").length,
      active: users.filter(u => (u.status || "active") === "active").length,
      inactive: users.filter(u => (u.status || "active") === "inactive").length
    };

    return NextResponse.json({
      users: usersWithProfiles,
      stats
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ 
      error: "Failed to fetch users" 
    }, { 
      status: 500 
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Check authentication
    const token = req.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    let decoded;
    try {
      decoded = verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check if user is owner
    const { db } = await connectToDatabase();
    const currentUser = await db.collection("users").findOne({ 
      email: (decoded as any).email 
    });

    if (!currentUser || currentUser.userType !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, action, data } = await req.json();    if (action === "updateStatus") {
      // Update user status
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: { status: data.status, updatedAt: new Date() } }
      );

      return NextResponse.json({ success: true });
    }    if (action === "updateProfile") {
      // Update user profile in respective collection
      const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
      
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      let collection = "";
      if (user.userType === "owner") collection = "owners";
      else if (user.userType === "company") collection = "companies";
      else if (user.userType === "employee") collection = "employees";

      if (collection) {
        await db.collection(collection).updateOne(
          { email: user.email },
          { $set: { ...data, updatedAt: new Date() } }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ 
      error: "Failed to update user" 
    }, { 
      status: 500 
    });
  }
}
