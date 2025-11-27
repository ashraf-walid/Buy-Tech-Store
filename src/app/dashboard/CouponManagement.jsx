'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, X, Loader2, Ticket, Calendar, Percent, Tag } from 'lucide-react';
import useCouponStore from '@/store/couponStore';

// Enhanced toggle switch component
const ToggleSwitch = ({ checked, onChange }) => {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-200 
            peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 
            after:right-[30px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all 
            peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600 shadow-inner"></div>
        </label>
    );
};

const CouponManagement = () => {
    const {
        coupons,
        isLoading,
        fetchCoupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponStatus
    } = useCouponStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCoupon, setCurrentCoupon] = useState({
        code: '',
        discount: '',
        description: '',
        expiresAt: '',
        usageLimit: '',
        isActive: true,
    });

    useEffect(() => {
        fetchCoupons();
    }, [fetchCoupons]);

    const openModal = (coupon = null) => {
        if (coupon) {
            setIsEditing(true);
            setCurrentCoupon({
                ...coupon,
                expiresAt: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
                usageLimit: coupon.usageLimit || '',
            });
        } else {
            setIsEditing(false);
            setCurrentCoupon({
                code: '',
                discount: '',
                description: '',
                expiresAt: '',
                usageLimit: '',
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentCoupon({ ...currentCoupon, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentCoupon.code || !currentCoupon.discount) {
            alert('يرجى ملء رمز الكوبون ونسبة الخصم.');
            return;
        }

        const dataToSave = {
            code: currentCoupon.code.trim(),
            discount: parseFloat(currentCoupon.discount),
            description: currentCoupon.description.trim(),
            expiryDate: currentCoupon.expiresAt ? new Date(currentCoupon.expiresAt).toISOString() : null,
            usageLimit: currentCoupon.usageLimit ? parseInt(currentCoupon.usageLimit) : null,
            isActive: currentCoupon.isActive,
        };

        let result;
        if (isEditing) {
            result = await updateCoupon(currentCoupon._id, dataToSave);
        } else {
            result = await addCoupon(dataToSave);
        }

        if (result.success) {
            closeModal();
        } else {
            alert(result.message || 'حدث خطأ، يرجى المحاولة مرة أخرى.');
        }
    };

    const handleDeleteCoupon = async (id, code) => {
        if (window.confirm(`هل أنت متأكد أنك تريد حذف الكوبون "${code}"؟`)) {
            await deleteCoupon(id);
        }
    };

    const handleToggleStatus = async (coupon) => {
        await toggleCouponStatus(coupon._id, coupon.isActive);
    };

    const formatDate = (isoString) => {
        if (!isoString) return 'لا يوجد';
        return new Date(isoString).toLocaleDateString('ar-EG');
    };

    if (isLoading && coupons.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-64">
                <div className="relative w-20 h-20 mb-4">
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-600 font-medium">جاري التحميل...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Ticket className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">إدارة الكوبونات</h1>
                            <p className="text-gray-600 text-sm">إدارة وتفعيل رموز الخصم</p>
                        </div>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span>إضافة كوبون</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">إجمالي الكوبونات</p>
                                <p className="text-3xl font-bold text-gray-800">{coupons.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Ticket className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">الكوبونات النشطة</p>
                                <p className="text-3xl font-bold text-green-600">{coupons.filter(c => c.isActive).length}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <Tag className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">الكوبونات المعطلة</p>
                                <p className="text-3xl font-bold text-red-600">{coupons.filter(c => !c.isActive).length}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                <X className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coupon Table */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                            <tr>
                                <th className="p-4 text-sm font-bold text-gray-700">رمز الكوبون</th>
                                <th className="p-4 text-sm font-bold text-gray-700">نسبة الخصم</th>
                                <th className="p-4 text-sm font-bold text-gray-700">الوصف</th>
                                <th className="p-4 text-sm font-bold text-gray-700">الاستخدام</th>
                                <th className="p-4 text-sm font-bold text-gray-700">تاريخ الانتهاء</th>
                                <th className="p-4 text-sm font-bold text-gray-700 text-center">الحالة</th>
                                <th className="p-4 text-sm font-bold text-gray-700 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {coupons.map((coupon) => (
                                <tr key={coupon._id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                                <Ticket className="w-5 h-5 text-yellow-600" />
                                            </div>
                                            <span className="font-bold text-gray-900">{coupon.code}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Percent className="w-4 h-4 text-green-600" />
                                            </div>
                                            <span className="font-bold text-green-600">{coupon.discount}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-gray-600">
                                            {coupon.description || 'لا يوجد وصف'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col text-sm">
                                            <span className="font-medium text-gray-900">
                                                {coupon.usedCount || 0} / {coupon.usageLimit || '∞'}
                                            </span>
                                            <span className="text-xs text-gray-500">مرة</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">{formatDate(coupon.expiryDate)}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <ToggleSwitch
                                            checked={coupon.isActive}
                                            onChange={() => handleToggleStatus(coupon)}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => openModal(coupon)}
                                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                title="تعديل"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCoupon(coupon._id, coupon.code)}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                title="حذف"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {coupons.length === 0 && !isLoading && (
                    <div className="py-16 text-center">
                        <div className="text-6xl mb-4 opacity-20">🎫</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد كوبونات</h3>
                        <p className="text-gray-500 mb-6">ابدأ بإضافة كوبون جديد</p>
                        <button
                            onClick={() => openModal()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            إضافة أول كوبون
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slideUp" dir="rtl">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
                            <h2 className="text-2xl font-bold">
                                {isEditing ? 'تعديل كوبون' : 'إضافة كوبون جديد'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
                                        <Ticket className="w-4 h-4" />
                                        رمز الكوبون
                                    </label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={currentCoupon.code}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl text-right focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        placeholder="أدخل رمز الكوبون"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
                                        <Percent className="w-4 h-4" />
                                        نسبة الخصم (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="discount"
                                        value={currentCoupon.discount}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl text-right focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        placeholder="أدخل نسبة الخصم"
                                        min="0"
                                        max="100"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        الوصف (اختياري)
                                    </label>
                                    <textarea
                                        name="description"
                                        value={currentCoupon.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl text-right focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                                        placeholder="أدخل وصف الكوبون"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        تاريخ الانتهاء (اختياري)
                                    </label>
                                    <input
                                        type="date"
                                        name="expiresAt"
                                        value={currentCoupon.expiresAt}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl text-right focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        حد الاستخدام (اختياري)
                                    </label>
                                    <input
                                        type="number"
                                        name="usageLimit"
                                        value={currentCoupon.usageLimit}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl text-right focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                        placeholder="عدد مرات الاستخدام المسموحة"
                                        min="1"
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                                >
                                    {isEditing ? 'حفظ التعديلات' : 'إضافة الكوبون'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.4s ease-out;
                }
            `}</style>
        </div>
    );
};

export default CouponManagement;