import { Package, Clock, CheckCircle, XCircle, TrendingUp, DollarSign } from 'lucide-react';

export default function OrderStats({ orders }) {
  const stats = orders.reduce((acc, order) => {
    acc.total++;
    acc[order.status] = (acc[order.status] || 0) + 1;
    // Add to revenue for completed orders
    if (order.status === 'completed' || order.status === 'delivered') {
      acc.revenue += order.total || 0;
    }
    return acc;
  }, {
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    delivered: 0,
    cancelled: 0,
    shipped: 0,
    revenue: 0
  });

  const completionRate = stats.total > 0 
    ? ((stats.completed + stats.delivered) / stats.total * 100).toFixed(1)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      <StatCard
        title="إجمالي الطلبات"
        value={stats.total}
        icon={Package}
        gradient="from-blue-500 to-blue-600"
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        trend={`${completionRate}% مكتملة`}
        trendUp={true}
      />
      <StatCard
        title="قيد الانتظار"
        value={stats.pending}
        icon={Clock}
        gradient="from-yellow-500 to-yellow-600"
        iconBg="bg-yellow-100"
        iconColor="text-yellow-600"
        subtitle="يحتاج متابعة"
      />
      <StatCard
        title="قيد المعالجة"
        value={stats.processing + stats.shipped}
        icon={TrendingUp}
        gradient="from-indigo-500 to-indigo-600"
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        subtitle="جاري التنفيذ"
      />
      <StatCard
        title="مكتملة"
        value={stats.completed + stats.delivered}
        icon={CheckCircle}
        gradient="from-green-500 to-green-600"
        iconBg="bg-green-100"
        iconColor="text-green-600"
        subtitle="تم التسليم"
      />
      <StatCard
        title="إجمالي الإيرادات"
        value={`${stats.revenue.toFixed(0)}`}
        currency="EGP"
        icon={DollarSign}
        gradient="from-purple-500 to-purple-600"
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
        subtitle="من الطلبات المكتملة"
      />
    </div>
  );
}

function StatCard({ title, value, currency, icon: Icon, gradient, iconBg, iconColor, subtitle, trend, trendUp }) {
  return (
    <div className="relative bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Gradient accent line at top */}
      <div className={`h-1 bg-gradient-to-r ${gradient}`}></div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <div className={`${iconBg} rounded-xl p-3 shadow-md group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          
          {/* Trend indicator (if exists) */}
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <TrendingUp className={`w-3 h-3 ${!trendUp && 'rotate-180'}`} />
              {trend}
            </div>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
        
        {/* Value */}
        <div className="flex items-baseline gap-1">
          <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value}
          </p>
          {currency && (
            <span className="text-sm font-medium text-gray-500">{currency}</span>
          )}
        </div>
        
        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
        )}
      </div>
      
      {/* Decorative background element */}
      <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${gradient} opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
    </div>
  );
}