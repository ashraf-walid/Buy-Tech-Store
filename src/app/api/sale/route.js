import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Sale from "@/models/sale";
import { requireAdmin } from "@/lib/auth";

import { deleteImageByUrl } from "@/lib/cloudinary";

export async function GET() {
    try {
        await connectDB();
        // Fetch the most recent sale or a specific active one.
        // We assume a singleton pattern for the sale section.
        const sale = await Sale.findOne().sort({ createdAt: -1 });

        if (!sale) {
            // Return default structure if no sale exists
            return NextResponse.json({
                title: "Big Sale",
                discount: 0,
                startDate: new Date(),
                endDate: new Date(),
                leftImage: "",
                rightImage: "",
                buttonText: "Shop Now",
                buttonLink: "",
                isActive: false
            });
        }

        return NextResponse.json(sale);
    } catch (error) {
        console.error("Error fetching sale:", error);
        return NextResponse.json({ message: "Error fetching sale data", error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await requireAdmin(req);
        await connectDB();
        const body = await req.json();

        // Check if a sale document already exists
        let sale = await Sale.findOne().sort({ createdAt: -1 });

        if (sale) {
            // Delete old images if they are being replaced
            if (sale.leftImage && body.leftImage !== sale.leftImage) {
                await deleteImageByUrl(sale.leftImage);
            }
            if (sale.rightImage && body.rightImage !== sale.rightImage) {
                await deleteImageByUrl(sale.rightImage);
            }

            // Update existing
            sale = await Sale.findByIdAndUpdate(sale._id, body, { new: true });
        } else {
            // Create new
            sale = await Sale.create(body);
        }

        return NextResponse.json(sale, { status: 201 });
    } catch (error) {
        console.error("Error updating sale:", error);
        return NextResponse.json({ message: "Error updating sale data", error: error.message }, { status: 500 });
    }
}
