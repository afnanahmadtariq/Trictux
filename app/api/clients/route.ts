import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { verify } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createClient, getAllClients, getClientsByCompany, updateClient, Client } from "@/lib/actors";

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

// GET - Fetch clients
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const url = new URL(req.url);
    const companyId = url.searchParams.get('companyId');

    let clients;
    if (auth.user?.userType === "owner") {
      // Owners can see all clients
      clients = companyId ? await getClientsByCompany(companyId) : await getAllClients();
    } else if (auth.user?.userType === "company") {
      // Companies can only see their own clients
      const { db } = await connectToDatabase();
      const companyProfile = await db.collection("companies").findOne({ email: auth.user.email });
      clients = await getClientsByCompany(companyProfile?.id || companyProfile?._id?.toString() || auth.user.email);
    } else {
      // Employees can see clients from projects they're assigned to
      const { db } = await connectToDatabase();
      const projects = await db.collection("projects").find({ 
        assignedEmployees: { $in: [auth.user?.email] }
      }).toArray();
      
      const clientIds = projects.map(p => p.client.id);
      clients = await db.collection("clients").find({ 
        id: { $in: clientIds }
      }).toArray();
    }

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new client
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only owners and companies can create clients
    if (!["owner", "company"].includes(auth.user?.userType)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, industry, priority, email, password, phone, location, notes } = body;

    // Validate required fields
    if (!name || !industry || !email || !password) {
      return NextResponse.json({ 
        error: "Missing required fields: name, industry, email, password" 
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

    // Get company info
    let companyId = "";
    if (auth.user?.userType === "company") {
      const companyProfile = await db.collection("companies").findOne({ email: auth.user.email });
      companyId = companyProfile?.id || companyProfile?._id?.toString() || auth.user.email;
    }

    // Generate client ID
    const clientId = `CLI-${Date.now()}`;

    // Create client profile
    const clientData: Omit<Client, '_id'> = {
      id: clientId,
      name,
      industry,
      priority: priority || "Medium",
      projects: 0,
      activeProjects: 0,
      totalValue: 0,
      lastContact: new Date().toISOString().split('T')[0],
      satisfaction: 0,
      status: "Active",
      contact: {
        email,
        phone: phone || "",
        person: name
      },
      location: location || "",
      joinDate: new Date().toISOString().split('T')[0],
      notes: notes || "",
      createdAt: new Date(),
      createdBy: auth.user?.email || "",
      companyId
    };

    // Create client in database
    const result = await createClient(clientData);

    // Create user account for client
    await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      userType: "client",
      clientId: result.insertedId.toString(),
      createdAt: new Date(),
      status: "Active"
    });

    // Return the created client
    const createdClient = await db.collection("clients").findOne({ _id: result.insertedId });

    return NextResponse.json({ 
      client: createdClient,
      message: "Client created successfully" 
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update client
export async function PUT(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only owners and companies can update clients
    if (!["owner", "company"].includes(auth.user?.userType)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const clientId = url.searchParams.get('id');
    
    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const updates = { ...body, updatedAt: new Date() };

    const result = await updateClient(clientId, updates);
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Client updated successfully" });

  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete client
export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Only owners can delete clients
    if (auth.user?.userType !== "owner") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const clientId = url.searchParams.get('id');
    
    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const { ObjectId } = await import("mongodb");
    
    // Update status to inactive instead of deleting
    const result = await db.collection("clients").updateOne(
      { _id: new ObjectId(clientId) },
      { $set: { status: "Inactive", updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Client deactivated successfully" });

  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
