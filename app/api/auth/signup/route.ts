import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import bcrypt from "bcryptjs";
import { createOwnerProfile, OwnerProfile } from "@/lib/actors";

export async function POST(req: NextRequest) {
  const { email, password, userType, name } = await req.json();
  
  // Only allow owner signup
  if (userType !== "owner") {
    return NextResponse.json({ 
      error: "Only platform owners can sign up directly. Companies and employees are added by owners." 
    }, { 
      status: 403 
    });
  }
  
  if (!email || !password || !name) {
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
    // Create owner profile
  try {
    const now = new Date();
    const ownerProfile: OwnerProfile = {
      email,
      name: name || email.split('@')[0], // Use part of email as name if not provided
      userType: "owner",
      createdAt: now,
      status: "active"
    };
    
    await createOwnerProfile(ownerProfile);
    
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
