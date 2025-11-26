
"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchComponent from "@/components/search/Search";
import { LogIn, ShoppingCart, Heart, User, Settings, LogOut, TextAlignEnd } from "lucide-react"; 
import useCartStore from '@/store/cartStore';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';

const MainHeader = ({ setIsMenuOpen }) => {
  const { cartItemCount } = useCartStore();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin' || user?.role === 'admin';
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-[#1f1b1a]">
      <div className="mx-auto px-4 py-3 flex items-center justify-between w-full lg:w-[80%] transition-all duration-300">
        {/* Mobile Menu Button (Hamburger) */}
        <button
          className="visible text-gray-200 text-2xl ml-2 sm:text-3xl md:hidden"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <TextAlignEnd />
        </button>
        {/* Cart */}
        <Link
          href="/CartPage"
          className="flex flex-col items-center relative visible text-gray-200 text-2xl sm:text-3xl md:hidden transition"
        >
          <ShoppingCart size={24} />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 left-2 bg-red-500 text-white text-[10px] w-3 h-3 max-sm:text-[9px] rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Link>
        {/* Desktop Icons (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-8 text-gray-200 text-sm">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex flex-col items-center hover:text-[var(--color-purple-bright)] transition-colors focus:outline-none cursor-pointer"
              >
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full border border-gray-600"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                )}
                <span className="text-xs">الحساب</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden transform origin-top-right transition-all">
                  {/* User information */}
                  <div dir="ltr" className="px-4 py-3 text-sm text-gray-700 border-b bg-gray-50">
                    <p className="font-medium text-gray-900 truncate">{user.fullName || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>

                  <div className="py-1">
                    {/* Personal page link */}
                    <Link
                      href="/UserPage"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center justify-end px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors gap-3"
                    >
                      <span>الملف الشخصي</span>
                      <User className="w-4 h-4" />
                    </Link>

                    {/* Control panel option */}
                    {isAdmin && (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center justify-end px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors gap-3"
                      >
                        <span>لوحة التحكم</span>
                        <Settings className="w-4 h-4" />
                      </Link>
                    )}

                    {/* Logout option */}
                    <SignOutButton>
                      <button
                        className="flex items-center justify-end w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors gap-3"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span>تسجيل الخروج</span>
                        <LogOut className="w-4 h-4" />
                      </button>
                    </SignOutButton>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <SignInButton mode="modal">
              <button
                className="flex flex-col items-center hover:text-blue-400 transition duration-300 cursor-pointer group"
              >
                <LogIn size={26} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] mt-1">تسجيل الدخول</span>
              </button>
            </SignInButton>
          )}

          {/* Cart */}
          <Link
            href="/CartPage"
            className="flex flex-col items-center relative hover:text-[var(--color-purple-bright)] transition"
          >
            <ShoppingCart size={30} />
            <span className="text-xs">السلة</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 left-4 bg-red-500 text-white text-[10px] w-3 h-3 max-sm:w-3 max-sm:h-3 max-sm:top-0 max-sm:left-2 max-sm:text-[9px] rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          {/* Favourite */}
          <Link
            href="#"
            className="flex flex-col items-center hover:text-[var(--color-purple-bright)] transition"
          >
            <Heart size={30} />
            <span className="text-xs">المفضلة</span>
          </Link>
        </div>
        {/* Search */}
        <div className="flex-1 max-w-2xl mx-2 sm:mx-4">
          <SearchComponent />
        </div>
        {/* Logo */}
        <Link href="/" className="flex-shrink-0" aria-label="header logo">
          <Image
            src="/Logo/logo.webp"
            alt="Buy-Tech"
            priority
            width={124}
            height={124}
            className="h-8 sm:h-14 md:h-16 lg:h-20 w-auto hover:opacity-90 transition-opacity duration-300"
          />
        </Link>
      </div>
    </div>
  );
};

export default MainHeader;
