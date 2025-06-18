import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { verify } from "jsonwebtoken";
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
      clients = await getClientsByCompany(companyProfile?._id?.toString() || auth.user.email);
    } else {
      // Employees can see clients from projects they're assigned to
      const { db } = await connectToDatabase();
      const projects = await db.collection("projects").find({ 
        assignedEmployees: { $in: [auth.user?.email] }
      }).toArray();
      
      const clientIds = [...new Set(projects.map(p => p.clientId))];
      const { ObjectId } = await import("mongodb");
      clients = await db.collection("clients").find({ 
        _id: { $in: clientIds.map(id => new ObjectId(id)) }
      }).toArray();
    }

    // Add project count for each client
    const { db } = await connectToDatabase();
    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        const projects = await db.collection("projects").find({ 
          clientId: client._id?.toString() 
        }).toArray();
        
        return {
          ...client,
          id: client._id?.toString(),
          totalProjects: projects.length,
          activeProjects: projects.filter(p => p.status === "in-progress").length,
          completedProjects: projects.filter(p => p.status === "completed").length
        };
      })
    );

    return NextResponse.json({ clients: clientsWithStats });

  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ 
      error: "Failed to fetch clients" 
    }, { 
      status: 500 
    });
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
    if (auth.user?.userType === "employee") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const { name, email, phone, company, address, notes, companyId } = data;

    if (!name || !email) {
      return NextResponse.json({ 
        error: "Name and email are required" 
      }, { 
        status: 400 
      });
    }

    // Determine companyId based on user type
    let finalCompanyId = companyId;
    if (auth.user?.userType === "company") {
      const { db } = await connectToDatabase();
      const companyProfile = await db.collection("companies").findOne({ email: auth.user.email });
      finalCompanyId = companyProfile?._id?.toString() || auth.user.email;
    }

    const client: Omit<Client, '_id'> = {
      name,
      email,
      phone,
      company,
      address,
      notes,
      status: "active",
      createdAt: new Date(),
      createdBy: auth.user?.email || "",
      companyId: finalCompanyId
    };

    const result = await createClient(client);

    return NextResponse.json({ 
      success: true, 
      clientId: result.insertedId,
      message: "Client created successfully"
    });

  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ 
      error: "Failed to create client" 
    }, { 
      status: 500 
    });
  }
}

// PATCH - Update client
export async function PATCH(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Employees cannot update clients
    if (auth.user?.userType === "employee") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const { clientId, updates } = data;

    if (!clientId) {
      return NextResponse.json({ 
        error: "Client ID is required" 
      }, { 
        status: 400 
      });
    }

    // Check permissions for companies
    if (auth.user?.userType === "company") {
      const { db } = await connectToDatabase();
      const { ObjectId } = await import("mongodb");
      const client = await db.collection("clients").findOne({ 
        _id: new ObjectId(clientId) 
      });

      if (!client) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 });
      }

      const companyProfile = await db.collection("companies").findOne({ email: auth.user.email });
      if (client.companyId !== companyProfile?._id?.toString() && client.companyId !== auth.user.email) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    await updateClient(clientId, updates);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json({ 
      error: "Failed to update client" 
    }, { 
      status: 500 
    });
  }
}
