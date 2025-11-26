"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ShoppingCart, Heart, BarChart2 } from "lucide-react";
import Image from "next/image";
import AnimatedBorder from "@/components/AnimatedBorder";
import { formatPrice } from "@/utils/formatPrice";
import useProductsStore from "@/store/productsStore";


const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

export default function SearchComponent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const { products, ensureProductsLoaded, } = useProductsStore();

  useEffect(()=>{ ensureProductsLoaded();},[])
    
  const handleLaptopClick = (laptop) => {
    // Navigate to product details page
    const productId = laptop._id || laptop.id;
    if (productId) {
      setIsFocused(false);
      setSearchQuery("");
      router.push(`/ProductDetails/${productId}`);
    }
  };

  useOutsideClick(searchRef, () => {
    setIsFocused(false);
  });

  const filteredLaptops = searchQuery
    ? products.filter((laptop) => {
      return (
        laptop.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.cpu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.storage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.ram?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.screenSize?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.price?.toString().includes(searchQuery.toLowerCase()) ||
        laptop.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.extraFeatures?.join(" ")?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.maxResolution?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.vram?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        laptop.graphicsCoprocessor?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    : [];

  return (
    <>
      <div className="relative sm:mx-2 md:mx-4" ref={searchRef}>
        <AnimatedBorder isActive={isFocused}>
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث الان عن منتجك..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="w-full py-2.5 pr-2 md:pr-4 text-xs sm:text-sm md:text-base rounded-full focus:outline-none bg-gray-50 text-right transition-all duration-300"
            />
            <Search
              size={20}
              cursor="pointer"
              className={`absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${isFocused ? "text-blue-500" : "text-gray-400"
                }`}
            />
          </div>
        </AnimatedBorder>

        {isFocused && searchQuery && (
          <div className="absolute left-0 sm:left-1/2 -translate-x-1/2 top-full ml-[23px] md:ml-0 mt-2 w-screen max-w-sm sm:max-w-md md:left-0 md:translate-x-0 md:w-full bg-white rounded-none md:rounded-lg shadow-2xl border border-gray-100 overflow-hidden z-[60]">
            {/* number of results  */}
            <div className="px-4 py-2 text-sm text-gray-600 border-b">
              تم العثور على {filteredLaptops.length} منتج
            </div>

            {searchQuery && (
              <X
                size={20}
                className="absolute left-3 top-4 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-500"
                onClick={() => setSearchQuery("")}
              />
            )}
            <div className="max-h-96 overflow-y-auto">
              {filteredLaptops.length > 0 ? (
                <ul>  
                  {filteredLaptops.map((laptop) => (
                    <li
                      key={laptop.id}
                      className="flex items-center justify-between p-3 border-b hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => handleLaptopClick(laptop)}
                    >
                      <div className="flex items-center flex-1">
                        {laptop.image && laptop.image.length > 0 && (
                          <Image
                            src={laptop.image}
                            alt={laptop.model}
                            width={60}
                            height={60}
                            className="object-contain rounded-md ml-3"
                          />
                        )}
                        <div className="flex flex-col">
                          <p className="font-semibold text-gray-800">
                            {laptop.brand} {laptop.model}
                          </p>
                          {laptop.nickname && (
                            <p className="text-sm text-gray-500">
                              {laptop.nickname}
                            </p>
                          )}
                          <p className="text-blue-600 font-bold">
                            {formatPrice(laptop.price)}
                          </p>
                        </div>
                      </div>

                      {/* beside icons */}
                      <div className="flex gap-2 ml-3 text-gray-500">
                        <button className="hover:text-blue-600">
                          <ShoppingCart size={18} />
                        </button>
                        <button className="hover:text-red-500">
                          <Heart size={18} />
                        </button>
                        <button className="hover:text-green-600">
                          <BarChart2 size={18} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>لا توجد نتائج بحث لـ "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
