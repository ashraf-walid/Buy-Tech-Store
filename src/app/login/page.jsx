// src/app/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      console.log("Attempting to log in...");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for httpOnly cookies
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("Login response:", { status: res.status, data });

      if (res.ok) {
        console.log("Login successful, user role:", data.role);
        // Store user role in sessionStorage
        sessionStorage.setItem("userRole", data.role);
        sessionStorage.setItem("isAuthenticated", "true");

        // Force a full page reload to ensure middleware runs
        if (data.role === "admin") {
          window.location.href = "/dashboard";
        } else if (data.role === "editor") {
          window.location.href = "/editor-panel";
        } else if (data.role === "manager") {
          window.location.href = "/reports";
        } else {
          window.location.href = "/";
        }
      } else {
        sessionStorage.removeItem("userRole");
        sessionStorage.removeItem("isAuthenticated");
        const errorMessage = data.message || data.error || "Login failed. Please check your credentials.";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Login error details:", err);
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("isAuthenticated");
      if (err.message.includes("Failed to fetch")) {
        setError("تعذر الاتصال بالسيرفر. يرجى التحقق من اتصال الإنترنت.");
      } else {
        setError(err.message || "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 mx-2" dir="ltr">
      <div className="w-full mx-auto mt-32">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-6 sm:p-8 w-full max-w-md mx-auto grid gap-2"
          aria-label="Login Form"
        >
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Log in to continue to the control panel.
          </p>

          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="username"
          >
            user name
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            autoComplete="username"
            required
          />

          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="password"
          >
            password
          </label>
          <div className="relative mb-4">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-2 my-auto px-3 py-1 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-blue-300 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <span
                  className="inline-block h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin cursor-not-allowed"
                  aria-hidden="true"
                />
              )}
              {isSubmitting ? "Loginning..." : "Login"}{" "}
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            Only admins allowed
          </div>
        </form>
      </div>
    </main>
  );
}
