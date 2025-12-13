import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    discount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    leftImage: { type: String, required: true },
    rightImage: { type: String, required: true },
    buttonText: { type: String, required: true },
    buttonLink: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });


export default mongoose.models.Sale || mongoose.model("Sale", saleSchema);
