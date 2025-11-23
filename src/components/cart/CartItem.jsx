'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Minus, Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import useCartStore from '@/store/cartStore';
import Image from 'next/image';

export default function CartItem({
  _id,
  name,
  price,
  image,
  quantity,
}) {
  const { updateQuantityCartItem, addToCart, removeFromCart, DecreaseTheQuantityOfProduct } = useCartStore();
  const [inputValue, setInputValue] = useState(quantity);
  const [isHovered, setIsHovered] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    setInputValue(quantity);
  }, [quantity]);

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setInputValue(value);
    }
  };

  const handleBlur = () => {
    if (inputValue === 0) {
      setShowConfirmDialog(true);
    } else {
      updateQuantityCartItem(_id, inputValue);
    }
  };

  const handleRemove = () => {
    removeFromCart(_id);
  };

  return (
    <>
      <div
        className="flex items-center gap-6 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/ProductDetails/${_id}`} className="shrink-0 relative group">
          <Image
            src={image?.url ? image.url : ""}
            alt={name}
            width={100}
            height={100}
            className="w-24 h-24 object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
          />
          {isHovered && (
            <div className="absolute inset-0 bg-black/5 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-sm text-white bg-black/50 px-2 py-1 rounded">عرض التفاصيل</span>
            </div>
          )}
        </Link>

        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <Link
              href={`/ProductDetails/${_id}`}
              className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
            >
              {name}
            </Link>
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="حذف المنتج"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-2 text-gray-600 font-medium">
            {Number(price * quantity).toLocaleString('ar-EG', { minimumFractionDigits: 2 })} <span className="mx-1">ج.م</span>
            <span className="text-xs text-gray-400 ml-2">
              ({Number(price).toLocaleString('ar-EG', { minimumFractionDigits: 2 })} <span className="mx-1">ج.م</span> للواحدة)
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => DecreaseTheQuantityOfProduct(_id)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>

            <input
              type="number"
              min="0"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="w-16 text-center border rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              onClick={() => addToCart(_id)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          if (inputValue === 0) {
            setInputValue(1);
            updateQuantityCartItem(_id, 1);
          }
        }}
        onConfirm={handleRemove}
        title="حذف المنتج"
        message="هل أنت متأكد أنك تريد حذف هذا المنتج من السلة؟"
      />
    </>
  );
}
