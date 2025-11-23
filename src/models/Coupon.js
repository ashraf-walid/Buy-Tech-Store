import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true },
        discount: { type: Number, required: true, min: 0, max: 100 },
        isActive: { type: Boolean, default: true },
        expiryDate: { type: Date },
        usageLimit: { type: Number, default: null }, // Optional: Limit number of times coupon can be used
        usedCount: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

export default Coupon;
