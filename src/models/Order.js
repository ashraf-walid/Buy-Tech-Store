import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Shipping Information
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    
    // Billing Information
    billingAddress: { type: String, default: '' },
    billingCity: { type: String, default: '' },
    billingState: { type: String, default: '' },
    
    // Order Items
    items: [{
      id: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      name: { type: String, required: true },
      image: { type: String, required: false },
      slug: { type: String, required: false }
    }],
    
    // Shipping
    shipping: {
      method: { type: String, required: true },
      price: { type: Number, required: true, default: 0 }
    },
    
    // Payment
    payment: { type: String, required: true },
    
    // Pricing
    coupon: { type: String, default: '' },
    discount: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    
    // Order Status
    status: { 
      type: String, 
      default: 'pending', 
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] 
    },
    
    // User Information
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    
    // Metadata
    orderNumber: { type: String, required: true },
    notes: { type: String, default: '' }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 }, { unique: true });

// Virtual for formatted order date
orderSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Prevent model recompilation in development
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
