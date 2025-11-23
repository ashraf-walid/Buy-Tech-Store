'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ApplyCoupon from '@/components/checkoutPage/ApplyCoupon';
import { AlertCircle, ArrowLeft } from 'lucide-react';
// MongoDB will be used via API routes
import { generateOrderNumber, shippingOptions, paymentMethods } from '@/constant/constants';
import InputField from '@/components/checkoutPage/InputField';
import { validateForm } from '@/utils/validation';
import useCartStore from '@/store/cartStore';
// import useAuthStore from '@/store/authStore';
import Image from "next/image";
import useProductsStore from '@/store/productsStore';
import { SignInButton, useUser } from "@clerk/nextjs";

export default function Checkout() {
    const router = useRouter();
    const {
        cartItem,
        cartProducts,
        subtotal,
        clearCart,
    } = useCartStore();
    const { user, isSignedIn } = useUser();
    const { products } = useProductsStore();

    const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0].id);
    const [selectedPayment, setSelectedPayment] = useState(paymentMethods[1].id);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(null);
    const [showBillingAddress, setShowBillingAddress] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        billingAddress: '',
        billingCity: '',
        billingState: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState(null);
    const [infoMsg, setInfoMsg] = useState('');

    useEffect(() => {
        if (
            cartProducts.length === 0 &&
            Object.keys(cartItem).length > 0 &&
            products.length > 0
        ) {
            const productsInCart = products
                .filter((product) => cartItem[product._id] > 0)
                .map(product => ({
                    ...product,
                    quantity: cartItem[product._id]
                }));

            if (productsInCart.length > 0) {
                useCartStore.setState({
                    cartProducts: productsInCart,
                    subtotal: productsInCart.reduce(
                        (total, product) => total + product.price * product.quantity,
                        0
                    )
                });
            }
        }
    }, [cartItem, products]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };

        // Sync addresses if shipping fields change and billing is not shown
        if (!showBillingAddress && ['address', 'city', 'state'].includes(name)) {
            const billingField = 'billing' + name.charAt(0).toUpperCase() + name.slice(1);
            newFormData[billingField] = value;
        }

        setFormData(newFormData);

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Update checkbox handler
    const handleBillingAddressToggle = (e) => {
        const useShippingAddress = e.target.checked;
        setShowBillingAddress(!useShippingAddress);

        setFormData(prev => {
            if (useShippingAddress) {
                // Copy shipping address to billing
                return {
                    ...prev,
                    billingAddress: prev.address,
                    billingCity: prev.city,
                    billingState: prev.state,
                };
            } else {
                // Clear billing address
                return {
                    ...prev,
                    billingAddress: '',
                    billingCity: '',
                    billingState: '',
                };
            }
        });
    };

    const shipping = shippingOptions.find(opt => opt.id === selectedShipping);
    const subtotalWithDiscount = discount ? subtotal * (1 - discount / 100) : subtotal;
    const total = subtotalWithDiscount + shipping.price;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isSignedIn) {
            alert('Please log in to place your order. Sign in to track your orders easily!');
            return;
        }

        // Check if shipping information is filled out
        const requiredShippingFields = ['firstName', 'lastName', 'phone', 'address', 'city', 'state'];
        const missingFields = requiredShippingFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            // alert('Please fill out all required shipping information before placing your order.');
            // Set errors for missing fields
            const errors = {};
            missingFields.forEach(field => {
                errors[field] = 'هذا الحقل مطلوب';
            });
            setFormErrors(errors);
            setGlobalError('يرجى ملء جميع بيانات الشحن المطلوبة قبل إتمام الطلب.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (!acceptedTerms) {
            // alert('Please accept the Terms and Conditions and Privacy Policy before placing your order.');
            setFormErrors(prev => ({
                ...prev,
                terms: 'يرجى الموافقة على الشروط والأحكام وسياسة الخصوصية قبل إتمام الطلب.'
            }));
            setGlobalError('يرجى الموافقة على الشروط والأحكام وسياسة الخصوصية قبل إتمام الطلب.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Validate all form fields
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setPendingSubmit(() => () => doSubmit());
        setShowConfirmModal(true);
    };

    const doSubmit = async () => {
        setIsLoading(true);

        try {
            const orderNumber = generateOrderNumber();
            const orderData = {
                ...formData,
                items: cartProducts.map(item => ({
                    id: item._id,
                    quantity: cartItem[item._id],
                    price: item.price,
                    name: item.name
                })),
                shipping: {
                    method: selectedShipping,
                    price: shipping.price
                },
                payment: selectedPayment,
                coupon: couponCode || null,
                discount: discount || null,
                subtotal,
                total,
                status: 'pending',
                orderNumber,
                userEmail: user.primaryEmailAddress.emailAddress,
                userId: user.id,
            };

            // Submit order to API
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create order');
            }

            // Store order data in sessionStorage
            sessionStorage.setItem('orderData', JSON.stringify({
                ...orderData,
                _id: result.orderId,
                orderNumber: result.orderNumber
            }));

            // Clear cart
            clearCart();

            // Redirect to confirmation page with order ID
            router.push(`/ConfirmOrder?orderId=${result.orderId}`);

        } catch (error) {
            console.error('Error submitting order:', error);
            setFormErrors(prev => ({
                ...prev,
                submit: 'فشل في تقديم الطلب. يرجى المحاولة مرة أخرى.'
            }));
            setGlobalError('حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentChange = (e) => {
        const value = e.target.value;
        if (value === 'card') {
            setInfoMsg('طريقة الدفع هذه ستتوفر قريبًا!');
            setTimeout(() => setInfoMsg(''), 2500);
            return;
        }
        setSelectedPayment(value);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Error Banner */}
                    {globalError && (
                        <div className="px-3 py-2 bg-red-50 border border-red-200 text-red-500 rounded flex items-center justify-center text-xs absolute right-10 top-16">
                            <span className="mr-2">
                                <AlertCircle className="w-4 h-4 inline text-red-400 ml-2" />
                            </span>
                            <span>{globalError}</span>
                            <button
                                className=" text-red-400 hover:text-red-500 text-xl mr-4"
                                onClick={() => setGlobalError('')}
                                aria-label="إغلاق"
                                type="button"
                            >
                                ×
                            </button>
                        </div>
                    )}
                    {/* Left Column - Form */}
                    <div className="space-y-6">
                        {/* Shipping Information */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">معلومات الشحن</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {ShippingInputFields.map((field) => (
                                    <InputField
                                        key={field.name}
                                        type={field.type}
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        value={formData[field.name]}
                                        onChange={handleInputChange}
                                        className={`${field.colSpan} p-2 border rounded-md`}
                                        required={true}
                                        error={formErrors[field.name]}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Billing Address Section */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">عنوان الفاتورة</h2>
                            {/* Checkbox to Use Shipping Address as Billing Address */}
                            <div className="flex items-center gap-3 mb-4">
                                <input
                                    type="checkbox"
                                    checked={!showBillingAddress}
                                    onChange={handleBillingAddressToggle}
                                    className="h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="text-sm text-gray-700 cursor-pointer">
                                    استخدم عنوان الشحن كعنوان الفاتورة
                                </label>
                            </div>

                            {/* Billing Address Fields */}
                            {showBillingAddress && (
                                <div className="grid grid-cols-2 gap-4">
                                    {BillingInputFields.map((field) => (
                                        <InputField
                                            key={field.name}
                                            type={field.type}
                                            name={field.name}
                                            placeholder={field.placeholder}
                                            value={formData[field.name]}
                                            onChange={handleInputChange}
                                            className={`${field.colSpan} p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                            required={false}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Shipping Options */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">طريقة الشحن</h2>
                            <div className="space-y-3">
                                {shippingOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <label
                                            key={option.id}
                                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${selectedShipping === option.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="shipping"
                                                    value={option.id}
                                                    checked={selectedShipping === option.id}
                                                    onChange={(e) => setSelectedShipping(e.target.value)}
                                                    className="hidden"
                                                />
                                                <Icon className="w-5 h-5 text-blue-500" />
                                                <div>
                                                    <p className="font-medium">{option.name}</p>
                                                    <p className="text-sm text-gray-500">{option.time}</p>
                                                </div>
                                            </div>
                                            <span className="font-medium">{Number(option.price).toLocaleString('ar-EG', { minimumFractionDigits: 2 })} <span className="mx-1">ج.م</span></span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">طريقة الدفع</h2>
                            <div className="space-y-3">
                                {paymentMethods.map((method) => {
                                    const Icon = method.icon;
                                    return (
                                        <label
                                            key={method.id}
                                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${selectedPayment === method.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value={method.id}
                                                    checked={selectedPayment === method.id}
                                                    onChange={handlePaymentChange}
                                                    className="hidden"
                                                />
                                                <Icon className="w-5 h-5 text-blue-500" />
                                                <div>
                                                    <p className="font-medium">{method.name}</p>
                                                    <p className="text-sm text-gray-500">{method.description}</p>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {infoMsg && (
                            <div className="my-3 px-4 py-2 rounded text-center font-semibold bg-blue-100 text-blue-700 border border-blue-300">
                                {infoMsg}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">ملخص الطلب</h2>

                            {/* Items List */}
                            <div className="space-y-4 mb-6">
                                {cartProducts.map((item) => {
                                    return (
                                        <div key={item._id} className="flex items-center gap-4">
                                            <Image
                                                src={item?.image?.url ? item.image.url : ""}
                                                alt={item.name}
                                                width={64}
                                                height={64}
                                                className="object-cover rounded-md"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium">{item.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    الكمية: {cartItem[item._id]}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    {Number(item.price * (cartItem[item._id] || 0)).toLocaleString('ar-EG', { minimumFractionDigits: 2 })} <span className="mx-1">ج.م</span>
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {Number(item.price).toLocaleString('ar-EG', { minimumFractionDigits: 2 })} <span className="mx-1">ج.م</span> للواحدة
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Order Totals */}
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>الإجمالي الفرعي</span>
                                    <span>{Number(subtotal).toLocaleString('ar-EG', { minimumFractionDigits: 2 })} <span className="mx-1">ج.م</span></span>
                                </div>
                                {discount && (
                                    <div className="flex justify-between text-green-600">
                                        <span>الخصم</span>
                                        <span>-{discount}%</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>الشحن</span>
                                    <span>{Number(shipping.price).toLocaleString('ar-EG', { minimumFractionDigits: 2 })} <span className="mx-1">ج.م</span></span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                    <span>الإجمالي</span>
                                    <span>{Number(total).toLocaleString('ar-EG', { minimumFractionDigits: 2 })} <span className="mx-1">ج.م</span></span>
                                </div>
                            </div>

                            {/* Coupon Section */}

                            <ApplyCoupon
                                setCouponCode={setCouponCode}
                                couponCode={couponCode}
                                discount={discount}
                                setDiscount={setDiscount}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading} />


                            {/* Terms and Conditions */}
                            <div className="mt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        className="rounded text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">
                                        أوافق على&nbsp;
                                        <Link href="/TermsAndConditions" className="text-blue-500 hover:underline">
                                            الشروط والأحكام
                                        </Link>
                                        &nbsp;و&nbsp;
                                        <Link href="/ReturnsPolicy" className="text-blue-500 hover:underline">
                                            سياسة الخصوصية
                                        </Link>
                                    </span>
                                </label>
                            </div>

                            {!isSignedIn && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-6 rounded-lg shadow-md mt-4" role="alert">
                                    <h2 className="text-lg font-bold mb-2">تسجيل الدخول مطلوب</h2>
                                    <p className="text-sm mb-4">
                                        يجب تسجيل الدخول لإتمام الطلب وتتبع الطلبات بسهولة. يرجى تسجيل الدخول باستخدام حساب Google الخاص بك.
                                    </p>
                                    <SignInButton>
                                        <button
                                            className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 hover:shadow-md focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
                                        >
                                            <Image
                                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                                alt="Google logo"
                                                width={20}
                                                height={20}
                                                className="w-5 h-5"
                                            />
                                            <span>تسجيل الدخول باستخدام Google</span>
                                        </button>
                                    </SignInButton>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                                ) : (
                                    <div className="cursor-pointer flex items-center">
                                        إتمام الطلب
                                        <ArrowLeft className="mr-2 w-5 h-5" />
                                    </div>
                                )}
                            </button>

                            {formErrors.submit && (
                                <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center gap-2 text-red-600">
                                    <AlertCircle className="w-5 h-5" />
                                    <p>{formErrors.submit}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
                        <h2 className="text-lg font-bold mb-4">تأكيد الطلب</h2>
                        <p className="mb-6">هل أنت متأكد أنك تريد إتمام هذا الطلب؟</p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    if (pendingSubmit) pendingSubmit();
                                }}
                            >
                                نعم، إتمام الطلب
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const ShippingInputFields = [
    { type: 'text', name: 'firstName', placeholder: 'الاسم الأول', colSpan: 'col-span-1' },
    { type: 'text', name: 'lastName', placeholder: 'اسم العائلة', colSpan: 'col-span-1' },
    { type: 'tel', name: 'phone', placeholder: 'رقم الهاتف', colSpan: 'col-span-2' },
    { type: 'text', name: 'address', placeholder: 'عنوان الشارع', colSpan: 'col-span-2' },
    { type: 'text', name: 'city', placeholder: 'المدينة', colSpan: 'p-2' },
    { type: 'text', name: 'state', placeholder: 'المحافظة', colSpan: 'p-2' },
];

const BillingInputFields = [
    { type: 'text', name: 'billingAddress', placeholder: 'عنوان الفاتورة', colSpan: 'col-span-2' },
    { type: 'text', name: 'billingCity', placeholder: 'مدينة الفاتورة', colSpan: 'col-span-1' },
    { type: 'text', name: 'billingState', placeholder: 'محافظة الفاتورة', colSpan: 'col-span-1' },
];


