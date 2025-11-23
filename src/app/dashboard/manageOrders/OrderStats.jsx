import { Package, Clock, CheckCircle } from 'lucide-react';
// XCircle
export default function OrderStats({ orders }) {
  const stats = orders.reduce((acc, order) => {
    acc.total++;
    acc[order.status]++;
    // Only add to revenue if order is completed
    if (order.status === 'completed') {
      acc.revenue += order.total;
    }
    return acc;
  }, {
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0
  });
  return (
    <div className="grid grid-cols-3 max-sm:grid-cols-2 gap-4 max-sm:gap-2 mb-6">
      <StatCard
        title="إجمالي الطلبات"
        value={stats.total}
        icon={Package}
        color="blue"
      />
      <StatCard
        title="قيد الانتظار"
        value={stats.pending}
        icon={Clock}
        color="yellow"
      />
      <StatCard
        title="قيد المعالجة"
        value={stats.processing}
        icon={Package}
        color="indigo"
      />
      <StatCard
        title="مكتمل"
        value={stats.completed}
        icon={CheckCircle}
        color="green"
      />
      <StatCard
        title="إجمالي الإيرادات"
        value={`£${stats.revenue.toFixed(1)}`}
        icon={Package}
        color="purple"
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    green: 'bg-green-50 text-green-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    purple: 'bg-purple-50 text-purple-700'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-sm:p-2">
      <div className="flex items-center ">
        <div className={`${colors[color]} rounded-full p-3 max-sm:p-2`}>
          <Icon className="w-6 h-6 max-sm:w-4 max-sm:h-4" />
        </div>
        <div className="mr-4 text-right">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}