import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth";

export async function POST(req) {
  try {
    requireAdmin(req);
    
    const { publicIds } = await req.json();

    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      return NextResponse.json(
        { error: 'publicIds array is required' },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      publicIds.map(id => cloudinary.uploader.destroy(id, { invalidate: true }))
    );

    const failed = results.filter(r => r.result !== 'ok');
    if (failed.length) {
      return NextResponse.json(
        {
          message: `${failed.length} image(s) failed to delete`,
          details: failed,
        },
        { status: 207 }
      );
    }

    return NextResponse.json(
      { message: 'All images deleted successfully' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    return NextResponse.json(
      { error: 'Failed to delete images', message: err.message },
      { status: 500 }
    );
  }
}