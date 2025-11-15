import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // Get admin password from environment variable
    const adminPassword = process.env.ADMIN_PASSWORD || "tourbrain2025";

    if (password === adminPassword) {
      // Set secure session cookie
      const cookieStore = await cookies();
      cookieStore.set("admin-session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE() {
  // Logout endpoint
  const cookieStore = await cookies();
  cookieStore.delete("admin-session");
  return NextResponse.json({ success: true });
}
