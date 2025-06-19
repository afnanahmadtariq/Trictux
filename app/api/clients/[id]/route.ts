import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { verify } from "jsonwebtoken";

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

// GET - Fetch single client by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { db } = await connectToDatabase();
    const { ObjectId } = await import("mongodb");
    
    let client;
    
    // Try to find by ObjectId first, then by custom id
    try {
      client = await db.collection("clients").findOne({ _id: new ObjectId(params.id) });
    } catch {
      // If ObjectId fails, try finding by custom id
      client = await db.collection("clients").findOne({ id: params.id });
    }

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Check permissions
    if (auth.user?.userType === "company") {
      // Companies can only see their own clients
      const companyProfile = await db.collection("companies").findOne({ email: auth.user.email });
      const companyId = companyProfile?.id || companyProfile?._id?.toString() || auth.user.email;
      
      if (client.companyId !== companyId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else if (auth.user?.userType === "employee") {
      // Employees can only see clients from projects they're assigned to
      const projects = await db.collection("projects").find({ 
        assignedEmployees: { $in: [auth.user?.email] }
      }).toArray();
      
      const clientIds = projects.map(p => p.client.id);
      if (!clientIds.includes(client.id) && !clientIds.includes(client._id?.toString())) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    // Owners can see all clients

    return NextResponse.json({ client });
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update client by ID  
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only owners and companies can update clients
    if (!["owner", "company"].includes(auth.user?.userType)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updates = { ...body, updatedAt: new Date() };

    const { db } = await connectToDatabase();
    const { ObjectId } = await import("mongodb");
    
    let result;
    
    // Try to update by ObjectId first, then by custom id
    try {
      result = await db.collection("clients").updateOne(
        { _id: new ObjectId(params.id) },
        { $set: updates }
      );
    } catch {
      // If ObjectId fails, try updating by custom id
      result = await db.collection("clients").updateOne(
        { id: params.id },
        { $set: updates }
      );
    }
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Client updated successfully" });

  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete client by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only owners can delete clients
    if (auth.user?.userType !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { db } = await connectToDatabase();
    const { ObjectId } = await import("mongodb");
    
    let result;
    
    // Try to update by ObjectId first, then by custom id
    try {
      result = await db.collection("clients").updateOne(
        { _id: new ObjectId(params.id) },
        { $set: { status: "Inactive", updatedAt: new Date() } }
      );
    } catch {
      // If ObjectId fails, try updating by custom id
      result = await db.collection("clients").updateOne(
        { id: params.id },
        { $set: { status: "Inactive", updatedAt: new Date() } }
      );
    }
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Client deactivated successfully" });

  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
