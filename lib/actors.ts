import { connectToDatabase } from "@/lib/mongo";

export type OwnerProfile = {
  email: string;
  name: string;
  userType: "owner";
  createdAt: Date;
  // Add more fields as needed
};

export type CompanyProfile = {
  email: string;
  companyName: string;
  contactPerson: string;
  address?: string;
  userType: "company";
  createdAt: Date;
  // Add more fields as needed
};

export type EmployeeProfile = {
  email: string;
  fullName: string;
  position?: string;
  department?: string;
  userType: "employee";
  companyId?: string;
  createdAt: Date;
  // Add more fields as needed
};

export async function createOwnerProfile(profile: OwnerProfile) {
  const { db } = await connectToDatabase();
  await db.collection("owners").insertOne(profile);
}

export async function createCompanyProfile(profile: CompanyProfile) {
  const { db } = await connectToDatabase();
  await db.collection("companies").insertOne(profile);
}

export async function createEmployeeProfile(profile: EmployeeProfile) {
  const { db } = await connectToDatabase();
  await db.collection("employees").insertOne(profile);
}

export async function getOwnerProfile(email: string) {
  const { db } = await connectToDatabase();
  return db.collection("owners").findOne({ email });
}

export async function getCompanyProfile(email: string) {
  const { db } = await connectToDatabase();
  return db.collection("companies").findOne({ email });
}

export async function getEmployeeProfile(email: string) {
  const { db } = await connectToDatabase();
  return db.collection("employees").findOne({ email });
}
