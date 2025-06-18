import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getOwnerProfile, getCompanyProfile, getEmployeeProfile } from "@/lib/actors";

// JWT secret (should be in .env file in production)
const JWT_SECRET = process.env.JWT_SECRET || "trictux-secret-key";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Find the user
    const user = await db.collection("users").findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    
    // Get user profile based on user type
    let profile;
    if (user.userType === "owner") {
      profile = await getOwnerProfile(email);
    } else if (user.userType === "company") {
      profile = await getCompanyProfile(email);
    } else if (user.userType === "employee") {
      profile = await getEmployeeProfile(email);
    }
    
    // Create a JWT token
    const token = jwt.sign(
      { 
        id: user._id.toString(),
        email: user.email,
        userType: user.userType,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Get the user's name from their profile
    let name = email.split('@')[0]; // Default to username part of email
    if (profile) {
      if (user.userType === "owner") {
        name = profile.name;
      } else if (user.userType === "company") {
        name = profile.companyName;
      } else if (user.userType === "employee") {
        name = profile.fullName;
      }
    }
    
    // Set cookie in the response
    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        userType: user.userType,
        name: name
      }
    });
    
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
