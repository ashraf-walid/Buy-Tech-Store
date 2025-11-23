import { Package, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/utils/dateFormatter';

const statusStyles = {
  pending: {
    icon: Clock,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200'
  },
  completed: {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200'
  },
  cancelled: {
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200'
  }
};

export default function OrderCard({ order, onViewDetails }) {
  const StatusIcon = statusStyles[order.status]?.icon || Clock;
  const style = statusStyles[order.status] || statusStyles.pending;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
          <div className={`px-3 py-1 rounded-full ${style.bg} ${style.border} flex items-center gap-1`}>
            <StatusIcon className={`w-4 h-4 ${style.color}`} />
            <span className={`text-sm font-medium capitalize ${style.color}`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-lg font-semibold text-gray-900">£{order.total}</p>
            </div>
            <button
              onClick={onViewDetails}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}