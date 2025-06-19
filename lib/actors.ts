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
  _id?: string;
  id: string;
  email: string;
  name: string;
  location: string;
  specialties: string[];
  currentWorkload: number;
  successRate: number;
  avgDeliveryTime: string;
  activeProjects: number;
  completedProjects: number;
  teamSize: number;
  rating: number;
  lastDelivery: string;
  revenue: number;
  status: "Active" | "Inactive";
  joinDate: string;
  userType: "company";
  createdAt: Date;
  updatedAt?: Date;
  phone?: string;
  website?: string;
  industry?: string;
  size?: string;
  description?: string;
  avatar?: string;
  verified: boolean;
  contactPerson?: string;
  address?: string;
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
  id: string;
  name: string;
  description: string;
  client: {
    id: string;
    name: string;
  };
  company: {
    id: string;
    name: string;
  };
  status: "Planning" | "In Progress" | "Testing" | "Blocked" | "Deploying" | "Completed";
  priority: "Critical" | "High" | "Medium" | "Low";
  phase: string;
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  teamLead: string;
  teamSize: number;
  milestones: number;
  completedMilestones: number;
  nextMilestone: string;
  risk: "Low" | "Medium" | "High";
  tags: string[];
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string;
};

export type Client = {
  _id?: string;
  id: string;
  name: string;
  industry: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  projects: number;
  activeProjects: number;
  totalValue: number;
  lastContact: string;
  satisfaction: number;
  status: "Active" | "Inactive";
  contact: {
    email: string;
    phone: string;
    person: string;
  };
  location: string;
  joinDate: string;
  password?: string;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string;
  companyId?: string;
};

export type Task = {
  _id?: string;
  id: string;
  title: string;
  project: string;
  client: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed" | "Blocked";
  priority: "Critical" | "High" | "Medium" | "Low";
  dueDate: string;
  progress: number;
  assignedBy: string;
  assignedTo: string;
  estimatedHours: number;
  loggedHours: number;
  deliverables: string[];
  submittedFiles: {
    name: string;
    size: string;
    uploadDate: string;
  }[];
  aiReview: {
    status: "Not Started" | "Pending" | "Approved" | "Needs Revision";
    feedback: string | null;
    score?: number;
    reviewDate?: string;
  };
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
export async function createCompanyProfile(profile: Omit<CompanyProfile, '_id'>) {
  const { db } = await connectToDatabase();
  const newProfile = {
    ...profile,
    id: profile.id || `COMP-${Date.now()}`,
    createdAt: new Date(),
    status: profile.status || "Active" as const,
    verified: profile.verified ?? false
  };
  return await db.collection("companies").insertOne(newProfile);
}

export async function getCompanyProfile(email: string) {
  const { db } = await connectToDatabase();
  return await db.collection("companies").findOne({ email });
}

export async function getAllCompanies() {
  const { db } = await connectToDatabase();
  return await db.collection("companies").find({ status: "Active" }).toArray();
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
  return await db.collection("employees").find({ 
    companyEmail: companyEmail, 
    status: "active" 
  }).toArray();
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
  const newProject = {
    ...project,
    id: project.id || `PRJ-${Date.now()}`,
    createdAt: new Date(),
    progress: project.progress || 0,
    spent: project.spent || 0,
    completedMilestones: project.completedMilestones || 0
  };
  return await db.collection("projects").insertOne(newProject);
}

export async function getProjectsByCompany(companyId: string) {
  const { db } = await connectToDatabase();
  return await db.collection("projects").find({ "company.id": companyId }).toArray();
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
  const newClient = {
    ...client,
    id: client.id || `CLI-${Date.now()}`,
    createdAt: new Date(),
    status: client.status || "Active" as const,
    projects: client.projects || 0,
    activeProjects: client.activeProjects || 0,
    totalValue: client.totalValue || 0,
    satisfaction: client.satisfaction || 0,
    lastContact: client.lastContact || new Date().toISOString().split('T')[0],
    joinDate: client.joinDate || new Date().toISOString().split('T')[0]
  };
  return await db.collection("clients").insertOne(newClient);
}

export async function getClientsByCompany(companyId: string) {
  const { db } = await connectToDatabase();
  return await db.collection("clients").find({ 
    $or: [
      { companyId: companyId },
      { "company.id": companyId }
    ]
  }).toArray();
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
  const newTask = {
    ...task,
    id: task.id || `TASK-${Date.now()}`,
    createdAt: new Date(),
    status: task.status || "Pending" as const,
    progress: task.progress || 0,
    loggedHours: task.loggedHours || 0,
    submittedFiles: task.submittedFiles || [],
    aiReview: task.aiReview || { status: "Not Started" as const, feedback: null }
  };
  return await db.collection("tasks").insertOne(newTask);
}

export async function getTasksByProject(projectId: string) {
  const { db } = await connectToDatabase();
  return await db.collection("tasks").find({ 
    $or: [
      { projectId: projectId },
      { project: projectId }
    ]
  }).toArray();
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
