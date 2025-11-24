import { formatDate } from '@/utils/dateFormatter';
import OrderStatusBadge from './OrderStatusBadge';
import { Package, ArrowUp, ArrowDown, Eye, Calendar, User, DollarSign } from 'lucide-react';

const SortableHeader = ({ children, sortKey, sortConfig, requestSort }) => {
  if (sortKey === 'actions') {
    return (
      <th className="px-4 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">
        {children}
      </th>
    );
  }

  const isSorted = sortConfig.key === sortKey;
  const direction = sortConfig.direction;

  return (
    <th
      className="px-4 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
      onClick={() => requestSort(sortKey)}
    >
      <div className="flex items-center justify-center gap-2">
        <span>{children}</span>
        <div className="w-5 h-5 flex items-center justify-center">
          {isSorted ? (
            direction === 'asc' ? (
              <ArrowUp className="h-5 w-5 text-blue-600" />
            ) : (
              <ArrowDown className="h-5 w-5 text-blue-600" />
            )
          ) : (
            <div className="h-5 w-5 text-gray-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 10l5-5 5 5M7 14l5 5 5-5" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </th>
  );
};

export default function OrdersTable({ orders, onStatusChange, onViewDetails, requestSort, sortConfig }) {
  
  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <table className="w-full table-auto hidden sm:table"> 
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
          <tr>
            <SortableHeader sortKey="createdAt" sortConfig={sortConfig} requestSort={requestSort}>
              معلومات الطلب
            </SortableHeader>
            <SortableHeader sortKey="firstName" sortConfig={sortConfig} requestSort={requestSort}>
              العميل
            </SortableHeader>
            <SortableHeader sortKey="status" sortConfig={sortConfig} requestSort={requestSort}>
              الحالة
            </SortableHeader>
            <SortableHeader sortKey="total" sortConfig={sortConfig} requestSort={requestSort}>
              الإجمالي
            </SortableHeader>
            <SortableHeader sortKey="actions">
              إجراءات
            </SortableHeader>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-blue-50/50 transition-colors group">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {order.orderNumber}
                    </div>
                    <div dir='ltr' className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {order.firstName} {order.lastName}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px]" title={order.UserEmail}>
                      {order.UserEmail}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-center">
                <OrderStatusBadge 
                  status={order.status}
                  onChange={(status) => onStatusChange(order.id, status)}
                />
              </td>
              <td className="px-4 py-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-bold text-gray-900">
                    {order.total}
                  </span>
                  <span className="text-xs text-gray-500">EGP</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center">
                <button
                  onClick={() => onViewDetails(order)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium"
                >
                  <Eye className="h-4 w-4" />
                  عرض التفاصيل
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="block sm:hidden space-y-4 p-2">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <span className="font-bold text-sm">{order.orderNumber}</span>
                </div>
                <OrderStatusBadge 
                  status={order.status}
                  onChange={(status) => onStatusChange(order.id, status)}
                />
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
              {/* Customer Info */}
              <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-900">
                    {order.firstName} {order.lastName}
                  </div>
                  <div className="text-xs text-gray-500 truncate" title={order.UserEmail}>
                    {order.UserEmail}
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-2 gap-3">
                {/* Date */}
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500">التاريخ</div>
                    <div dir='ltr' className="text-sm font-semibold text-gray-900 truncate">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center gap-2 bg-green-50 rounded-lg p-3">
                  <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">الإجمالي</div>
                    <div className="text-sm font-bold text-gray-900">
                      {order.total} EGP
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onViewDetails(order)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium text-sm"
              >
                <Eye className="h-4 w-4" />
                عرض التفاصيل
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}