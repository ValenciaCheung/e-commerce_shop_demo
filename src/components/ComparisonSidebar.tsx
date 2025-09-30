'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useComparison } from '@/contexts/ComparisonContext';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/lib/types';
import { X, ArrowLeftRight, ShoppingCart, Star } from 'lucide-react';
import AddToCartModal from './AddToCartModal';

export default function ComparisonSidebar() {
  const { items, isOpen, toggleComparison, removeFromComparison, clearComparison } = useComparison();
  const { addToCart } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (!isOpen) return null;

  const handleAddToCart = (product: Product) => {
    // Add with first available size and color
    const firstAvailableSize = product.sizes.find((size: { size: string; inStock: boolean }) => size.inStock)?.size;
    const firstColor = product.colors[0]?.name || 'Default';

    if (firstAvailableSize) {
      addToCart(product, firstAvailableSize, firstColor, 1);
      // 显示弹窗
      setSelectedProduct(product);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={`${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={toggleComparison}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ArrowLeftRight size={20} />
            Compare Products ({items.length}/4)
          </h2>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearComparison}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={toggleComparison}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="flex-1 overflow-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ArrowLeftRight size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products to compare</h3>
              <p className="text-gray-500 mb-6">
                Add products to compare their features side by side
              </p>
              <button
                onClick={toggleComparison}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : items.length === 1 ? (
            <div className="text-center py-12">
              <ArrowLeftRight size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Add more products to compare</h3>
              <p className="text-gray-500 mb-6">
                You need at least 2 products to start comparing
              </p>
              <div className="grid gap-4 mb-6">
                {items.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 flex gap-4">
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
                    <div className="flex-1">
                      <h4 className="font-semibold">{product.name}</h4>
                      <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={toggleComparison}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add More Products
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr>
                    <td className="w-32 p-4 font-medium text-gray-700">Products</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="relative">
                          <button
                            onClick={() => removeFromComparison(product.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                          <Link href={`/product/${product.id}`} onClick={toggleComparison}>
                            {(product.images?.[0] && product.images[0].trim() !== '') ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={120}
                                height={120}
                                className="rounded-lg object-cover mx-auto mb-2"
                              />
                            ) : (
                              <Image
                                src="/placeholder-image.svg"
                                alt={product.name}
                                width={120}
                                height={120}
                                className="rounded-lg object-cover mx-auto mb-2"
                              />
                            )}
                          </Link>
                          <Link
                            href={`/product/${product.id}`}
                            onClick={toggleComparison}
                            className="font-semibold text-sm hover:underline block"
                          >
                            {product.name}
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price */}
                  <tr className="border-t">
                    <td className="p-4 font-medium text-gray-700">Price</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="text-lg font-bold text-blue-600">
                          ${product.price.toFixed(2)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr className="border-t">
                    <td className="p-4 font-medium text-gray-700">Rating</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          {renderStars(product.rating)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {product.rating.toFixed(1)} ({product.reviewCount})
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Brand */}
                  <tr className="border-t">
                    <td className="p-4 font-medium text-gray-700">Brand</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        {product.brand}
                      </td>
                    ))}
                  </tr>

                  {/* Category */}
                  <tr className="border-t">
                    <td className="p-4 font-medium text-gray-700">Category</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-4 text-center capitalize">
                        {product.category}
                      </td>
                    ))}
                  </tr>

                  {/* Available Sizes */}
                  <tr className="border-t">
                    <td className="p-4 font-medium text-gray-700">Available Sizes</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {product.sizes.filter(size => size.inStock).map((size) => (
                            <span
                              key={size.size}
                              className="px-2 py-1 bg-gray-100 text-xs rounded"
                            >
                              {size.size}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Colors */}
                  <tr className="border-t">
                    <td className="p-4 font-medium text-gray-700">Colors</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="flex gap-1 justify-center">
                          {product.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Stock Status */}
                  <tr className="border-t">
                    <td className="p-4 font-medium text-gray-700">Availability</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.inStock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr className="border-t">
                    <td className="p-4 font-medium text-gray-700">Actions</td>
                    {items.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="space-y-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock}
                            className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart size={14} />
                            Add to Cart
                          </button>
                          <Link
                            href={`/product/${product.id}`}
                            onClick={toggleComparison}
                            className="block w-full px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50 transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 1 && (
          <div className="border-t p-6">
            <button
              onClick={toggleComparison}
              className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        quantity={1}
      />
    </>
  );
}
