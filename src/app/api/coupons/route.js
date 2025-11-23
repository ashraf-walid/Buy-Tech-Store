import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Coupon from '@/models/Coupon';

export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { message: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: data.code.toUpperCase() });
    if (existingCoupon) {
      return NextResponse.json(
        { message: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    const coupon = await Coupon.create({
      ...data,
      code: data.code.toUpperCase(),
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { message: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}
