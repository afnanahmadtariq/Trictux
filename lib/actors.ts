import { connectToDatabase } from "@/lib/mongo";

export type OwnerProfile = {
  email: string;
  name: string;
  userType: "owner";
  createdAt: Date;
  updatedAt?: Date;
  phone?: string;
  address?: string;
  avatar?: string;
  bio?: string;
  status: "active" | "inactive";
};

export type CompanyProfile = {
  email: string;
  companyName: string;
  contactPerson: string;
  address?: string;
  userType: "company";
  createdAt: Date;
  updatedAt?: Date;
  phone?: string;
  website?: string;
  industry?: string;
  size?: string;
  description?: string;
  avatar?: string;
  status: "active" | "inactive";
  verified: boolean;
};

export type EmployeeProfile = {
  email: string;
  fullName: string;
  position?: string;
  department?: string;
  userType: "employee";
  companyId?: string;
  companyEmail?: string;
  createdAt: Date;
  updatedAt?: Date;
  phone?: string;
  avatar?: string;
  bio?: string;
  salary?: number;
  hireDate?: Date;
  status: "active" | "inactive";
  skills?: string[];
};

export type Project = {
  _id?: string;
  title: string;
  description: string;
  status: "planning" | "in-progress" | "completed" | "on-hold";
  priority: "low" | "medium" | "high" | "urgent";
  companyId: string;
  clientId: string;
  assignedEmployees: string[];
  startDate: Date;
  endDate?: Date;
  budget?: number;
  actualCost?: number;
  progress: number;
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string;
};

export type Client = {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string;
  companyId: string;
};

export type Task = {
  _id?: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  projectId: string;
  assignedTo: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string;
};

// Owner Profile Functions
export async function createOwnerProfile(profile: OwnerProfile) {
  const { db } = await connectToDatabase();
  return await db.collection("owners").insertOne(profile);
}

export async function getOwnerProfile(email: string) {
  const { db } = await connectToDatabase();
  return await db.collection("owners").findOne({ email });
}

export async function updateOwnerProfile(email: string, updates: Partial<OwnerProfile>) {
  const { db } = await connectToDatabase();
  return await db.collection("owners").updateOne(
    { email },
    { $set: { ...updates, updatedAt: new Date() } }
  );
}

// Company Profile Functions
export async function createCompanyProfile(profile: CompanyProfile) {
  const { db } = await connectToDatabase();
  return await db.collection("companies").insertOne(profile);
}

export async function getCompanyProfile(email: string) {
  const { db } = await connectToDatabase();
  return await db.collection("companies").findOne({ email });
}

export async function getAllCompanies() {
  const { db } = await connectToDatabase();
  return await db.collection("companies").find({ status: "active" }).toArray();
}

export async function updateCompanyProfile(email: string, updates: Partial<CompanyProfile>) {
  const { db } = await connectToDatabase();
  return await db.collection("companies").updateOne(
    { email },
    { $set: { ...updates, updatedAt: new Date() } }
  );
}

// Employee Profile Functions
export async function createEmployeeProfile(profile: EmployeeProfile) {
  const { db } = await connectToDatabase();
  return await db.collection("employees").insertOne(profile);
}

export async function getEmployeeProfile(email: string) {
  const { db } = await connectToDatabase();
  return await db.collection("employees").findOne({ email });
}

export async function getEmployeesByCompany(companyEmail: string) {
  const { db } = await connectToDatabase();
  return await db.collection("employees").find({ companyEmail, status: "active" }).toArray();
}

export async function updateEmployeeProfile(email: string, updates: Partial<EmployeeProfile>) {
  const { db } = await connectToDatabase();
  return await db.collection("employees").updateOne(
    { email },
    { $set: { ...updates, updatedAt: new Date() } }
  );
}

// Project Functions
export async function createProject(project: Omit<Project, '_id'>) {
  const { db } = await connectToDatabase();
  return await db.collection("projects").insertOne({
    ...project,
    createdAt: new Date(),
    progress: 0
  });
}

export async function getProjectsByCompany(companyId: string) {
  const { db } = await connectToDatabase();
  return await db.collection("projects").find({ companyId }).toArray();
}

export async function getAllProjects() {
  const { db } = await connectToDatabase();
  return await db.collection("projects").find({}).toArray();
}

export async function getProjectById(projectId: string) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");
  return await db.collection("projects").findOne({ _id: new ObjectId(projectId) });
}

export async function updateProject(projectId: string, updates: Partial<Project>) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");
  return await db.collection("projects").updateOne(
    { _id: new ObjectId(projectId) },
    { $set: { ...updates, updatedAt: new Date() } }
  );
}

// Client Functions
export async function createClient(client: Omit<Client, '_id'>) {
  const { db } = await connectToDatabase();
  return await db.collection("clients").insertOne({
    ...client,
    createdAt: new Date(),
    status: "active"
  });
}

export async function getClientsByCompany(companyId: string) {
  const { db } = await connectToDatabase();
  return await db.collection("clients").find({ companyId }).toArray();
}

export async function getAllClients() {
  const { db } = await connectToDatabase();
  return await db.collection("clients").find({}).toArray();
}

export async function updateClient(clientId: string, updates: Partial<Client>) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");
  return await db.collection("clients").updateOne(
    { _id: new ObjectId(clientId) },
    { $set: { ...updates, updatedAt: new Date() } }
  );
}

// Task Functions
export async function createTask(task: Omit<Task, '_id'>) {
  const { db } = await connectToDatabase();
  return await db.collection("tasks").insertOne({
    ...task,
    createdAt: new Date(),
    status: "todo"
  });
}

export async function getTasksByProject(projectId: string) {
  const { db } = await connectToDatabase();
  return await db.collection("tasks").find({ projectId }).toArray();
}

export async function getTasksByEmployee(employeeEmail: string) {
  const { db } = await connectToDatabase();
  return await db.collection("tasks").find({ assignedTo: employeeEmail }).toArray();
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const { db } = await connectToDatabase();
  const { ObjectId } = await import("mongodb");
  return await db.collection("tasks").updateOne(
    { _id: new ObjectId(taskId) },
    { $set: { ...updates, updatedAt: new Date() } }
  );
}
