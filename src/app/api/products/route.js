// src/app/api/products/route.js

import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import { getCache, setCache, deleteCache } from "@/lib/cache";

export async function GET() {
  try {
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
    console.log("✔️✔️✔️ products fetched from DB (cache disabled)")

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error("GET products error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch products", details: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    console.log("Adding new product to DB:", data.name);

    const newProduct = await Product.create(data);
    console.log("✅ Product created successfully:", newProduct._id);

    deleteCache("all_products");

    return Response.json({ message: "Product added successfully", product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("POST products error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return Response.json({ 
      error: "Failed to create product", 
      details: error.message,
      type: error.name 
    }, { status: 500 });
  }
}