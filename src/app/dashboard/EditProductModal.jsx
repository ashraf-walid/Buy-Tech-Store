"use client";
import { useState, useEffect } from "react";
import SmartSection from "@/app/dashboard/SmartFields";
import Image from "next/image";
import {
  fieldsBasic,
  fieldsMedia,
  fieldsPricing,
  fieldsSpecs,
} from "@/lib/fieldDefinitions";

export default function EditProductModal({ product, isOpen, onClose, onSave }) {
  const [productData, setProductData] = useState(product || {});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [publicIdsToDelete, setPublicIdsToDelete] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [activeTab, setActiveTab] = useState("basic");

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setProductData(product);
      setMainImageFile(null);
      setGalleryFiles([]);
      setImagesToRemove([]);
      setError("");
      setMessage("");
      setMainImagePreview(null);
      setGalleryPreviews([]);
      setActiveTab("basic");
    }
  }, [product]);

  useEffect(() => {
    return () => {
      galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [galleryPreviews]);

  // Create preview URLs when files change
  useEffect(() => {
    if (mainImageFile) {
      const url = URL.createObjectURL(mainImageFile);
      setMainImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setMainImagePreview(null);
    }
  }, [mainImageFile]);

  useEffect(() => {
    const urls = galleryFiles.map((file) => URL.createObjectURL(file));
    setGalleryPreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [galleryFiles]);

  useEffect(() => {
    return () => {
      galleryPreviews.forEach(url => URL.revokeObjectURL(url));
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
    };
  }, [galleryPreviews, mainImagePreview]);

  if (!isOpen) return null;

  // Upload images to Cloudinary
  const uploadImages = async () => {
    try {
      let mainImageUrl = null;
      const galleryUrls = [];

      if (mainImageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", mainImageFile);

        const res = await fetch("/api/uploadImages", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.url)
          mainImageUrl = { url: data.url, public_id: data.public_id };
      }

      for (const file of galleryFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/uploadImages", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.url)
          galleryUrls.push({ url: data.url, public_id: data.public_id });
      }

      return { mainImageUrl, galleryUrls };
    } catch (err) {
      console.error("Upload error:", err);
      throw new Error("Error uploading images to Cloudinary");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    try {
      setIsSaving(true);
      setUploading(true);

      if (publicIdsToDelete.length) {
        const deleteRes = await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicIds: publicIdsToDelete }),
        });

        if (!deleteRes.ok) {
          let errorMessage = "Failed to delete images from Cloudinary";
          try {
            const text = await deleteRes.text();
            if (text) {
              const err = JSON.parse(text);
              errorMessage = err.error || err.message || errorMessage;
            } else {
              errorMessage = deleteRes.statusText || errorMessage;
            }
          } catch (parseError) {
            // If response is not JSON, use status text
            errorMessage = deleteRes.statusText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        // Response is OK, clear the public IDs to delete
        setPublicIdsToDelete([]);
      }

      // Upload new images if any
      const { mainImageUrl, galleryUrls } = await uploadImages();

      // Prepare updated product data
      const updatedData = { ...productData };

      // Update main image
      if (mainImageUrl) {
        updatedData.image = mainImageUrl;
      } else if (imagesToRemove.some((url) => productData.image?.url === url)) {
        updatedData.image = null;
      }

      // Update gallery images - filter out removed ones and add new ones
      const existingGallery = Array.isArray(productData.images)
        ? productData.images.filter((img) => {
          const imageUrl = typeof img === "string" ? img : img?.url;
          return imageUrl && !imagesToRemove.includes(imageUrl);
        })
        : [];

      updatedData.images = [...existingGallery, ...galleryUrls];

      // Send update request
      const res = await fetch(`/api/products/${productData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      // Read response as text first to avoid JSON parsing errors
      const responseText = await res.text();

      if (!res.ok) {
        let errorMessage = "Update failed";
        try {
          if (responseText) {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorData.message || errorMessage;
          } else {
            errorMessage = res.statusText || errorMessage;
          }
        } catch (parseError) {
          errorMessage = res.statusText || errorMessage || "Update failed";
        }
        throw new Error(errorMessage);
      }

      // Parse successful response
      let updated;
      try {
        if (!responseText) {
          throw new Error("Empty response from server");
        }
        updated = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `Failed to parse response from server: ${parseError.message}`
        );
      }

      setMessage("✅ Product updated successfully!");
      onSave(updated);
      setTimeout(() => {
        setMainImageFile(null);
        setGalleryFiles([]);
        setImagesToRemove([]);
        onClose();
      }, 1500);
    } catch (err) {
      setError(
        "❌ Error while updating product: " + (err.message || "Unknown error")
      );
    } finally {
      setIsSaving(false);
      setUploading(false);
    }
  };

  const handleRemoveMainImage = () => {
    if (productData.image?.public_id) {
      setPublicIdsToDelete((prev) => [...prev, productData.image.public_id]);
    }
    if (productData.image?.url) {
      setImagesToRemove((prev) => [...prev, productData.image.url]);
    }
    setProductData((prev) => ({ ...prev, image: null }));
    setMainImageFile(null);
    setMainImagePreview(null);
  };

  const handleRemoveGalleryImage = (imageUrl) => {
    const img = productData.images.find(
      (i) => (typeof i === "string" ? i : i.url) === imageUrl
    );
    if (img?.public_id) setPublicIdsToDelete((p) => [...p, img.public_id]);

    setProductData((prev) => ({
      ...prev,
      images:
        prev.images?.filter(
          (img) => (typeof img === "string" ? img : img.url) !== imageUrl
        ) || [],
    }));
    setImagesToRemove((prev) => [...prev, imageUrl]);
  };

  const handleGalleryFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveGalleryFile = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => {
      const url = prev[index];
      URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const tabs = [
    { id: "basic", label: "📝 Basic Info", icon: "📝" },
    { id: "media", label: "🏷️ Media & Tags", icon: "🏷️" },
    { id: "pricing", label: "💰 Pricing", icon: "💰" },
    { id: "specs", label: "⚙️ Specs", icon: "⚙️" },
    { id: "images", label: "🖼️ Images", icon: "🖼️" },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">✏️ Edit {product.name} Product</h2>
            <p className="text-blue-100 text-sm mt-1">
              Update product information
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 bg-gray-50 px-6">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-all relative whitespace-nowrap ${activeTab === tab.id
                    ? "text-blue-600 bg-white"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {(error || message) && (
          <div className="px-6 pt-4">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center gap-3 animate-slideDown">
                <span className="text-2xl">⚠️</span>
                <p className="text-red-700">{error}</p>
              </div>
            )}
            {message && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-center gap-3 animate-slideDown">
                <span className="text-2xl">✅</span>
                <p className="text-green-700">{message}</p>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "basic" && (
            <div className="animate-fadeIn">
              <SmartSection
                legend="Basic Information"
                fields={fieldsBasic}
                data={productData}
                setData={setProductData}
                disabled={isSaving || uploading}
              />
            </div>
          )}

          {activeTab === "media" && (
            <div className="animate-fadeIn">
              <SmartSection
                legend="Media & Tags"
                fields={fieldsMedia}
                data={productData}
                setData={setProductData}
                disabled={isSaving || uploading}
              />
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="animate-fadeIn">
              <SmartSection
                legend="Pricing & Stock"
                fields={fieldsPricing}
                data={productData}
                setData={setProductData}
                disabled={isSaving || uploading}
              />
            </div>
          )}

          {activeTab === "specs" && (
            <div className="animate-fadeIn">
              <SmartSection
                legend="Specifications"
                fields={fieldsSpecs}
                data={productData}
                setData={setProductData}
                disabled={isSaving || uploading}
              />
            </div>
          )}

          {activeTab === "images" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Main Image Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span>🖼️</span> Main Product Image
                </h3>
                <div className="flex flex-wrap gap-6 items-start">
                  {(productData.image?.url || mainImagePreview) && (
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-xl overflow-hidden shadow-lg border-4 border-white bg-white">
                        <Image
                          src={mainImagePreview || productData.image?.url}
                          alt="Product"
                          width={160}
                          height={160}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveMainImage}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                        disabled={isSaving || uploading}
                      >
                        ×
                      </button>
                      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {mainImagePreview ? "New" : "Current"}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block cursor-pointer">
                      <div className="border-3 border-dashed border-blue-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
                        <div className="text-5xl mb-3">📤</div>
                        <p className="text-blue-600 font-semibold mb-1">
                          {productData.image?.url
                            ? "Change Main Image"
                            : "Upload Main Image"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          PNG, JPG, WebP up to 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setMainImageFile(file);
                            setMainImagePreview(URL.createObjectURL(file));
                          } else {
                            setMainImageFile(null);
                            setMainImagePreview(null);
                          }
                        }}
                        className="hidden"
                        disabled={isSaving || uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Gallery Images Section */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span>🎨</span> Product Gallery
                </h3>

                {/* Existing Gallery Images */}
                {productData.images && productData.images.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-3 font-medium">
                      Current Images:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {productData.images.map((img, index) => {
                        const imageUrl =
                          typeof img === "string" ? img : img?.url;
                        if (!imageUrl || imagesToRemove.includes(imageUrl))
                          return null;

                        return (
                          <div key={index} className="relative group">
                            <div className="w-28 h-28 rounded-lg overflow-hidden shadow-md border-2 border-white bg-white">
                              <Image
                                src={imageUrl}
                                alt={`Gallery ${index + 1}`}
                                width={112}
                                height={112}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(imageUrl)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                              disabled={isSaving || uploading}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* New Gallery Images Preview */}
                {galleryPreviews.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-blue-600 mb-3 font-medium">
                      New Images to Add:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {galleryPreviews.map((previewUrl, index) => (
                        <div key={index} className="relative group">
                          <div className="w-28 h-28 rounded-lg overflow-hidden shadow-md border-2 border-blue-300 bg-white">
                            <Image
                              src={previewUrl}
                              alt={`New gallery ${index + 1}`}
                              width={112}
                              height={112}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryFile(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                            disabled={isSaving || uploading}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Gallery Button */}
                <label className="inline-block cursor-pointer">
                  <div className="border-2 border-dashed border-green-300 rounded-xl p-6 hover:border-green-500 hover:bg-green-50 transition-all text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-green-600 font-semibold mb-1">
                      Add Gallery Images
                    </p>
                    <p className="text-gray-500 text-sm">
                      Select multiple images at once
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryFileChange}
                    className="hidden"
                    disabled={isSaving || uploading}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium"
            disabled={isSaving || uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving || uploading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading images...
              </>
            ) : isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              <>💾 Save Changes</>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
