"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useRef, useEffect } from "react";
import useCartStore from "@/store/cartStore";
import useProductsStore from "@/store/productsStore";
import Loading from "@/components/feedback/Loading";
import ErrorState from "@/components/feedback/ErrorState";

const BestSeller = () => {
  const sliderRef = useRef(null);
  const { getBestSellerProducts, ensureProductsLoaded, loading, error } = useProductsStore();
  const { cartItem } = useCartStore();

  useEffect(() => {
    ensureProductsLoaded();
  }, [ensureProductsLoaded]);

  const products = getBestSellerProducts();

  const scroll = (direction) => {
    if (!sliderRef.current) return;

    const scrollValue = sliderRef.current.offsetWidth * 0.4; 
    sliderRef.current.scrollBy({
      left: direction === "right" ? scrollValue : -scrollValue,
      behavior: "smooth",
    });
  };

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;


  const car = {name: "Honda", price: 100000};

  const local = Object.create(car);

  console.log(`console.log local: ${local}`);
  console.log(`console.log local.prototype: ${local.prototype}`);

  return (
    <section className="w-full py-20 bg-white">
      <div className="w-full lg:w-[82%] mx-auto px-4 py-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#393405] mb-4 relative inline-block">
            <span className="relative z-10">أفضل المبيعات</span>
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-[90%] h-3 bg-gradient-to-r from-[var(--color-purple-bright)] via-[var(--color-blue)] to-[var(--color-light-blue)] rounded-lg opacity-70 -z-0"></span>
          </h2>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 shadow-lg hover:bg-yellow-100 rounded-full p-3 transition-all hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-[#393405]" />
          </button>

          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scroll-smooth px-2 py-6 hide-scrollbar"
          >
            {products?.map((product) => {
              const quantity = cartItem[product._id] || 0;
              const getProductQuantity = (_id) => cartItem[_id] || 0;

              return (
                <div
                  key={product._id}
                  className="min-w-[280px] max-w-[320px] flex-shrink-0"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <ProductCard
                    product={product}
                    isInCart={quantity > 0}
                    getProductQuantity={getProductQuantity}
                  />
                </div>
              );
            })}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 shadow-lg hover:bg-yellow-100 rounded-full p-3 transition-all hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-[#393405]" />
          </button>
        </div>

        <style jsx>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
};

export default BestSeller;