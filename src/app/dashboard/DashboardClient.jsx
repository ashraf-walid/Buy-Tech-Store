'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddProduct from '@/app/dashboard/AddProduct';
import EditProductList from '@/app/dashboard/EditProductList';
import ContactMessages from '@/app/dashboard/ContactMessages';
import CouponManagement from '@/app/dashboard/CouponManagement';
import ManageOrders from '@/app/dashboard/manageOrders/manageOrders';
import {
  PackageSearch,
  PackagePlus,
  SquarePlus,
  Headphones,
  ShoppingCart,
  Users,
  Ticket,
  User,
  Logs,
  Mail,
} from 'lucide-react';

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState('addProduct');
  const [isListOpen, setIsListOpen] = useState(false);
  const router = useRouter();

  const tabTitles = {
    ManageOrders: 'إدارة الطلبات',
    addProduct: 'إضافة منتج جديد',
    productManagement: 'إدارة المنتجات',
    contactMessages: 'إدارة الرسائل',
    addaccessory: 'إضافة ملحق جديد',
    MangeAccessories: 'إدارة الملحقات',
    CouponManagement: 'إدارة الكوبونات',
    AddUserAdmin: 'إدارة المستخدمين',
    BannerManagement: 'إدارة صور البانر',
  };

  const navItems = [
    {
      id: 'ManageOrders',
      label: 'إدارة الطلبات',
      icon: <ShoppingCart className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'addProduct',
      label: 'إضافة منتج',
      icon: <PackagePlus className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'productManagement',
      label: 'إدارة المنتجات',
      icon: <PackageSearch className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'contactMessages',
      label: 'إدارة الرسائل',
      icon: <Mail className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'addaccessory',
      label: 'إضافة ملحق',
      icon: <SquarePlus className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'MangeAccessories',
      label: 'إدارة الملحقات',
      icon: <Headphones className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'CouponManagement',
      label: 'إدارة الكوبونات',
      icon: <Ticket className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'AddUserAdmin',
      label: 'إدارة المستخدمين',
      icon: <Users className="w-5 h-5 text-blue-600" />,
    },
    {
      id: 'BannerManagement',
      label: 'إدارة صور البانر',
      icon: <SquarePlus className="w-5 h-5 text-blue-600" />,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'addProduct':
        return <AddProduct />;
      case 'productManagement':
        return <EditProductList />;
      case 'contactMessages':
        return <ContactMessages />;
      case 'CouponManagement':
        return <CouponManagement />;
      case 'ManageOrders':
        return <ManageOrders />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <div className="w-56 bg-white shadow-lg p-2 min-h-screen max-sm:hidden">
        <div className="mb-8 mt-6 text-right">
          <h3 className="text-2xl font-bold text-gray-800">لوحة التحكم</h3>
          <div className="mt-2 h-1 w-20 bg-blue-500 rounded-full ml-auto" />
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-2 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="w-full shadow-lg flex justify-between items-center absolute sm:hidden px-4 py-2">
        <div>
          <h3 className="text-xl font-bold text-gray-800">لوحة التحكم</h3>
          <div className="mt-1 h-1 w-16 bg-blue-500 rounded-full" />
        </div>
        <Logs onClick={() => setIsListOpen(!isListOpen)} />
      </div>

      {isListOpen && (
        <div className="w-full bg-white shadow-lg p-6 min-h-screen sm:hidden absolute mt-14 z-50 -top-1 text-right">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsListOpen(!isListOpen);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      <main className="flex-1 p-8 max-sm:py-4 max-sm:px-0">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 flex items-center justify-between max-sm:hidden">
          <h1 className="text-2xl font-semibold text-gray-800">
            {tabTitles[activeTab] || 'لوحة التحكم'}
          </h1>
          <div className="flex flex-row-reverse items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-sm font-medium text-white cursor-pointer bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
            >
              العودة للرئيسية
            </button>
            <div className="flex flex-row-reverse items-center gap-2 text-gray-600">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 max-sm:p-0 max-sm:mt-12">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

