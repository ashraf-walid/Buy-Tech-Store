"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Truck, RefreshCw, CreditCard, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react';

export default function HelpPage() {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "كيف يمكنني تتبع طلبي؟",
            answer: "يمكنك تتبع طلبك عن طريق الدخول إلى حسابك والذهاب إلى صفحة 'طلباتي'. ستجد هناك حالة كل طلب ورقم التتبع إذا كان متاحاً."
        },
        {
            question: "ما هي طرق الدفع المتاحة؟",
            answer: "نحن نقبل الدفع عند الاستلام، والبطاقات الائتمانية (فيزا، ماستركارد)، والمحافظ الإلكترونية."
        },
        {
            question: "هل يمكنني إرجاع المنتج؟",
            answer: "نعم، يمكنك إرجاع المنتج خلال 14 يوماً من تاريخ الاستلام بشرط أن يكون في حالته الأصلية. يرجى مراجعة صفحة سياسة الإرجاع لمزيد من التفاصيل."
        },
        {
            question: "كم تستغرق عملية التوصيل؟",
            answer: "تستغرق عملية التوصيل عادة من 2 إلى 5 أيام عمل حسب المحافظة والمدينة."
        },
        {
            question: "هل المنتجات أصلية؟",
            answer: "نعم، جميع المنتجات المعروضة في متجرنا أصلية 100% وتأتي مع ضمان الوكيل."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">مركز المساعدة</h1>
                    <p className="text-lg text-gray-600">كيف يمكننا مساعدتك اليوم؟</p>

                    {/* Search Bar */}
                    <div className="mt-8 max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="ابحث عن سؤال..."
                            className="w-full px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-light-blue)] shadow-sm text-right pr-12"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {/* Quick Help Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">الشحن والتوصيل</h3>
                        <p className="text-gray-600 mb-4">معلومات عن الشحن، التكلفة، ومناطق التوصيل.</p>
                        <Link href="/ShippingInfo" className="text-[var(--color-light-blue)] font-medium hover:underline">المزيد &larr;</Link>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <RefreshCw className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">الإرجاع والاستبدال</h3>
                        <p className="text-gray-600 mb-4">سياسات الإرجاع، شروط الاستبدال، واسترداد الأموال.</p>
                        <Link href="/ReturnsPolicy" className="text-[var(--color-light-blue)] font-medium hover:underline">المزيد &larr;</Link>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">الدفع والطلبات</h3>
                        <p className="text-gray-600 mb-4">طرق الدفع، مشاكل الدفع، وتعديل الطلبات.</p>
                        <Link href="/contact" className="text-[var(--color-light-blue)] font-medium hover:underline">المزيد &larr;</Link>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">الأسئلة الشائعة</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    className="w-full px-6 py-4 text-right bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition-colors"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <span className="font-medium text-gray-800">{faq.question}</span>
                                    {openFaq === index ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 py-4 bg-white text-gray-600 border-t border-gray-200">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-[var(--color-dark-gray)] rounded-2xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">لم تجد ما تبحث عنه؟</h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">فريق خدمة العملاء لدينا جاهز لمساعدتك في أي وقت. لا تتردد في التواصل معنا.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-[var(--color-light-blue)] hover:bg-blue-400 transition-colors">
                            <Mail className="w-5 h-5 ml-2" />
                            تواصل معنا
                        </Link>
                        <a href="tel:01094096548" className="inline-flex items-center justify-center px-6 py-3 border border-gray-500 text-base font-medium rounded-md text-white hover:bg-gray-700 transition-colors">
                            <Phone className="w-5 h-5 ml-2" />
                            01094096548
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
