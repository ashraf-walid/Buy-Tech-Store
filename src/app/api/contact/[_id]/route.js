import { connectDB } from "@/lib/mongoose";
import Contact from "@/models/Contact";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(request, { params }) {
  try {
    requireAdmin(request);
    
    await connectDB();
    const { _id } = params;

    const message = await Contact.findByIdAndDelete(_id);

    if (!message) {
      return Response.json(
        { error: "الرسالة غير موجودة" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "تم حذف الرسالة بنجاح" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return Response.json(
      { error: "حدث خطأ أثناء حذف الرسالة" },
      { status: 500 }
    );
  }
}

