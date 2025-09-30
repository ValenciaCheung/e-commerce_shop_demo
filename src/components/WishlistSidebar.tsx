'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/lib/types';
import { X, Heart, Share, ShoppingCart, Mail, Loader2 } from 'lucide-react';

export default function WishlistSidebar() {
  const { items, isOpen, toggleWishlist, removeFromWishlist, shareWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');

  if (!isOpen) return null;

  const handleAddToCart = (item: { product: Product }) => {
    // Add with first available size and color
    const firstAvailableSize = item.product.sizes.find((size: { size: string; inStock: boolean }) => size.inStock)?.size;
    const firstColor = item.product.colors[0]?.name || 'Default';

    if (firstAvailableSize) {
      addToCart(item.product, firstAvailableSize, firstColor, 1);
    }
  };

  const handleShare = async () => {
    if (!shareEmail) return;

    setIsSharing(true);
    try {
      const success = await shareWishlist(shareEmail);
      if (success) {
        setShowShareModal(false);
        setShareEmail('');
        setBannerMessage('Wishlist shared successfully!');
        setShowBanner(true);
      } else {
        alert('Failed to share wishlist. Please try again.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      {showBanner && (
        <div className="fixed top-0 inset-x-0 z-[200]">
          <div className="bg-green-600 text-white shadow-md">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="text-left font-medium">{bannerMessage}</div>
              <button
                onClick={() => setShowBanner(false)}
                className="p-2 rounded hover:bg-green-700 focus:outline-none"
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={toggleWishlist}
      />

      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Heart size={20} />
            My Wishlist ({items.length})
          </h2>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Share wishlist"
              >
                <Share size={18} />
              </button>
            )}
            <button
              onClick={toggleWishlist}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <Heart size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Your wishlist is empty</p>
              <button
                onClick={toggleWishlist}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex gap-4">
                    <Link
                      href={`/product/${item.product.id}`}
                      onClick={toggleWishlist}
                      className="flex-shrink-0"
                    >
                      <Image
                        src={item.product.images?.[0] || '/placeholder-image.svg'}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product.id}`}
                        onClick={toggleWishlist}
                        className="block"
                      >
                        <h3 className="font-medium text-sm line-clamp-2 mb-2 hover:underline">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-lg font-semibold text-blue-600 mb-3">
                        ${item.product.price.toFixed(2)}
                        {item.product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${item.product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </p>

                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${i < Math.floor(item.product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({item.product.reviewCount})</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.product.inStock}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart size={14} />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.product.id)}
                          className="px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        Added {item.addedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-6">
            <button
              onClick={toggleWishlist}
              className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 z-[100] flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg max-w-md w-full p-6 z-[110] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Share Wishlist</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Send your wishlist to someone special
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShare}
                  disabled={!shareEmail || isSharing}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSharing && <Loader2 size={16} className="animate-spin" />}
                  <Mail size={16} />
                  {isSharing ? 'Sharing...' : 'Share'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
