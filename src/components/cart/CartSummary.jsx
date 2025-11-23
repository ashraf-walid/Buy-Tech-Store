'use client';

import Link from 'next/link';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

export default function CartSummary({ subtotal, itemCount }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-14">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        ملخص الطلب
      </h2>
      
      <div className="space-y-4">
        <div className="flex flex-col gap-2 pb-4 border-b">
          <div className="flex justify-between items-center text-gray-600">
            <span>عدد المنتجات ({itemCount})</span>
            <span className="font-medium">{subtotal.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} <span className="mx-1">ج.م</span></span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>الشحن</span>
            <span className="text-gray-500 italic text-sm">سيتم تحديده لاحقاً</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center font-semibold text-lg">
          <span>الإجمالي</span>
          <span>{subtotal.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} <span className="mx-1">ج.م</span></span>
        </div>
        
        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/Checkout"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-center flex items-center justify-center group"
          >
            إتمام الشراء
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/productsPage"
            className="w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-200 transition duration-300 text-center flex items-center justify-center group"
          >
            متابعة التسوق
            <ShoppingCart className="w-5 h-5 mr-2" />
          </Link>
        </div>

        <p className="text-sm text-gray-500 text-center mt-4">
          سيتم حساب الشحن أثناء إتمام الشراء.
        </p>
      </div>
    </div>
  );
}





