// src/app/api/products/route.js

import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import { getCache, setCache, deleteCache } from "@/lib/cache";

export async function GET() {

  // 1) Check cache
  const cached = getCache("all_products");
  if (cached) {
    return new Response(JSON.stringify(cached), { status: 200 });
  }

  // 2) Fetch from DB
  await connectDB();
  const products = await Product.find(); 

  // 3) Save into cache
  setCache("all_products", products);
  console.log("✔️✔️✔️ products added in cache successfuly")

  return new Response(JSON.stringify(products), { status: 200 });
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    await Product.create(data);

    deleteCache("all_products");

    return Response.json({ message: "Product added successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}