import { Package, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function OrdersEmpty() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="w-8 h-8 text-blue-500" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
      <p className="text-gray-600 mb-6">
        Looks like you haven’t made any orders yet. Start shopping to see your orders here!
      </p>
      <Link
        href="/Laptops"
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <ShoppingBag className="w-5 h-5 mr-2" />
        Start Shopping
      </Link>
    </div>
  );
}