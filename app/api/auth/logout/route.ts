import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Create a response that clears the auth cookie
  const response = NextResponse.json({ success: true });

  // Clear the auth token cookie robustly
  response.cookies.set({
    name: 'auth_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    expires: new Date(0), // Expire immediately
    path: '/',
    sameSite: 'lax', // Match your login cookie settings
  });

  return response;
}
