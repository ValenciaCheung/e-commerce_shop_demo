"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartSidebar() {
  const {
    items,
    isOpen,
    total,
    itemCount,
    updateQuantity,
    removeFromCart,
    toggleCart,
  } = useCart();


  const subtotal = total;
  const taxRate = 0.1; // 10% tax rate
  const taxAmount = subtotal * taxRate;
  const finalTotal = subtotal + taxAmount;



  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={toggleCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag size={20} />
            Shopping Cart ({itemCount})
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-6">Your cart is empty</p>
              <Link
                href="/"
                onClick={toggleCart}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                CONTINUE SHOPPING
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}-${index}`}
                  className="flex gap-4 border-b pb-4"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.images?.[0] &&
                    item.product.images[0].trim() !== "" ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src="/placeholder-image.svg"
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-sm font-semibold mt-1">
                      ${item.product.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.size,
                            item.color,
                            item.quantity - 1
                          )
                        }
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.size,
                            item.color,
                            item.quantity + 1
                          )
                        }
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() =>
                          removeFromCart(item.product.id, item.size, item.color)
                        }
                        className="ml-auto text-red-500 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">


            {/* Order Summary Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Order summary
              </h3>

              {/* Sub total */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sub total:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>



              {/* Tax */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%):</span>
                <span className="font-medium">${taxAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between text-lg font-semibold border-t pt-3">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>

            {/* Tax Information */}
            <p className="text-xs text-gray-500">
              (Inclusive of tax ${taxAmount.toFixed(2)} 10%)
            </p>

            <Link
              href="/checkout"
              onClick={toggleCart}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium block text-center"
            >
              Checkout
            </Link>
            <button
              onClick={toggleCart}
              className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
