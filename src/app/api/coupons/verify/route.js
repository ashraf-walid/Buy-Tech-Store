import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Coupon from '@/models/Coupon';

export async function POST(request) {
    try {
        await connectDB();
        const { code } = await request.json();

        if (!code) {
            return NextResponse.json(
                { message: 'يرجى إدخال كود الكوبون' },
                { status: 400 }
            );
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return NextResponse.json(
                { message: 'كود الكوبون غير صحيح' },
                { status: 404 }
            );
        }

        if (!coupon.isActive) {
            return NextResponse.json(
                { message: 'هذا الكوبون غير مفعل' },
                { status: 400 }
            );
        }

        if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
            return NextResponse.json(
                { message: 'انتهت صلاحية هذا الكوبون' },
                { status: 400 }
            );
        }

        // Optional: Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return NextResponse.json(
                { message: 'تم تجاوز الحد الأقصى لاستخدام هذا الكوبون' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            discount: coupon.discount,
            message: 'تم تطبيق الكوبون بنجاح',
        });
    } catch (error) {
        console.error('Error verifying coupon:', error);
        return NextResponse.json(
            { message: 'حدث خطأ أثناء التحقق من الكوبون' },
            { status: 500 }
        );
    }
}
