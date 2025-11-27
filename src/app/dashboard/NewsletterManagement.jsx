"use client";

import { useState, useEffect } from "react";
import {
    Mail,
    Trash2,
    Search,
    RefreshCw,
    Download,
    Calendar,
    AlertCircle,
} from "lucide-react";

export default function NewsletterManagement() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/newsletter");
            if (!response.ok) throw new Error("Failed to fetch subscribers");
            const data = await response.json();
            setSubscribers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("هل أنت متأكد من حذف هذا المشترك؟")) return;

        try {
            setDeletingId(id);
            const response = await fetch("/api/newsletter", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) throw new Error("Failed to delete subscriber");

            setSubscribers(subscribers.filter((sub) => sub._id !== id));
        } catch (err) {
            alert("حدث خطأ أثناء الحذف");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredSubscribers = subscribers.filter((sub) =>
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToCSV = () => {
        const headers = ["Email", "Date Subscribed"];
        const csvContent = [
            headers.join(","),
            ...subscribers.map((sub) =>
                [sub.email, new Date(sub.createdAt).toLocaleDateString()].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "newsletter_subscribers.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-red-600">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">{error}</p>
                <button
                    onClick={fetchSubscribers}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                            الإجمالي
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{subscribers.length}</h3>
                    <p className="text-blue-100 text-sm">مشترك في النشرة البريدية</p>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="بحث عن بريد إلكتروني..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={fetchSubscribers}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>تحديث</span>
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors font-medium"
                    >
                        <Download className="w-4 h-4" />
                        <span>تصدير CSV</span>
                    </button>
                </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                                    البريد الإلكتروني
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                                    تاريخ الاشتراك
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                                    إجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredSubscribers.length > 0 ? (
                                filteredSubscribers.map((sub) => (
                                    <tr
                                        key={sub._id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                    {sub.email.charAt(0).toUpperCase()}
                                                </div>
                                                {sub.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {new Date(sub.createdAt).toLocaleDateString("ar-EG", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => handleDelete(sub._id)}
                                                    disabled={deletingId === sub._id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="حذف"
                                                >
                                                    {deletingId === sub._id ? (
                                                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Mail className="w-12 h-12 mb-3 opacity-20" />
                                            <p className="text-lg font-medium">لا يوجد مشتركين</p>
                                            <p className="text-sm">لم يتم العثور على أي نتائج</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
