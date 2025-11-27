"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  EmailIcon,
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/SVGIcons";

export default function Footer() {
  return (
    <footer className="bg-[#1f1b1a] text-white border-t-2 border-[var(--color-light-blue)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">متجرنا</h3>
            <p className="text-gray-300 text-sm">
              نحن نقدم أفضل المنتجات بأعلى جودة وأفضل الأسعار. تسوق معنا واستمتع
              بتجربة فريدة.
            </p>
            <div className="flex gap-3 rtl:gap-3 items-center">
              <Link
                href="https://www.facebook.com/2M.technology.eg"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 hover:bg-blue-500 p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-light-blue)]"
                aria-label="فيسبوك"
              >
                <FacebookIcon className="w-5 h-5" />
              </Link>
              <Link
                href="https://wa.me/201094096548"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 hover:bg-green-500 p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="واتساب"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.instagram.com/2M.technology.eg/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 hover:bg-pink-500 p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400"
                aria-label="انستجرام"
              >
                <InstagramIcon className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.tiktok.com/@2M.technology.eg"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 hover:bg-black p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="تيك توك"
              >
                <TikTokIcon className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:2m.technology.eg@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800 hover:bg-blue-500 p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="بريد إلكتروني"
              >
                <EmailIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[var(--color-light-blue)] tracking-wide mb-2">
              روابط سريعة
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="block px-2 py-1 rounded hover:bg-gray-800 hover:text-[var(--color-light-blue)] focus:bg-gray-800 focus:text-[var(--color-light-blue)] transition-colors"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/productsPage"
                  className="block px-2 py-1 rounded hover:bg-gray-800 hover:text-[var(--color-light-blue)] focus:bg-gray-800 focus:text-[var(--color-light-blue)] transition-colors"
                >
                  المنتجات
                </Link>
              </li>
              <li>
                <Link
                  href="/AboutUs"
                  className="block px-2 py-1 rounded hover:bg-gray-800 hover:text-[var(--color-light-blue)] focus:bg-gray-800 focus:text-[var(--color-light-blue)] transition-colors"
                >
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block px-2 py-1 rounded hover:bg-gray-800 hover:text-[var(--color-light-blue)] focus:bg-gray-800 focus:text-[var(--color-light-blue)] transition-colors"
                >
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link
                  href="/BlogPage"
                  className="block px-2 py-1 rounded hover:bg-gray-800 hover:text-[var(--color-light-blue)] focus:bg-gray-800 focus:text-[var(--color-light-blue)] transition-colors"
                >
                  المدونة
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[var(--color-light-blue)] tracking-wide mb-2">
              خدمة العملاء
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/help"
                  className="block px-2 py-1 rounded hover:bg-gray-800 hover:text-[var(--color-light-blue)] focus:bg-gray-800 focus:text-[var(--color-light-blue)] transition-colors"
                >
                  المساعدة
                </Link>
              </li>
              <li>
                <Link
                  href="/ShippingInfo"
                  className="block px-2 py-1 rounded hover:bg-gray-800 hover:text-[var(--color-light-blue)] focus:bg-gray-800 focus:text-[var(--color-light-blue)] transition-colors"
                >
                  الشحن والتوصيل
                </Link>
              </li>
              <li>
                <Link
                  href="/ReturnsPolicy"
                  className="block px-2 py-1 rounded hover:bg-gray-800 hover:text-[var(--color-light-blue)] focus:bg-gray-800 focus:text-[var(--color-light-blue)] transition-colors"
                >
                  الإرجاع والاستبدال
                </Link>
              </li>
              <li>
                <Link
                  href="/PrivacyPolicy"
                  className="block px-2 py-1 rounded hover:bg-gray-800 hover:text-[var(--color-light-blue)] focus:bg-gray-800 focus:text-[var(--color-light-blue)] transition-colors"
                >
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link
                  href="/FAQPage"
                  className="block px-2 py-1 rounded hover:bg-gray-800 hover:text-[var(--color-light-blue)] focus:bg-gray-800 focus:text-[var(--color-light-blue)] transition-colors"
                >
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link
                  href="/TermsAndConditions"
                  className="block px-2 py-1 rounded hover:bg-gray-800 hover:text-[var(--color-light-blue)] focus:bg-gray-800 focus:text-[var(--color-light-blue)] transition-colors"
                >
                  الشروط والأحكام
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[var(--color-light-blue)] tracking-wide mb-2">
              تواصل معنا
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 rtl:gap-2">
                <Phone
                  size={18}
                  className="text-green-400"
                  aria-label="رقم الهاتف"
                />
                <a
                  href="tel:01094096548"
                  className="text-gray-300 hover:text-[var(--color-light-blue)] transition-colors focus:outline-none focus:underline"
                >
                  01094096548
                </a>
              </div>
              <div className="flex items-center gap-2 rtl:gap-2">
                <Mail
                  size={18}
                  className="text-blue-400"
                  aria-label="البريد الإلكتروني"
                />
                <a
                  href="mailto:2m.technology.eg@gmail.com"
                  className="text-gray-300 hover:text-[var(--color-light-blue)] transition-colors focus:outline-none focus:underline"
                >
                  2m.technology.eg@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 rtl:gap-2">
                <MapPin
                  size={18}
                  className="text-yellow-400"
                  aria-label="العنوان"
                />
                <span className="text-gray-300">
                  دمياط الجديدة - مول الحمد - الدور الثانى
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-3 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 2M Technology. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
