import { Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200'
  },
  processing: {
    icon: Truck,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  completed: {
    icon: CheckCircle,
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200'
  },
  cancelled: {
    icon: XCircle,
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200'
  }
};

export default function OrderStatusBadge({ status, onChange }) {
  const config = statusConfig[status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div className="inline-flex items-center flex-row-reverse">
      <select
        value={status}
        onChange={(e) => onChange(e.target.value)}
        className={`${config.bg} ${config.color} ${config.border} text-xs sm:text-base rounded-full sm:px-3 py-1 border 
          focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer text-right`}
      >
        <option value="pending">قيد الانتظار</option>
        <option value="processing">قيد المعالجة</option>
        <option value="completed">مكتمل</option>
        <option value="cancelled">ملغي</option>
      </select>
      <StatusIcon className={`${config.color} w-4 h-4 mr-1`} />
    </div>
  );
}
