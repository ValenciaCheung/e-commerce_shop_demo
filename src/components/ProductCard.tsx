'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useWishlist } from '@/contexts/WishlistContext';
import { useComparison } from '@/contexts/ComparisonContext';
import { useReviews } from '@/contexts/ReviewsContext';
import { Heart, ArrowLeftRight, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
}

export default function ProductCard({ product, showActions = true }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToComparison, removeFromComparison, isInComparison, canAddMore } = useComparison();
  const { getReviewSummary } = useReviews();

  const isWishlisted = isInWishlist(product.id);
  const inComparison = isInComparison(product.id);
  const reviewSummary = getReviewSummary(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleComparisonToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inComparison) {
      removeFromComparison(product.id);
    } else {
      const success = addToComparison(product);
      if (!success) {
        alert('You can only compare up to 4 products at once');
      }
    }
  };

  const displayRating = reviewSummary?.averageRating || product.rating;
  const displayReviewCount = reviewSummary?.totalReviews || product.reviewCount;

  return (
    <div className="group relative">
      <Link href={`/product/${product.id}`} className="block">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
          {(product.images?.[0] && product.images[0].trim() !== '') ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Image
              src="/placeholder-image.svg"
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {/* Quick Actions */}
          {showActions && (
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  isWishlisted
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                }`}
                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
              </button>
              <button
                onClick={handleComparisonToggle}
                disabled={!canAddMore && !inComparison}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  inComparison
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-blue-500'
                }`}
                title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
              >
                <ArrowLeftRight size={16} />
              </button>
            </div>
          )}

          {/* Sale Badge */}
          {product.originalPrice && (
            <div className="absolute top-3 left-3">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                SALE
              </span>
            </div>
          )}
        </div>
      </Link>

      <Link href={`/product/${product.id}`}>
        <h4 className="font-bold text-lg mb-2 group-hover:underline line-clamp-2">
          {product.name}
        </h4>
      </Link>

      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
        {product.originalPrice && (
          <span className="text-sm text-gray-500 line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 mb-2">
        <div className="flex">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={14}
              className={`${
                i < Math.floor(displayRating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">
          {displayRating.toFixed(1)} ({displayReviewCount})
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </div>
  );
}
