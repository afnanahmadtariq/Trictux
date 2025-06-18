import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongo";
import { getOwnerProfile, getCompanyProfile, getEmployeeProfile } from "@/lib/actors";

// JWT secret (should be in .env file in production)
const JWT_SECRET = process.env.JWT_SECRET || "trictux-secret-key";

export async function GET(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = req.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        authenticated: false,
        message: "Not authenticated" 
      }, { 
        status: 401 
      });
    }
    
    // Verify the token
    let decoded;
    try {
      decoded = verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ 
        authenticated: false,
        message: "Invalid token" 
      }, { 
        status: 401 
      });
    }
    
    // Token is valid, get user information
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ 
      email: (decoded as any).email 
    }, { 
      projection: { password: 0 } // Exclude password
    });
    
    if (!user) {
      return NextResponse.json({ 
        authenticated: false,
        message: "User not found" 
      }, { 
        status: 404 
      });
    }
    
    // Get user profile based on user type
    let profile;
    if (user.userType === "owner") {
      profile = await getOwnerProfile(user.email);
    } else if (user.userType === "company") {
      profile = await getCompanyProfile(user.email);
    } else if (user.userType === "employee") {
      profile = await getEmployeeProfile(user.email);
    }
    
    // Return user info
    return NextResponse.json({
      authenticated: true,
      user: {
        email: user.email,
        userType: user.userType,
        name: profile?.name || profile?.companyName || profile?.fullName || user.email.split('@')[0]
      }
    });
    
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ 
      authenticated: false,
      message: "Authentication check failed" 
    }, { 
      status: 500 
    });
  }
}
