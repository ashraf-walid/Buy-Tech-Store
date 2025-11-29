import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    requireAdmin(req);
    const client = await clerkClient();
    const response = await client.users.getUserList();
    const sanitizedUsers = response.data.map(u => ({
      id: u.id,
      email: u.emailAddresses?.[0]?.emailAddress,
      firstName: u.firstName,
      lastName: u.lastName,
      createdAt: u.createdAt,
      lastLogin: u.lastSignInAt,
      role: u.publicMetadata?.role || "user",
      imageUrl: u.imageUrl,
    }));
    return NextResponse.json({
      count: sanitizedUsers.length,
      users: sanitizedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error", detail: error.message },
      { status: 500 }
    );
  }
}
