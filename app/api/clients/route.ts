import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    // Get all clients from the database
    const clients = await db.collection("clients").find({}).toArray();
    
    return NextResponse.json({ 
      clients 
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ 
      error: "Failed to fetch clients" 
    }, { 
      status: 500 
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientData = await req.json();
    
    // Validate required fields
    if (!clientData.name || !clientData.industry || !clientData.contactPerson || !clientData.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Format the client data with default values for metrics
    const client = {
      ...clientData,
      id: `CLI-${Math.floor(Math.random() * 10000)}`, // Generate a unique ID
      projects: 0,
      activeProjects: 0,
      totalValue: 0,
      lastContact: new Date().toISOString().split('T')[0],
      satisfaction: 5.0,
      status: "Active",
      contact: {
        email: clientData.email,
        phone: clientData.phone || "Not provided",
        person: clientData.contactPerson,
      },
      location: clientData.location || "Not specified",
      joinDate: new Date().toISOString().split('T')[0],
      createdAt: new Date()
    };
    
    // Insert the client into the database
    await db.collection("clients").insertOne(client);
    
    return NextResponse.json({ 
      success: true, 
      message: "Client added successfully",
      client
    });
  } catch (error) {
    console.error("Error adding client:", error);
    return NextResponse.json({ 
      error: "Failed to add client" 
    }, { 
      status: 500 
    });
  }
}
