import { connectDB } from "@/lib/mongoose";
import Order from "@/models/Order";

export async function GET() {
  await connectDB();

  const latestOrder = await Order
    .findOne()
    .sort({ createdAt: -1 })
    .select("createdAt");

  return Response.json({
    lastOrderTime: latestOrder?.createdAt || null
  });
}
