import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Order from '@/models/Order';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { message: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const data = await request.json();

        const order = await Order.findByIdAndUpdate(
            id,
            { ...data },
            { new: true }
        );

        if (!order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { message: 'Failed to update order' },
            { status: 500 }
        );
    }
}
