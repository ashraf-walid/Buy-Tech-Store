import { X, MapPin, CreditCard, Package, Truck } from 'lucide-react';
import { formatDate } from '@/utils/dateFormatter';
import OrderStatusBadge from '@/app/dashboard/manageOrders/OrderStatusBadge';

export default function OrderDetails({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-50 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto text-right">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">تفاصيل الطلب</h2>
            <p className="text-sm text-gray-500 text-right">{order.orderNumber}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Top Info Bar */}
          <div className="bg-white rounded-lg p-4 shadow-sm flex justify-around items-center text-center">
            <div>
              <p className="text-sm text-gray-500">تاريخ الطلب</p>
              <p className="font-medium">{formatDate(order.createdAt)}</p>
            </div>
            <div className="h-12 border-l border-gray-200"></div>
            <div>
              <p className="text-sm text-gray-500">الحالة</p>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="h-12 border-l border-gray-200"></div>
            <div>
              <p className="text-sm text-gray-500">الإجمالي</p>
              <p className="font-bold text-lg text-blue-600">£{order.total}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {/* Left side: Items */}
            <div className="md:col-span-3 bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3 flex items-center justify-end gap-2 text-lg">
                <span>منتجات الطلب</span>
                <Package className="w-5 h-5 text-blue-500" />
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center pt-4 border-t first:border-0 first:pt-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-700">£{item.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Shipping and Payment */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold mb-3 flex items-center justify-end gap-2 text-lg">
                  <span>تفاصيل الشحن</span>
                  <Truck className="w-5 h-5 text-blue-500" />
                </h3>
                <div className="flex items-start justify-end gap-3">
                  <div>
                    <p className="font-medium">{order.firstName} {order.lastName}</p>
                    <p className="text-sm text-gray-600">{order.UserEmail}</p>
                    <p className="text-sm text-gray-600">{order.address}</p>
                    <p className="text-sm text-gray-600">{order.city}, {order.state}</p>
                    <p className="text-sm text-gray-600">{order.phone}</p>
                  </div>
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold mb-3 flex items-center justify-end gap-2 text-lg">
                  <span>ملخص الدفع</span>
                  <CreditCard className="w-5 h-5 text-blue-500" />
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>£{order.subtotal}</span>
                    <span className="text-gray-600">المجموع الفرعي</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>-£{(order.subtotal * order.discount / 100).toFixed(2)}</span>
                      <span>خصم ({order.discount}%)</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{order.shipping.price === 0 ? 'مجاني' : `£${order.shipping.price}`}</span>
                    <span className="text-gray-600">الشحن</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 mt-2 border-t">
                    <span>£{order.total}</span>
                    <span>الإجمالي</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}