import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { requireAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const admins = JSON.parse(process.env.ADMINS);

    if (!admins[username]) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const user = admins[username];

    if (user.password !== password) {
      return NextResponse.json({ message: "Wrong password" }, { status: 401 });
    }

    const token = jwt.sign(
      { username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("✅ JWT Token created successfully");

    const res = NextResponse.json({ message: "Logged in", role: user.role });

    res.cookies.set({
      name: "auth",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 2 * 60 * 60, // 2 hours
    });

    console.log("Auth cookie set successfully");
    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const token = req.cookies.get("auth")?.value;
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    requireAuth(req);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ message: "Authenticated", role: decoded.role });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}