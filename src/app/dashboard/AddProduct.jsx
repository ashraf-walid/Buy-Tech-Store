'use client';

import { useState, useEffect } from "react";
import SmartSection from "@/app/dashboard/SmartFields";
import { fieldsBasic, fieldsMedia, fieldsPricing, fieldsSpecs } from "@/lib/fieldDefinitions";
import Image from 'next/image';

const initialState = {
    id: "",
    name: "",
    brand: "",
    model: "",
    category: "",
    subCategory: "",
    tags: [],
    description: "",
    image: "",
    images: [],
    price: null,
    discount: null,
    stock: null,
    warranty: "",
    condition: "",
    badge: "",
    releaseYear: null,
    extraFeatures: [],
    specs: {
        cpu: {
            brand: "",
            model: "",
            generation: null,
            baseClock: null,
            boostClock: null,
            cores: null,
            threads: null,
        },
        gpu: {
            brand: "",
            model: "",
            dedicated: false,
        },
        ram: {
            size: null,
            unit: "GB",
            type: "",
            speed: null,
        },
        storage: {
            capacity: null,
            unit: "GB",
            type: "",
            interface: "",
        },
        screen: {
            size: null,
            unit: "inch",
            resolution: "",
            type: "",
            refreshRate: null,
            antiGlare: false,
        },
        battery: {
            capacity: null,
            unit: "Wh",
            cells: null,
        },
        OperatingSystem: "",
        ports: [],
        connectivity: [],
        weight: null,
        keyboardLanguage: "",
        bodyMaterial: "",
        color: "",
        maxMemory: null,
        camera: "",
        audio: "",
    },
};

export default function AddProduct() {
    const [productData, setProductData] = useState(initialState);
    const [isDataSending, setIsDataSending] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [mainImageFile, setMainImageFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [activeTab, setActiveTab] = useState('basic');
    const [uploadProgress, setUploadProgress] = useState(0);

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
        const urls = galleryFiles.map(file => URL.createObjectURL(file));
        setGalleryPreviews(urls);
        return () => {
            urls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [galleryFiles]);

    const sendData = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setUploadProgress(0);

        if (!productData.name.trim()) return setError("Product name is required");
        if (!productData.brand.trim()) return setError("Brand is required");
        if (productData.price <= 0) return setError("Price must be greater than 0");

        setIsDataSending(true);
        try {
            const { mainImageUrl, galleryUrls } = await uploadImages();

            // Prepare the product data, removing any properties that shouldn't be sent as empty strings
            const { image, images, ...restOfData } = productData;

            const productToSend = {
                ...restOfData,
                image: mainImageUrl || undefined,
                images: galleryUrls && galleryUrls.length > 0 ? galleryUrls : [],
            };

            // Clean up specs if they are mostly empty
            if (productToSend.specs) {
                // Ensure null values are handled correctly for Mongoose Number types
                const cleanSpecs = (obj) => {
                    const newObj = { ...obj };
                    Object.keys(newObj).forEach(key => {
                        if (newObj[key] === "" || newObj[key] === null) {
                            delete newObj[key];
                        } else if (typeof newObj[key] === 'object' && !Array.isArray(newObj[key])) {
                            newObj[key] = cleanSpecs(newObj[key]);
                            if (Object.keys(newObj[key]).length === 0) delete newObj[key];
                        }
                    });
                    return newObj;
                };
                // productToSend.specs = cleanSpecs(productToSend.specs);
            }

            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productToSend),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Server error: ${response.status} ${errText}`);
            }

            setProductData(initialState);
            setMainImageFile(null);
            setGalleryFiles([]);
            setMessage("✅ Product added successfully with images!");
            setActiveTab('basic');
            setTimeout(() => setMessage(""), 5000);
        } catch (err) {
            console.error("Error sending product:", err);
            setError(err.message || "Upload or server error");
        } finally {
            setUploading(false);
            setIsDataSending(false);
            setUploadProgress(0);
        }
    };

    const uploadImages = async () => {
        try {
            setUploading(true);
            let mainImageUrl = null;
            const galleryUrls = [];
            const totalFiles = (mainImageFile ? 1 : 0) + galleryFiles.length;
            let uploadedFiles = 0;

            if (mainImageFile) {
                const formData = new FormData();
                formData.append("file", mainImageFile);

                const res = await fetch("/api/uploadImages", { method: "POST", body: formData });
                const data = await res.json();

                if (data.url) mainImageUrl = { url: data.url, public_id: data.public_id };
                uploadedFiles++;
                setUploadProgress(Math.round((uploadedFiles / totalFiles) * 100));
            }

            for (const file of galleryFiles) {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/uploadImages", { method: "POST", body: formData });
                const data = await res.json();

                if (data.url) galleryUrls.push({ url: data.url, public_id: data.public_id });
                uploadedFiles++;
                setUploadProgress(Math.round((uploadedFiles / totalFiles) * 100));
            }

            return { mainImageUrl, galleryUrls };
        } catch (err) {
            console.error("Upload error:", err);
            throw new Error("Error uploading images to Cloudinary");
        }
    };

    const handleRemoveMainImage = () => {
        setMainImageFile(null);
        setMainImagePreview(null);
    };

    const handleRemoveGalleryFile = (index) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleReset = () => {
        setProductData(initialState);
        setMainImageFile(null);
        setGalleryFiles([]);
        setMessage("");
        setError("");
        setActiveTab('basic');
    };

    const tabs = [
        { id: 'basic', label: '📝 Basic Info', icon: '📝' },
        { id: 'media', label: '🏷️ Media & Tags', icon: '🏷️' },
        { id: 'pricing', label: '💰 Pricing', icon: '💰' },
        { id: 'specs', label: '⚙️ Specs', icon: '⚙️' },
        { id: 'images', label: '🖼️ Images', icon: '🖼️' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <span className="text-blue-600">➕</span>
                        Add New Product
                    </h1>
                    <p className="text-sm md:text-base text-gray-600">Create a new product listing with all details</p>
                </div>

                {/* Alerts */}
                {(error || message) && (
                    <div className="mb-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-center gap-3 animate-slideDown shadow-md">
                                <span className="text-2xl md:text-3xl">⚠️</span>
                                <div>
                                    <p className="font-semibold text-red-800">Error</p>
                                    <p className="text-sm md:text-base text-red-700">{error}</p>
                                </div>
                            </div>
                        )}
                        {message && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl flex items-center gap-3 animate-slideDown shadow-md">
                                <span className="text-2xl md:text-3xl">✅</span>
                                <div>
                                    <p className="font-semibold text-green-800">Success</p>
                                    <p className="text-sm md:text-base text-green-700">{message}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Main Form Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    {/* Tabs Navigation */}
                    <div className="border-b border-gray-200 bg-gray-50 px-4 md:px-6 overflow-x-auto scrollbar-hide">
                        <div className="flex gap-1 min-w-max">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium transition-all relative whitespace-nowrap ${activeTab === tab.id
                                        ? 'text-blue-600 bg-white'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Progress Bar during Upload */}
                    {uploading && (
                        <div className="px-4 md:px-6 pt-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-blue-700">Uploading Images...</span>
                                    <span className="text-sm font-bold text-blue-700">{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-300 rounded-full"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Content */}
                    <div className="p-4 md:p-6">
                        <div className="space-y-6">
                            {activeTab === 'basic' && (
                                <div className="animate-fadeIn">
                                    <SmartSection
                                        legend="Basic Information"
                                        fields={fieldsBasic}
                                        data={productData}
                                        setData={setProductData}
                                        disabled={isDataSending}
                                    />
                                </div>
                            )}

                            {activeTab === 'media' && (
                                <div className="animate-fadeIn">
                                    <SmartSection
                                        legend="Media & Tags"
                                        fields={fieldsMedia}
                                        data={productData}
                                        setData={setProductData}
                                        disabled={isDataSending}
                                    />
                                </div>
                            )}

                            {activeTab === 'pricing' && (
                                <div className="animate-fadeIn">
                                    <SmartSection
                                        legend="Pricing & Stock"
                                        fields={fieldsPricing}
                                        data={productData}
                                        setData={setProductData}
                                        disabled={isDataSending}
                                    />
                                </div>
                            )}

                            {activeTab === 'specs' && (
                                <div className="animate-fadeIn">
                                    <SmartSection
                                        legend="Specifications"
                                        fields={fieldsSpecs}
                                        data={productData}
                                        setData={setProductData}
                                        disabled={isDataSending}
                                    />
                                </div>
                            )}

                            {activeTab === 'images' && (
                                <div className="space-y-6 animate-fadeIn">
                                    {/* Main Image Section */}
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 md:p-6 border-2 border-blue-200 shadow-sm">
                                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                            <span>🖼️</span> Main Product Image
                                        </h3>
                                        <div className="flex flex-col md:flex-row gap-6 items-start">
                                            {mainImagePreview && (
                                                <div className="relative group w-full md:w-auto flex justify-center md:block">
                                                    <div className="w-40 h-40 rounded-xl overflow-hidden shadow-lg border-4 border-white bg-white">
                                                        <Image
                                                            src={mainImagePreview}
                                                            alt="Main product"
                                                            width={160}
                                                            height={160}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveMainImage}
                                                        className="absolute -top-2 -right-2 md:-right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                                                        disabled={isDataSending}
                                                    >
                                                        ×
                                                    </button>
                                                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                                                        Preview
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex-1 w-full min-w-[200px]">
                                                <label className="block cursor-pointer w-full">
                                                    <div className="border-3 border-dashed border-blue-300 rounded-xl p-6 md:p-8 hover:border-blue-500 hover:bg-blue-50 transition-all text-center">
                                                        <div className="text-4xl md:text-5xl mb-3">📤</div>
                                                        <p className="text-blue-600 font-semibold mb-1">
                                                            Upload Main Image
                                                        </p>
                                                        <p className="text-gray-500 text-sm">PNG, JPG, WebP up to 5MB</p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setMainImageFile(e.target.files[0] || null)}
                                                        className="hidden"
                                                        disabled={isDataSending}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gallery Images Section */}
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 md:p-6 border-2 border-green-200 shadow-sm">
                                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                            <span>🎨</span> Product Gallery
                                        </h3>

                                        {/* Gallery Images Preview */}
                                        {galleryPreviews.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600 mb-3 font-medium">Selected Images ({galleryPreviews.length}):</p>
                                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                                    {galleryPreviews.map((previewUrl, index) => (
                                                        <div key={index} className="relative group">
                                                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden shadow-md border-2 border-white bg-white">
                                                                <Image
                                                                    src={previewUrl}
                                                                    alt={`Gallery ${index + 1}`}
                                                                    width={112}
                                                                    height={112}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveGalleryFile(index)}
                                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm shadow-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-all"
                                                                disabled={isDataSending}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Upload Gallery Button */}
                                        <label className="inline-block cursor-pointer w-full">
                                            <div className="border-2 border-dashed border-green-300 rounded-xl p-6 hover:border-green-500 hover:bg-green-50 transition-all text-center">
                                                <div className="text-4xl mb-2">🖼️</div>
                                                <p className="text-green-600 font-semibold mb-1">Add Gallery Images</p>
                                                <p className="text-gray-500 text-sm">Select multiple images at once</p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
                                                className="hidden"
                                                disabled={isDataSending}
                                            />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-gray-200 bg-gray-50 px-4 md:px-6 py-4 flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-0">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isDataSending}
                            className="w-full md:w-auto px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <span>🔄</span> Reset Form
                        </button>
                        <button
                            onClick={sendData}
                            disabled={isDataSending || uploading}
                            className="w-full md:w-auto px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Uploading...
                                </>
                            ) : isDataSending ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <span>✨</span> Add Product
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideDown {
                    from { transform: translateY(-10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}