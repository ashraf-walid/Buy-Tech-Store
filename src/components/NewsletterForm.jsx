"use client";

import { useState } from "react";

export default function NewsletterForm({ variant = "default", className = "" }) {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError("يرجى إدخال البريد الإلكتروني");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess(false);

            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    setSuccess(true);
                    setError("هذا البريد الإلكتروني مشترك بالفعل");
                    return;
                }
                throw new Error(data.error || "Something went wrong");
            }

            setSuccess(true);
            setEmail("");
        } catch (err) {
            console.error("Error saving email:", err);
            setError(err.message || "حدث خطأ أثناء الاشتراك، حاول مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    // Variant styles
    const variants = {
        default: {
            container: "flex max-w-md mx-auto",
            input: "flex-1 px-4 py-2 rounded-l-lg border-2 border-r-0 border-gray-200 focus:outline-none focus:border-blue-500",
            button: "px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 w-24 disabled:opacity-60 disabled:cursor-not-allowed",
            buttonText: {
                idle: "اشترك",
                loading: "..."
            }
        },
        home: {
            container: "flex items-center justify-center relative",
            input: "z-20 w-full bg-gray-50 sm:w-96 py-3 pr-10 pl-4 text-black border border-gray-300 rounded-l-full focus:ring-2 focus:ring-red-500 focus:outline-none transition",
            button: "bg-red-600 text-white px-8 py-3 rounded-r-full hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap",
            buttonText: {
                idle: "اشترك الآن",
                loading: "جارٍ الاشتراك..."
            }
        }
    };

    const currentVariant = variants[variant] || variants.default;

    return (
        <div className={className}>
            <form onSubmit={handleSubmit} className={currentVariant.container}>
                <button
                    type="submit"
                    disabled={loading}
                    className={currentVariant.button}
                >
                    {loading ? currentVariant.buttonText.loading : currentVariant.buttonText.idle}
                </button>
                <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={currentVariant.input}
                />
            </form>

            {/* Messages */}
            {success && (
                <p className="text-green-600 mt-4 font-medium text-center">
                    ✅ تم الاشتراك بنجاح! شكرًا لانضمامك إلينا.
                </p>
            )}
            {error && <p className="text-red-600 mt-4 font-medium text-center">{error}</p>}
        </div>
    );
}
