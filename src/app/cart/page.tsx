'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  const handleQuantityChange = (productId: string, size: string, color: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(productId, size, color, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Cart Items ({items.length})
              </h2>
              <span className="text-sm text-gray-500">
                Total: ${getTotalPrice().toFixed(2)}
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="px-6 py-6">
                <div className="flex items-center">
                  {/* 商品图片 */}
                  <div className="flex-shrink-0">
                    {(() => {
                      // 首先尝试获取特定颜色的图片
                      const colorData = item.product.colors.find(c => c.name === item.color);
                      const colorImage = colorData?.images?.[0];
                      
                      // 如果有颜色特定的图片，使用它；否则使用产品的第一张图片
                      const imageUrl = colorImage || item.product.images?.[0];
                      
                      return imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={`${item.product.name} - ${item.color}`}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <Image
                          src="/placeholder-image.svg"
                          alt={item.product.name}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                      );
                    })()}
                  </div>

                  {/* 商品信息 */}
                  <div className="ml-6 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          Size: {item.size} • Color: {item.color}
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>

                      {/* 删除按钮 */}
                      <button
                        onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {/* 数量控制 */}
                    <div className="flex items-center mt-4">
                      <span className="text-sm text-gray-600 mr-4">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.size, item.color, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2 text-center min-w-[60px]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.size, item.color, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* 小计 */}
                    <div className="mt-4">
                      <span className="text-sm text-gray-600">Subtotal: </span>
                      <span className="font-semibold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 购物车总计和结账 */}
          <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-gray-900">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 text-center font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                href="/checkout"
                className="flex-1 px-6 py-3 bg-gray-900 text-white text-center font-medium rounded-md hover:bg-gray-800 transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}