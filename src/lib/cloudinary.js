// src/lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary connection
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteImageByUrl = async (url) => {
  if (!url || !url.includes("cloudinary")) return;
  try {
    // Extract public_id from URL
    // URL format: https://res.cloudinary.com/[cloud_name]/image/upload/v[version]/[folder]/[id].[ext]
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted image: ${publicId}`);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

export default cloudinary;
