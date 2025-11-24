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
  Menu,
  X,
  Mail,
  Home,
  Image as ImageIcon,
  ChevronLeft,
} from 'lucide-react';

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState('ManageOrders');
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
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-blue-600',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      id: 'addProduct',
      label: 'إضافة منتج',
      icon: PackagePlus,
      gradient: 'from-green-500 to-green-600',
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      id: 'productManagement',
      label: 'إدارة المنتجات',
      icon: PackageSearch,
      gradient: 'from-purple-500 to-purple-600',
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      id: 'contactMessages',
      label: 'إدارة الرسائل',
      icon: Mail,
      gradient: 'from-indigo-500 to-indigo-600',
      color: 'text-indigo-600',
      bg: 'bg-indigo-100',
    },
    {
      id: 'addaccessory',
      label: 'إضافة ملحق',
      icon: SquarePlus,
      gradient: 'from-orange-500 to-orange-600',
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
    {
      id: 'MangeAccessories',
      label: 'إدارة الملحقات',
      icon: Headphones,
      gradient: 'from-pink-500 to-pink-600',
      color: 'text-pink-600',
      bg: 'bg-pink-100',
    },
    {
      id: 'CouponManagement',
      label: 'إدارة الكوبونات',
      icon: Ticket,
      gradient: 'from-yellow-500 to-yellow-600',
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
    },
    {
      id: 'AddUserAdmin',
      label: 'إدارة المستخدمين',
      icon: Users,
      gradient: 'from-teal-500 to-teal-600',
      color: 'text-teal-600',
      bg: 'bg-teal-100',
    },
    {
      id: 'BannerManagement',
      label: 'إدارة صور البانر',
      icon: ImageIcon,
      gradient: 'from-red-500 to-red-600',
      color: 'text-red-600',
      bg: 'bg-red-100',
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
        return (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">قيد التطوير</h3>
            <p className="text-gray-500">هذه الميزة ستكون متاحة قريباً</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-white shadow-2xl hidden lg:flex flex-col border-r border-gray-200">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold text-gray-800">لوحة التحكم</h3>
              <p className="text-xs text-gray-500">إدارة شاملة</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full group relative flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-white/20' : item.bg
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
                </div>
                <span className="flex-1 text-right">{item.label}</span>
                {isActive && (
                  <ChevronLeft className="w-4 h-4 opacity-70" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Home className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-lg z-40 border-b border-gray-200">
        <div className="flex justify-between items-center px-4 py-3">
          <button
            onClick={() => setIsListOpen(!isListOpen)}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            {isListOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="text-right">
            <h3 className="text-lg font-bold text-gray-800">لوحة التحكم</h3>
            <p className="text-xs text-gray-500">{tabTitles[activeTab]}</p>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isListOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsListOpen(false)}
          />
          <div className="lg:hidden fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setIsListOpen(false)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="text-right">
                  <h3 className="text-xl font-bold text-gray-800">القائمة</h3>
                  <p className="text-xs text-gray-500">اختر قسم</p>
                </div>
              </div>
            </div>
            
            <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-180px)]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsListOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-white/20' : item.bg
                    }`}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
                    </div>
                    <span className="flex-1 text-right">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
              <button
                onClick={() => router.push('/')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg font-semibold"
              >
                <Home className="w-5 h-5" />
                <span>العودة للرئيسية</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:p-8 pt-20 lg:pt-8">
        {/* Desktop Page Header */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br ${
                navItems.find(item => item.id === activeTab)?.gradient || 'from-blue-500 to-blue-600'
              }`}>
                {(() => {
                  const Icon = navItems.find(item => item.id === activeTab)?.icon || Home;
                  return <Icon className="w-7 h-7 text-white" />;
                })()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {tabTitles[activeTab] || 'لوحة التحكم'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">إدارة وتحكم كامل</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}