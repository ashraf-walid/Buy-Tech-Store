import { X, MapPin, CreditCard, Package, Truck, Calendar, Mail, Phone, User } from 'lucide-react';
import { formatDate } from '@/utils/dateFormatter';
import OrderStatusBadge from '@/app/dashboard/manageOrders/OrderStatusBadge';

export default function OrderDetails({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between z-10 shadow-lg">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-white">تفاصيل الطلب</h2>
            <p className="text-sm text-blue-100 mt-1">{order.orderNumber}</p>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Top Info Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">تاريخ الطلب</p>
                    <p className="font-bold text-gray-900">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">حالة الطلب</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">الإجمالي</p>
                    <p className="font-bold text-xl text-green-600">{order.total} EGP</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-6">
              {/* Left side: Items */}
              <div className="md:col-span-3 bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
                  <span className="text-sm text-gray-500 font-medium">{order.items.length} منتج</span>
                  <h3 className="font-bold text-xl flex items-center gap-2 text-gray-800">
                    <span>منتجات الطلب</span>
                    <Package className="w-6 h-6 text-blue-600" />
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-500">الكمية: {item.quantity}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm font-semibold text-blue-600">{item.price} EGP</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">{(item.price * item.quantity).toFixed(2)} EGP</p>
                        <p className="text-xs text-gray-500">الإجمالي</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side: Shipping and Payment */}
              <div className="md:col-span-2 space-y-6">
                {/* Shipping Details */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                  <h3 className="font-bold text-xl mb-6 flex items-center justify-end gap-2 pb-4 border-b-2 border-gray-200 text-gray-800">
                    <span>تفاصيل الشحن</span>
                    <Truck className="w-6 h-6 text-blue-600" />
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start justify-end gap-3">
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{order.firstName} {order.lastName}</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="flex items-start justify-end gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{order.UserEmail}</p>
                      </div>
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    
                    <div className="flex items-start justify-end gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{order.phone}</p>
                      </div>
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="flex items-start justify-end gap-3 pt-3 border-t border-gray-200">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {order.address}<br />
                          {order.city}, {order.state}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-red-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                  <h3 className="font-bold text-xl mb-6 flex items-center justify-end gap-2 pb-4 border-b-2 border-gray-200 text-gray-800">
                    <span>ملخص الدفع</span>
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">{order.subtotal} EGP</span>
                      <span className="text-gray-600">المجموع الفرعي</span>
                    </div>
                    
                    {order.discount > 0 && (
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <span className="font-semibold text-green-700">-{(order.subtotal * order.discount / 100).toFixed(2)} EGP</span>
                        <span className="text-green-700">خصم ({order.discount}%)</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-gray-900">
                        {order.shipping.price === 0 ? 'مجاني' : `${order.shipping.price} EGP`}
                      </span>
                      <span className="text-gray-600">الشحن</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mt-4">
                      <span className="font-bold text-2xl text-white">{order.total} EGP</span>
                      <span className="text-white font-bold text-lg">الإجمالي النهائي</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
}