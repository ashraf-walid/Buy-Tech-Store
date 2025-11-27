import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Coupon from '@/models/Coupon';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request, { params }) {
    try {
        await requireAdmin(request);
        await connectDB();
        const { id } = params;
        const data = await request.json();

        const coupon = await Coupon.findByIdAndUpdate(
            id,
            { ...data },
            { new: true }
        );

        if (!coupon) {
            return NextResponse.json(
                { message: 'Coupon not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(coupon);
    } catch (error) {
        console.error('Error updating coupon:', error);
        return NextResponse.json(
            { message: 'Failed to update coupon' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        await requireAdmin(request);
        await connectDB();
        const { id } = params;

        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) {
            return NextResponse.json(
                { message: 'Coupon not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        return NextResponse.json(
            { message: 'Failed to delete coupon' },
            { status: 500 }
        );
    }
}
