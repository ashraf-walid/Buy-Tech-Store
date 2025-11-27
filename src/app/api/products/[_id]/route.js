import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import { getCache, setCache, deleteCache } from "@/lib/cache";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(request, { params }) {
  try {
    await requireAdmin(request);
    await connectDB();
    const { _id } = params;

    const product = await Product.findById(_id);

    if (!product) {
        return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const deletePromises = [];

    if (product.image?.public_id) {
        deletePromises.push(cloudinary.uploader.destroy(product.image.public_id));
    }

    if (Array.isArray(product.images)) {
        product.images.forEach((img) => {
          if (img.public_id) {
            deletePromises.push(cloudinary.uploader.destroy(img.public_id));
          }
        });
    }

    await Promise.all(deletePromises);

    const deletedProduct = await Product.findByIdAndDelete(_id);

    if (!deletedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    
    deleteCache(`product_${_id}`);
    deleteCache("all_products");

    return NextResponse.json(
      { message: "Product and images deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();
    const { _id } = params;
    
    let data;
    try {
      data = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body", message: parseError.message },
        { status: 400 }
      );
    }

    if (!_id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const updated = await Product.findByIdAndUpdate(_id, data, { new: true });
    
    if (!updated) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Clear caches
    deleteCache(`product_${_id}`);
    deleteCache("all_products");
    
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("Error updating product:", err);
    return NextResponse.json(
      { error: "Failed to update product", message: err.message },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  const { _id } = params;

  // Try cache
  const cached = getCache(`product_${_id}`);
  if (cached) {
    return NextResponse.json(cached, { status: 200 });
  }

  await connectDB();
  const product = await Product.findById(_id);

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  // Save to cache
  setCache(`product_${_id}`, product);

  return NextResponse.json(product, { status: 200 });
}
