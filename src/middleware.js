import { NextResponse } from "next/server";
import { jwtVerify } from 'jose';

// import { clerkMiddleware } from "@clerk/nextjs/server";
// export default clerkMiddleware();

export async function middleware(req) {

  console.log("🔵🔥 MIDDLEWARE FIRED → pathname:", req.nextUrl.pathname);

  const protectedRoutes = ['/dashboard', '/editor-panel', '/reports'];
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  // If it's not a protected route, let it pass (this allows /, /login, /api/auth/login, etc.)
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth")?.value;
  console.log("🎯 the value of token from middleware file is:", token ? token.substring(0, 20) + "..." : "No token");

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    console.log("No token found for protected route, redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    console.log("JWT Secret:", process.env.JWT_SECRET ? "***" : "MISSING");
    console.log("Token:", token.substring(0, 20) + "...");
    // Verify token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    console.log("Token verified, user role:", payload.role);
    // Check if user is trying to access admin route without admin role
    if (req.nextUrl.pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT Verification Error:", {
      name: err.name,
      message: err.message,
      expiredAt: err.expiredAt
    });
    console.log("JWT Secret exists:", !!process.env.JWT_SECRET);
    console.log("Token exists:", !!token);
    console.log("❗redirect to login Page");
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/editor-panel/:path*",
    "/reports/:path*",
    "/_next/data/:path*/dashboard/:path*",
    "/_next/data/:path*/editor-panel/:path*",
    "/_next/data/:path*/reports/:path*",
    // Removed the catch-all pattern to avoid intercepting public routes
  ],
};