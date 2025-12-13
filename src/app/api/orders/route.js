import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import { requireAdmin } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    
    const orderData = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'phone', 'address', 'city', 'state',
      'items', 'shipping', 'payment', 'subtotal', 'total',
      'userId', 'userEmail', 'orderNumber'
    ];
    
    const missingFields = requiredFields.filter(field => !orderData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Create and save the order
    const order = new Order(orderData);
    await order.save();
    
    // Increment coupon usage if applicable
    if (orderData.coupon) {
      await Coupon.findOneAndUpdate(
        { code: orderData.coupon },
        { $inc: { usedCount: 1 } }
      );
    }
    
    // Return the created order
    return NextResponse.json({ 
      success: true, 
      orderId: order._id,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order with this order number already exists',
          code: 'DUPLICATE_ORDER'
        },
        { status: 409 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error',
          details: errors,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order',
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}

// Add GET endpoint to fetch orders (for admin panel)
export async function GET(request) {
  
  try {
    await requireAdmin(request);
    await connectDB();
    
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({ success: true, data: orders });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch orders',
        code: 'FETCH_ORDERS_ERROR'
      },
      { status: 500 }
    );
  }
}
