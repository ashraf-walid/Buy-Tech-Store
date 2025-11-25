"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchComponent from "@/components/search/Search";
import {
  LogIn,
  ShoppingCart,
  Heart,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu
} from "lucide-react";
import useCartStore from '@/store/cartStore';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';

const MainHeader = ({ setIsMenuOpen }) => {
  const { cartItemCount } = useCartStore();
  const { user, isLoaded } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin' || user?.role === 'admin';
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleFavoritesClick = (e) => {
    e.preventDefault();
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  return (
    <>
      <div className="w-full bg-[#1f1b1a] relative">
        {/* Main Header - Desktop & Mobile */}
        <div className="mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-2 sm:gap-3 w-full lg:w-[80%] transition-all duration-300">

          {/* Hamburger Menu - VISIBLE ON MOBILE, HIDDEN ON DESKTOP */}
          <button
            className="md:hidden flex-shrink-0 text-gray-200 p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500/50 relative z-50"
            onClick={() => setIsMenuOpen(true)}
            aria-label="فتح القائمة"
            aria-expanded="false"
          >
            <Menu size={24} />
          </button>

          {/* Desktop Icons - HIDDEN ON MOBILE */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-gray-200 text-sm">
            {/* User Profile/Login */}
            {!isLoaded ? (
              <div className="flex items-center gap-2 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-700" />
                <div className="w-20 h-4 bg-gray-700 rounded" />
              </div>
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 hover:text-purple-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-lg px-2 py-1 group"
                  aria-label="قائمة المستخدم"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt="الملف الشخصي"
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-gray-600 group-hover:border-purple-400 transition-colors"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center ring-2 ring-gray-600 group-hover:ring-purple-400 transition-all">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="max-w-[100px] truncate text-sm font-medium">
                    {user.fullName || user.firstName || 'مستخدم'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* Dropdown Menu with Animation */}
                <div
                  className={`absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 overflow-hidden transform origin-top-right transition-all duration-200 ${isUserMenuOpen
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }`}
                  role="menu"
                  aria-orientation="vertical"
                >
                  {/* User Info Section */}
                  <div dir="ltr" className="px-4 py-3 text-sm text-gray-700 border-b bg-gradient-to-r from-gray-50 to-purple-50">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.fullName || 'مستخدم'}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>

                  <div className="py-1">
                    {/* Profile Link */}
                    <Link
                      href="/UserPage"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center justify-end px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors gap-3 group"
                      role="menuitem"
                    >
                      <span className="font-medium">الملف الشخصي</span>
                      <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </Link>

                    {/* Admin Panel */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center justify-end px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors gap-3 group"
                        role="menuitem"
                      >
                        <span className="font-medium">لوحة التحكم</span>
                        <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      </Link>
                    )}

                    {/* Logout */}
                    <SignOutButton>
                      <button
                        className="flex items-center justify-end w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors gap-3 group"
                        onClick={() => setIsUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <span className="font-medium">تسجيل الخروج</span>
                        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </SignOutButton>
                  </div>
                </div>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button
                  className="flex flex-col items-center hover:text-purple-400 transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-lg px-2 py-1"
                  aria-label="تسجيل الدخول"
                >
                  <LogIn size={26} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] mt-1 font-medium">تسجيل الدخول</span>
                </button>
              </SignInButton>
            )}

            {/* Cart */}
            <Link
              href="/CartPage"
              className="flex flex-col items-center relative hover:text-purple-400 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-lg px-2 py-1"
              aria-label={`السلة - ${cartItemCount} عنصر`}
            >
              <ShoppingCart size={28} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">السلة</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Favorites */}
            <button
              onClick={handleFavoritesClick}
              className="flex flex-col items-center hover:text-purple-400 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-lg px-2 py-1"
              aria-label="المفضلة"
            >
              <Heart size={28} className="group-hover:scale-110 group-hover:fill-current transition-all" />
              <span className="text-xs font-medium">المفضلة</span>
            </button>
          </div>

          {/* Search Bar - VISIBLE ON ALL SCREENS */}
          <div className="flex-1 max-w-2xl mx-1 sm:mx-2">
            <SearchComponent />
          </div>

          {/* Logo - VISIBLE ON ALL SCREENS */}
          <Link
            href="/"
            className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-lg"
            aria-label="الصفحة الرئيسية - Buy-Tech"
          >
            <Image
              src="/Logo/logo.webp"
              alt="Buy-Tech"
              priority
              width={124}
              height={124}
              className="h-8 sm:h-10 md:h-16 lg:h-20 w-auto hover:opacity-90 transition-all duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/* Mobile Bottom Navigation Bar - VISIBLE ONLY ON MOBILE */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1f1b1a] border-t border-gray-800 z-40 shadow-2xl">
          <div className="flex items-center justify-around px-2 py-2.5 sm:py-3">

            {/* Cart Icon - Mobile */}
            <Link
              href="/CartPage"
              className="flex flex-col items-center relative text-gray-200 hover:text-purple-400 transition-all active:scale-95 p-2"
              aria-label={`السلة - ${cartItemCount} عنصر`}
            >
              <ShoppingCart size={22} className="sm:w-6 sm:h-6" />
              <span className="text-[9px] sm:text-[10px] mt-0.5 font-medium">السلة</span>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[8px] sm:text-[9px] min-w-[14px] sm:min-w-[16px] h-[14px] sm:h-[16px] rounded-full flex items-center justify-center font-bold shadow-lg">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Favorites Icon - Mobile */}
            <button
              onClick={handleFavoritesClick}
              className="flex flex-col items-center text-gray-200 hover:text-purple-400 transition-all active:scale-95 p-2"
              aria-label="المفضلة"
            >
              <Heart size={22} className="sm:w-6 sm:h-6" />
              <span className="text-[9px] sm:text-[10px] mt-0.5 font-medium">المفضلة</span>
            </button>

            {/* User Profile Icon - Mobile */}
            {!isLoaded ? (
              <div className="flex flex-col items-center gap-1 animate-pulse p-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-700" />
                <div className="w-10 h-2 bg-gray-700 rounded" />
              </div>
            ) : user ? (
              <Link
                href="/UserPage"
                className="flex flex-col items-center text-gray-200 hover:text-purple-400 transition-all active:scale-95 p-2"
                aria-label="الملف الشخصي"
              >
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt="الملف الشخصي"
                    width={22}
                    height={22}
                    className="rounded-full border-2 border-gray-600 sm:w-6 sm:h-6"
                  />
                ) : (
                  <User size={22} className="sm:w-6 sm:h-6" />
                )}
                <span className="text-[9px] sm:text-[10px] mt-0.5 font-medium">حسابي</span>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button
                  className="flex flex-col items-center text-gray-200 hover:text-purple-400 transition-all active:scale-95 p-2"
                  aria-label="تسجيل الدخول"
                >
                  <LogIn size={22} className="sm:w-6 sm:h-6" />
                  <span className="text-[9px] sm:text-[10px] mt-0.5 font-medium">دخول</span>
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>

      {/* Coming Soon Toast Notification */}
      {showComingSoon && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-[slideDown_0.3s_ease-out] px-4">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-2xl flex items-center gap-2">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current flex-shrink-0" />
            <span className="font-medium text-sm sm:text-base">قريباً - ميزة المفضلة قيد التطوير</span>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </>
  );
};

export default MainHeader;
// "use client";
// import { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import SearchComponent from "@/components/search/Search";
// import { LogIn, ShoppingCart, Heart, User, Settings, LogOut } from "lucide-react";
// // import UnderDevelopmentModal from "@/components/common/UnderDevelopmentModal";
// import useCartStore from '@/store/cartStore';
// import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';

// const MainHeader = ({ setIsMenuOpen }) => {
//   // const [open, setOpen] = useState(false);
//   const { cartItemCount } = useCartStore();
//   const { user } = useUser();
//   const isAdmin = user?.publicMetadata?.role === 'admin' || user?.role === 'admin';
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//   const userMenuRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
//         setIsUserMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="w-full bg-[#1f1b1a]">
//       <div className="mx-auto px-4 py-3 flex items-center justify-between w-full lg:w-[80%] transition-all duration-300">
//         {/* Mobile Menu Button (Hamburger) */}
//         <button
//           className="visible text-gray-200 text-2xl sm:text-3xl md:hidden cursor-pointer"
//           onClick={() => setIsMenuOpen(true)}
//           aria-label="Open menu"
//         >
//           ☰
//         </button>
//         {/* Desktop Icons (hidden on mobile) */}
//         <div className="hidden md:flex items-center gap-8 text-gray-200 text-sm">


//           {user ? (
//             <div className="relative" ref={userMenuRef}>
//               <button
//                 onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
//                 className="flex items-center gap-2 hover:text-[var(--color-purple-bright)] transition-colors focus:outline-none"
//               >
//                 {user.imageUrl ? (
//                   <Image
//                     src={user.imageUrl}
//                     alt="Profile"
//                     width={32}
//                     height={32}
//                     className="rounded-full border border-gray-600"
//                   />
//                 ) : (
//                   <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
//                     <User className="w-4 h-4 text-gray-300" />
//                   </div>
//                 )}
//                 <span className="max-w-[100px] truncate text-sm font-medium">
//                   {user.fullName || user.firstName || 'User'}
//                 </span>
//               </button>

//               {isUserMenuOpen && (
//                 <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden transform origin-top-right transition-all">
//                   {/* User information */}
//                   <div dir="ltr" className="px-4 py-3 text-sm text-gray-700 border-b bg-gray-50">
//                     <p className="font-medium text-gray-900 truncate">{user.fullName || 'User'}</p>
//                     <p className="text-xs text-gray-500 truncate">{user.primaryEmailAddress?.emailAddress}</p>
//                   </div>

//                   <div className="py-1">
//                     {/* Personal page link */}
//                     <Link
//                       href="/UserPage"
//                       onClick={() => setIsUserMenuOpen(false)}
//                       className="flex items-center justify-end px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors gap-3"
//                     >
//                       <span>الملف الشخصي</span>
//                       <User className="w-4 h-4" />
//                     </Link>

//                     {/* Control panel option */}
//                     {isAdmin && (
//                       <Link
//                         href="/admin"
//                         onClick={() => setIsUserMenuOpen(false)}
//                         className="flex items-center justify-end px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors gap-3"
//                       >
//                         <span>لوحة التحكم</span>
//                         <Settings className="w-4 h-4" />
//                       </Link>
//                     )}

//                     {/* Logout option */}
//                     <SignOutButton>
//                       <button
//                         className="flex items-center justify-end w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors gap-3"
//                         onClick={() => setIsUserMenuOpen(false)}
//                       >
//                         <span>تسجيل الخروج</span>
//                         <LogOut className="w-4 h-4" />
//                       </button>
//                     </SignOutButton>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <SignInButton mode="modal">
//               <button
//                 className="flex flex-col items-center hover:text-blue-400 transition duration-300 cursor-pointer group"
//               >
//                 <LogIn size={26} className="group-hover:scale-110 transition-transform" />
//                 <span className="text-[10px] mt-1">تسجيل الدخول</span>
//               </button>
//             </SignInButton>
//           )}

//           {/* Cart */}
//           <Link
//             href="/CartPage"
//             className="flex flex-col items-center relative hover:text-[var(--color-purple-bright)] transition"
//           >
//             <ShoppingCart size={30} />
//             <span className="text-xs">السلة</span>
//             {cartItemCount > 0 && (
//               <span className="absolute -top-2 left-4 bg-red-500 text-white text-[10px] w-3 h-3 max-sm:w-3 max-sm:h-3 max-sm:top-0 max-sm:left-2 max-sm:text-[9px] rounded-full flex items-center justify-center">
//                 {cartItemCount}
//               </span>
//             )}
//           </Link>
//           {/* Favourite */}
//           <Link
//             href="#"
//             className="flex flex-col items-center hover:text-[var(--color-purple-bright)] transition"
//           >
//             <Heart size={30} />
//             <span className="text-xs">المفضلة</span>
//           </Link>
//         </div>
//         {/* Search */}
//         <div className="flex-1 max-w-2xl mx-2 sm:mx-4">
//           <SearchComponent />
//         </div>
//         {/* Logo */}
//         <Link href="/" className="flex-shrink-0" aria-label="header logo">
//           <Image
//             src="/Logo/logo.webp"
//             alt="Buy-Tech"
//             priority
//             width={124}
//             height={124}
//             className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto hover:opacity-90 transition-opacity duration-300"
//           />
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default MainHeader;
