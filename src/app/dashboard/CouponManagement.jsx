'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, X } from 'lucide-react';

// A simple toggle switch component
const ToggleSwitch = ({ checked, onChange }) => {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
    );
};

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCoupon, setCurrentCoupon] = useState({
        code: '',
        discount: '',
        description: '',
        expiresAt: '',
        isActive: true,
    });

    const fetchCoupons = async () => {
        try {
            const response = await fetch('/api/coupons');
            const data = await response.json();
            if (response.ok) {
                setCoupons(data);
            } else {
                console.error('Failed to fetch coupons:', data.message);
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const openModal = (coupon = null) => {
        if (coupon) {
            setIsEditing(true);
            setCurrentCoupon({
                ...coupon,
                expiresAt: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
            });
        } else {
            setIsEditing(false);
            setCurrentCoupon({
                code: '',
                discount: '',
                description: '',
                expiresAt: '',
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
            isActive: currentCoupon.isActive,
        };

        try {
            let response;
            if (isEditing) {
                response = await fetch(`/api/coupons/${currentCoupon._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSave),
                });
            } else {
                response = await fetch('/api/coupons', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSave),
                });
            }

            if (response.ok) {
                fetchCoupons();
                closeModal();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'حدث خطأ، يرجى المحاولة مرة أخرى.');
            }
        } catch (error) {
            console.error('حدث خطأ أثناء حفظ الكوبون:', error);
            alert('حدث خطأ، يرجى المحاولة مرة أخرى.');
        }
    };

    const handleDeleteCoupon = async (id, code) => {
        if (window.confirm(`هل أنت متأكد أنك تريد حذف الكوبون "${code}"؟`)) {
            try {
                const response = await fetch(`/api/coupons/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchCoupons();
                } else {
                    console.error('Failed to delete coupon');
                }
            } catch (error) {
                console.error('حدث خطأ أثناء حذف الكوبون:', error);
            }
        }
    };

    const handleToggleStatus = async (coupon) => {
        try {
            const response = await fetch(`/api/coupons/${coupon._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !coupon.isActive }),
            });
            if (response.ok) {
                fetchCoupons();
            } else {
                console.error('Failed to update coupon status');
            }
        } catch (error) {
            console.error("حدث خطأ أثناء تحديث حالة الكوبون:", error);
        }
    };

    const formatDate = (isoString) => {
        if (!isoString) return 'لا يوجد';
        return new Date(isoString).toLocaleDateString('ar-EG');
    };

    return (
        <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto" dir="rtl">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h1 className="text-lg sm:text-2xl font-bold">إدارة الكوبونات</h1>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                >
                    <PlusCircle size={18} className="sm:hidden" />
                    <PlusCircle size={20} className="hidden sm:inline" />
                    <span>إضافة كوبون</span>
                </button>
            </div>

            {/* Coupon Table */}
            <div className="bg-white p-2 sm:p-4 shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-right text-xs sm:text-sm md:text-base">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-2 sm:p-4">الرمز</th>
                            <th className="p-2 sm:p-4 whitespace-nowrap">الخصم</th>
                            <th className="p-2 sm:p-4 whitespace-nowrap">تاريخ الانتهاء</th>
                            <th className="p-2 sm:p-4">الحالة</th>
                            <th className="p-2 sm:p-4">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon._id} className="border-b hover:bg-gray-50">
                                <td className="p-2 sm:p-4 font-medium break-all max-w-[80px] sm:max-w-xs">{coupon.code}</td>
                                <td className="p-2 sm:p-4 whitespace-nowrap">{coupon.discount}%</td>
                                <td className="p-2 sm:p-4 whitespace-nowrap">{formatDate(coupon.expiryDate)}</td>
                                <td className="p-2 sm:p-4">
                                    <ToggleSwitch
                                        checked={coupon.isActive}
                                        onChange={() => handleToggleStatus(coupon)}
                                    />
                                </td>
                                <td className="p-2 sm:p-4">
                                    <div className="flex gap-2 sm:gap-3">
                                        <button onClick={() => openModal(coupon)} className="text-blue-600 hover:text-blue-800"><Edit size={18} className="sm:hidden" /><Edit size={20} className="hidden sm:inline" /></button>
                                        <button onClick={() => handleDeleteCoupon(coupon._id, coupon.code)} className="text-red-600 hover:text-red-800"><Trash2 size={18} className="sm:hidden" /><Trash2 size={20} className="hidden sm:inline" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {coupons.length === 0 && (
                    <p className="text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">لا توجد كوبونات متاحة حاليًا.</p>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md" dir="rtl">
                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                            <h2 className="text-lg sm:text-xl font-bold">{isEditing ? 'تعديل كوبون' : 'إضافة كوبون جديد'}</h2>
                            <button onClick={closeModal}><X size={22} className="sm:hidden" /><X size={24} className="hidden sm:inline" /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3 sm:mb-4">
                                <label className="block mb-1 font-medium text-sm sm:text-base">رمز الكوبون</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={currentCoupon.code}
                                    onChange={handleInputChange}
                                    className="p-2 border rounded w-full text-right text-sm sm:text-base"
                                    required
                                />
                            </div>
                            <div className="mb-3 sm:mb-4">
                                <label className="block mb-1 font-medium text-sm sm:text-base">نسبة الخصم (%)</label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={currentCoupon.discount}
                                    onChange={handleInputChange}
                                    className="p-2 border rounded w-full text-right text-sm sm:text-base"
                                    required
                                />
                            </div>
                            <div className="mb-3 sm:mb-4">
                                <label className="block mb-1 font-medium text-sm sm:text-base">الوصف (اختياري)</label>
                                <textarea
                                    name="description"
                                    value={currentCoupon.description}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded text-right text-sm sm:text-base"
                                ></textarea>
                            </div>
                            <div className="mb-3 sm:mb-4">
                                <label className="block mb-1 font-medium text-sm sm:text-base">تاريخ الانتهاء (اختياري)</label>
                                <input
                                    type="date"
                                    name="expiresAt"
                                    value={currentCoupon.expiresAt}
                                    onChange={handleInputChange}
                                    className="p-2 border rounded w-full text-right text-sm sm:text-base"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 gap-2 sm:gap-0">
                                <button type="submit" className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base mb-2 sm:mb-0">
                                    {isEditing ? 'حفظ التعديلات' : 'إضافة الكوبون'}
                                </button>
                                <button type="button" onClick={closeModal} className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm sm:text-base">
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponManagement;
