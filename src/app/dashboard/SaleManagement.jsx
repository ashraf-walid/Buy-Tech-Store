"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Save, Upload, Calendar, Type, Percent, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

export default function SaleManagement() {
    const [formData, setFormData] = useState({
        title: "",
        discount: 0,
        startDate: "",
        endDate: "",
        leftImage: "",
        rightImage: "",
        buttonText: "",
        buttonLink: "",
        isActive: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [leftImageFile, setLeftImageFile] = useState(null);
    const [rightImageFile, setRightImageFile] = useState(null);
    const [leftImagePreview, setLeftImagePreview] = useState(null);
    const [rightImagePreview, setRightImagePreview] = useState(null);

    // Link Builder State
    const [linkType, setLinkType] = useState("general"); // general, product, category, brand
    const [selectedItem, setSelectedItem] = useState("");
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        fetchSaleData();
        fetchProducts();
    }, []);

    useEffect(() => {
        if (leftImageFile) {
            const url = URL.createObjectURL(leftImageFile);
            setLeftImagePreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [leftImageFile]);

    useEffect(() => {
        if (rightImageFile) {
            const url = URL.createObjectURL(rightImageFile);
            setRightImagePreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [rightImageFile]);

    // Update buttonLink when linkType or selectedItem changes
    useEffect(() => {
        let link = "/products";
        if (linkType === "product" && selectedItem) {
            link = `/ProductDetails/${selectedItem}`;
        } else if (linkType === "category" && selectedItem) {
            link = `/products?category=${encodeURIComponent(selectedItem)}`;
        } else if (linkType === "brand" && selectedItem) {
            link = `/products?brand=${encodeURIComponent(selectedItem)}`;
        }
        setFormData(prev => ({ ...prev, buttonLink: link }));
    }, [linkType, selectedItem]);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            if (res.ok) {
                const data = await res.json();
                setProducts(data);

                // Extract unique categories and brands
                const cats = [...new Set(data.map(p => p.category).filter(Boolean))];
                const brs = [...new Set(data.map(p => p.brand).filter(Boolean))];
                setCategories(cats);
                setBrands(brs);
            }
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    const fetchSaleData = async () => {
        try {
            const res = await fetch("/api/sale");
            if (!res.ok) throw new Error("Failed to fetch sale data");
            const data = await res.json();

            const formatDate = (dateString) => {
                if (!dateString) return "";
                return new Date(dateString).toISOString().split('T')[0];
            };

            setFormData({
                ...data,
                startDate: formatDate(data.startDate),
                endDate: formatDate(data.endDate),
            });
            setLeftImagePreview(data.leftImage);
            setRightImagePreview(data.rightImage);

            // Parse existing buttonLink to populate UI
            if (data.buttonLink) {
                if (data.buttonLink.startsWith("/ProductDetails/")) {
                    setLinkType("product");
                    setSelectedItem(data.buttonLink.split("/ProductDetails/")[1]);
                } else if (data.buttonLink.includes("category=")) {
                    setLinkType("category");
                    const urlParams = new URLSearchParams(data.buttonLink.split("?")[1]);
                    setSelectedItem(urlParams.get("category"));
                } else if (data.buttonLink.includes("brand=")) {
                    setLinkType("brand");
                    const urlParams = new URLSearchParams(data.buttonLink.split("?")[1]);
                    setSelectedItem(urlParams.get("brand"));
                } else {
                    setLinkType("general");
                    setSelectedItem("");
                }
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/uploadImages", { method: "POST", body: formData });
        const data = await res.json();
        return data.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        setError("");

        try {
            let leftImageUrl = formData.leftImage;
            let rightImageUrl = formData.rightImage;

            if (leftImageFile) {
                leftImageUrl = await uploadImage(leftImageFile);
            }

            if (rightImageFile) {
                rightImageUrl = await uploadImage(rightImageFile);
            }

            const payload = {
                ...formData,
                leftImage: leftImageUrl,
                rightImage: rightImageUrl,
            };

            const res = await fetch("/api/sale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to update sale");

            const updatedData = await res.json();
            setFormData(prev => ({ ...prev, ...updatedData, startDate: updatedData.startDate.split('T')[0], endDate: updatedData.endDate.split('T')[0] }));
            setMessage("Sale updated successfully!");
            setLeftImageFile(null);
            setRightImageFile(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">إدارة قسم العروض</h1>
                {message && <div className="text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg">{message}</div>}
                {error && <div className="text-red-600 font-medium bg-red-50 px-4 py-2 rounded-lg">{error}</div>}
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6 border border-gray-200">

                {/* Toggle Active */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full 
                        peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                        after:left-[113px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                        peer-checked:bg-blue-600"></div>
                        <span className="mr-3 text-sm font-medium text-gray-900">تفعيل العرض</span>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Type className="w-4 h-4" /> العنوان
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                            required
                        />
                    </div>

                    {/* Discount */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Percent className="w-4 h-4" /> نسبة الخصم
                        </label>
                        <input
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                            required
                        />
                    </div>

                    {/* Start Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> تاريخ البدء
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                            required
                        />
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> تاريخ الانتهاء
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                            required
                        />
                    </div>

                    {/* Button Text */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Type className="w-4 h-4" /> نص الزر
                        </label>
                        <input
                            type="text"
                            name="buttonText"
                            value={formData.buttonText}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                            required
                        />
                    </div>

                    {/* Link Builder */}
                    <div className="space-y-2 md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                            <LinkIcon className="w-4 h-4" /> رابط الزر (وجهة العرض)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <select
                                    value={linkType}
                                    onChange={(e) => {
                                        setLinkType(e.target.value);
                                        setSelectedItem(""); // Reset selection on type change
                                    }}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                                >
                                    <option value="general">عام (كل المنتجات)</option>
                                    <option value="product">منتج محدد</option>
                                    <option value="category">قسم محدد</option>
                                    <option value="brand">ماركة محددة</option>
                                </select>
                            </div>

                            {linkType === "product" && (
                                <div>
                                    <select
                                        value={selectedItem}
                                        onChange={(e) => setSelectedItem(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                                        required
                                    >
                                        <option value="">اختر المنتج...</option>
                                        {products.map(p => (
                                            <option key={p._id} value={p._id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {linkType === "category" && (
                                <div>
                                    <select
                                        value={selectedItem}
                                        onChange={(e) => setSelectedItem(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                                        required
                                    >
                                        <option value="">اختر القسم...</option>
                                        {categories.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {linkType === "brand" && (
                                <div>
                                    <select
                                        value={selectedItem}
                                        onChange={(e) => setSelectedItem(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                                        required
                                    >
                                        <option value="">اختر الماركة...</option>
                                        {brands.map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="mt-2 text-xs text-gray-500 dir-ltr font-mono">
                            Current Link: {formData.buttonLink}
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    {/* Left Image */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> الصورة اليسرى
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition cursor-pointer relative group overflow-hidden">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setLeftImageFile(e.target.files[0])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            {leftImagePreview ? (
                                <div className="relative h-40 w-full">
                                    <Image src={leftImagePreview} alt="Left Preview" fill className="object-contain" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg z-10">
                                        <span className="text-white font-medium flex items-center gap-2">
                                            <Upload className="w-4 h-4" /> تغيير الصورة
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8 text-gray-400">
                                    <Upload className="w-8 h-8 mx-auto mb-2" />
                                    <span>اختر صورة</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> الصورة اليمنى
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition cursor-pointer relative group overflow-hidden">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setRightImageFile(e.target.files[0])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            {rightImagePreview ? (
                                <div className="relative h-40 w-full">
                                    <Image src={rightImagePreview} alt="Right Preview" fill className="object-contain" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg z-10">
                                        <span className="text-white font-medium flex items-center gap-2">
                                            <Upload className="w-4 h-4" /> تغيير الصورة
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8 text-gray-400">
                                    <Upload className="w-8 h-8 mx-auto mb-2" />
                                    <span>اختر صورة</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 font-semibold disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                جاري الحفظ...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                حفظ التغييرات
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}
