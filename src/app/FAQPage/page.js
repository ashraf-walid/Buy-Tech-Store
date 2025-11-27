'use client';

import { useState, useMemo } from 'react';
import { HelpCircle } from 'lucide-react';
import SearchFAQ from '@/components/FAQ/SearchFAQ';
import FAQCategory from '@/components/FAQ/FAQCategory';
import FAQItem from '@/components/FAQ/FAQItem';
import { faqCategories } from '@/components/FAQ/faqData';
import Link from 'next/link';

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState('ordering');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFAQs = useMemo(() => {
        if (!searchTerm) return faqCategories;

        return faqCategories.map(category => ({
            ...category,
            questions: category.questions.filter(
                q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    q.answer.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })).filter(category => category.questions.length > 0);
    }, [searchTerm]);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <HelpCircle className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        الأسئلة الشائعة
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        ستجد هنا إجابات لأكثر الأسئلة شيوعًا حول منتجاتنا وخدماتنا والشحن وغير ذلك.
                        لم تجد ما تبحث عنه؟ تواصل مع فريق الدعم لدينا.
                    </p>
                </div>

                {/* Search */}
                <SearchFAQ
                    searchTerm={searchTerm}
                    onSearch={setSearchTerm}
                />

                {/* FAQ Categories */}
                <div className="space-y-4">
                    {filteredFAQs.map(category => (
                        <FAQCategory
                            key={category.id}
                            title={category.title}
                            icon={category.icon}
                            isActive={activeCategory === category.id}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            <div className="space-y-2">
                                {category.questions.map((faq, index) => (
                                    <FAQItem
                                        key={index}
                                        question={faq.question}
                                        answer={faq.answer}
                                    />
                                ))}
                            </div>
                        </FAQCategory>
                    ))}
                </div>

                {/* Contact Support */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600">
                        ما زال لديك سؤال؟{' '}
                        <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                            تواصل مع فريق الدعم
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}