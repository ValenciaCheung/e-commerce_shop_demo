'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  quantity?: number;
}

export default function AddToCartModal({ 
  isOpen, 
  onClose, 
  product, 
  quantity = 1 
}: AddToCartModalProps) {
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // 移除自动关闭功能，用户需要手动点击X按钮关闭

  if (!isOpen || !product) return null;

  return (
    <>
      {/* 弹窗内容 - 右上角定位 */}
      <div 
        className="fixed top-20 right-4 z-[60] w-80 max-w-[calc(100vw-2rem)] animate-in fade-in-0 slide-in-from-right-5 duration-300"
      >
        <div 
          className="bg-white rounded-lg shadow-2xl border relative"
        >
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* 弹窗内容 */}
          <div className="p-6">
            {/* 标题 */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                JUST ADDED TO YOUR CART
              </h3>
              <div className="w-16 h-0.5 bg-blue-600 mx-auto"></div>
            </div>

            {/* 商品信息 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0">
                {(product.images?.[0] && product.images[0].trim() !== '') ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <Image
                    src="/placeholder-image.svg"
                    alt={product.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {product.name}
                </h4>
                <div className="text-right">
                  <span className="text-sm text-gray-600">QTY: </span>
                  <span className="font-semibold">{quantity}</span>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="space-y-3">
              {/* VIEW CART 按钮 */}
              <Link
                href="/cart"
                onClick={onClose}
                className="block w-full py-3 px-4 border-2 border-gray-900 text-gray-900 text-center font-semibold hover:bg-gray-900 hover:text-white transition-colors duration-200"
              >
                VIEW CART ({totalItems})
              </Link>

              {/* Continue Shopping 链接 */}
              <button
                onClick={onClose}
                className="block w-full text-center text-gray-600 hover:text-gray-900 transition-colors underline font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}