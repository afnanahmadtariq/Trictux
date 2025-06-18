import { connectToDatabase } from "@/lib/mongo";

export async function getUserProfile(email: string) {
  const { db } = await connectToDatabase();
  const user = await db.collection("users").findOne({ email }, { projection: { password: 0 } });
  return user;
}
