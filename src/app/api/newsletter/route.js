import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";
import { requireAdmin } from '@/lib/auth';

export async function POST(req) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "البريد الإلكتروني مطلوب" },
                { status: 400 }
            );
        }

        // Check if already subscribed
        const existingSubscriber = await NewsletterSubscriber.findOne({ email });
        if (existingSubscriber) {
            return NextResponse.json(
                { message: "هذا البريد الإلكتروني مشترك بالفعل" },
                { status: 409 } // Conflict
            );
        }

        await NewsletterSubscriber.create({ email });

        return NextResponse.json(
            { message: "تم الاشتراك بنجاح" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء الاشتراك، حاول مرة أخرى" },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        requireAdmin(req);
        await connectDB();
        const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
        return NextResponse.json(subscribers);
    } catch (error) {
        console.error("Error fetching subscribers:", error);
        return NextResponse.json(
            { error: "Failed to fetch subscribers" },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        requireAdmin(req);
        await connectDB();
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await NewsletterSubscriber.findByIdAndDelete(id);
        return NextResponse.json({ message: "Subscriber deleted successfully" });
    } catch (error) {
        console.error("Error deleting subscriber:", error);
        return NextResponse.json(
            { error: "Failed to delete subscriber" },
            { status: 500 }
        );
    }
}
