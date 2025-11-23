import { formatDate } from '@/utils/dateFormatter';
import OrderStatusBadge from './OrderStatusBadge';
import { Package, ArrowUp, ArrowDown } from 'lucide-react';

const SortableHeader = ({ children, sortKey, sortConfig, requestSort }) => {
  if (sortKey === 'actions') {
    return (
      <th className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
        {children}
      </th>
    );
  }

  const isSorted = sortConfig.key === sortKey;
  const direction = sortConfig.direction;
  const thClass = "px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none";

  return (
    <th
      className={thClass}
      onClick={() => requestSort(sortKey)}
    >
      <div className="flex items-center justify-center gap-1">
        <span>{children}</span>
        {isSorted ? (
          direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
        ) : (
          <div style={{ width: '1rem', height: '1rem' }} />
        )}
      </div>
    </th>
  );
};

export default function OrdersTable({ orders, onStatusChange, onViewDetails, requestSort, sortConfig }) {
  
  return (
  <div className="overflow-x-auto max-sm:p-2 ">
    <table className="w-full table-auto max-sm:hidden"> 
      <thead className="bg-gray-50">
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
      <tbody className="bg-white divide-y divide-gray-200">
        {orders.map((order) => (
          <tr key={order.id} className="hover:bg-gray-50">
            <td className="px-2 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-gray-400 ml-3" />
                <div>
                  <div  className="text-xs font-medium text-gray-900">
                    {order.orderNumber}
                  </div>
                  <div dir='ltr' className="text-xs text-gray-500">
                    {formatDate(order.createdAt)}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-1 py-4">
              <div className="text-xs text-gray-900" title={order.UserEmail}>{order.firstName} {order.lastName}</div>
            </td>
            <td className="px-2 py-4 text-right">
              <OrderStatusBadge 
                status={order.status}
                onChange={(status) => onStatusChange(order.id, status)}
              />
            </td>
            <td className="pl-1 whitespace-nowrap text-right">
              <div className="text-xs font-medium text-gray-900">
                £{order.total}
              </div>
            </td>
            <td className="px-2 py-4 text-left">
              <button
                onClick={() => onViewDetails(order)}
                className="text-blue-600 hover:text-blue-900 text-xs font-medium cursor-pointer"
              >
                عرض التفاصيل
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="bg-blue-100 p-4 rounded-lg shadow-lg text-center text-gray-800 sm:hidden mb-4">
      <h2 className="text-sm font-semibold">ملخص الطلبات</h2>
      <p className="text-xs">هنا قائمة الطلبات الخاصة بك، يمكنك التصفية أو عرض التفاصيل أدناه.</p>
    </div>

    {/* عرض البيانات بشكل مكدس على الشاشات الصغيرة */}
    <div className="block sm:hidden">
      {orders.map((order) => (
        <div key={order.id} className="bg-white shadow rounded-lg p-4 mb-6 text-right">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
            <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
          </div>
          <div className="mt-2 text-sm text-gray-900 font-bold">{order.firstName} {order.lastName}</div>
          <div className="text-sm text-gray-500 truncate max-w-[200px]" title={order.UserEmail}>
            {order.UserEmail}
          </div>
          <div className="mt-2 text-sm font-medium text-gray-900">£{order.total}</div>
          <div className="mt-2">
            <OrderStatusBadge 
              status={order.status}
              onChange={(status) => onStatusChange(order.id, status)}
            />
          </div>
          <div className="mt-2 text-left">
            <button
              onClick={() => onViewDetails(order)}
              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
            >
              عرض التفاصيل
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}   
