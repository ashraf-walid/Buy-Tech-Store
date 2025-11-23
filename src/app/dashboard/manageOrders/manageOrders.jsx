'use client';

import { useEffect, useState, useMemo } from 'react';
import OrdersTable from './OrdersTable';
import OrderStats from './OrderStats';
import OrderDetails from '@/components/UserPage/OrderDetails';
import { Package, Search } from 'lucide-react';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        // Map _id to id for compatibility with existing components
        const ordersData = data.data.map(order => ({
          ...order,
          id: order._id
        }));
        setOrders(ordersData);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId ? { ...order, status } : order
          )
        );
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.UserEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedOrders = useMemo(() => {
    let sortableItems = [...filteredOrders];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        let comparison = 0;
        if (sortConfig.key === 'createdAt') {
          comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }

        return sortConfig.direction === 'desc' ? -comparison : comparison;
      });
    }
    return sortableItems;
  }, [filteredOrders, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-6 px-2 rounded-lg shadow-lg max-w-4xl mx-auto overflow-auto">
      <div className="max-w-7xl mx-auto px-4 max-sm:px-2">
        <div className="flex items-center justify-between mb-8 max-sm:flex-col max-sm:gap-4">
          <div className="flex flex-row-reverse items-center gap-3 ">
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 ">إدارة الطلبات</h1>
            <Package className="w-7 h-7 text-blue-600" />
          </div>

          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن الطلبات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            />
          </div>
        </div>

        <OrderStats orders={orders} />

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <OrdersTable
            orders={sortedOrders}
            onStatusChange={updateOrderStatus}
            onViewDetails={setSelectedOrder}
            requestSort={requestSort}
            sortConfig={sortConfig}
          />
        </div>

        {selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </div>
  );
}