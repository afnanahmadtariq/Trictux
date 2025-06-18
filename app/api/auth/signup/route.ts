import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password, userType } = await req.json();
  if (!email || !password || !userType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const { db } = await connectToDatabase();
  const existing = await db.collection("users").findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = { email, password: hashed, userType, createdAt: new Date() };
  await db.collection("users").insertOne(user);
  return NextResponse.json({ success: true });
}
