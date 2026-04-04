import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { requireAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    console.log("Login attempt for user:", username);

    if (!process.env.ADMINS) {
      console.error("ADMINS environment variable is missing");
      return NextResponse.json({ message: "Server configuration error: ADMINS is missing" }, { status: 500 });
    }

    console.log("ADMINS env variable exists, length:", process.env.ADMINS.length);
    
    let admins;
    try {
      admins = JSON.parse(process.env.ADMINS);
    } catch (parseError) {
      console.error("Failed to parse ADMINS env variable:", parseError.message);
      console.error("Raw ADMINS value (first 20 chars):", process.env.ADMINS.substring(0, 20));
      return NextResponse.json({ message: "Server configuration error: ADMINS format is invalid" }, { status: 500 });
    }

    if (!admins[username]) {
      console.log("User not found:", username);
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const user = admins[username];

    if (user.password !== password) {
      console.log("Wrong password for user:", username);
      return NextResponse.json({ message: "Wrong password" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is missing");
      return NextResponse.json({ message: "Server configuration error: JWT_SECRET is missing" }, { status: 500 });
    }

    const token = jwt.sign(
      { username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("✅ JWT Token created successfully for:", username);

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

    console.log("Auth cookie set successfully for:", username);
    return res;
  } catch (error) {
    console.error("Unexpected login error:", error);
    return NextResponse.json(
      { message: "Internal server error", details: error.message },
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