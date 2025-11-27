import { connectDB } from "@/lib/mongoose";
import Contact from "@/models/Contact";
import { requireAdmin } from "@/lib/auth";

export async function POST(req) {
  try {
    
    await connectDB();
    const data = await req.json();

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return Response.json(
        { error: "الاسم والبريد الإلكتروني والرسالة مطلوبة" },
        { status: 400 }
      );
    }

    // Create contact message
    const contact = await Contact.create(data);

    return Response.json(
      { 
        message: "تم استلام رسالتك بنجاح",
        id: contact._id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return Response.json(
        { error: errors.join(", ") },
        { status: 400 }
      );
    }

    return Response.json(
      { error: "حدث خطأ أثناء إرسال النموذج" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    requireAdmin(req);
    await connectDB();
    
    // Get all contact messages, sorted by newest first
    const messages = await Contact.find()
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(messages, { status: 200 });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return Response.json(
      { error: "حدث خطأ أثناء جلب الرسائل" },
      { status: 500 }
    );
  }
}

