'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById } from '@/lib/products';
import { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useComparison } from '@/contexts/ComparisonContext';
import { useReviews } from '@/contexts/ReviewsContext';
import ProductReviews from '@/components/ProductReviews';
import Header from '@/components/Header';
import CartSidebar from '@/components/CartSidebar';
import AuthModal from '@/components/AuthModal';
import WishlistSidebar from '@/components/WishlistSidebar';
import ComparisonSidebar from '@/components/ComparisonSidebar';
import AddToCartModal from '@/components/AddToCartModal';
import Breadcrumb from '@/components/Breadcrumb';
import { Star, Heart, ArrowLeft, Check, Plus, Minus, ArrowLeftRight, X } from 'lucide-react';

export default function ProductClient() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToComparison, removeFromComparison, isInComparison, canAddMore } = useComparison();
  const { getReviewSummary } = useReviews();

  const product = getProductById(params.id as string);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const isWishlisted = product ? isInWishlist(product.id) : false;
  const inComparison = product ? isInComparison(product.id) : false;
  const reviewSummary = product ? getReviewSummary(product.id) : null;

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentImages = product.colors[selectedColor]?.images || product.images;
  const currentColor = product.colors[selectedColor];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    addToCart(product, selectedSize, currentColor.name, quantity);
    setSelectedProduct(product);
    setModalOpen(true);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleComparisonToggle = () => {
    if (inComparison) {
      removeFromComparison(product.id);
    } else {
      const success = addToComparison(product);
      if (!success) {
        alert('You can only compare up to 4 products at once');
      }
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
        size={16}
        className={`${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <Breadcrumb items={[
              { label: product.category, href: `/category/${product.category}` },
              { label: product.name }
            ]} />
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {(currentImages?.[selectedImage] && currentImages[selectedImage].trim() !== '') ? (
                <Image
                  src={currentImages[selectedImage]}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src="/placeholder-image.svg"
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Thumbnail Images */}
            {currentImages.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {currentImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 hover:shadow-md ${
                      selectedImage === index 
                        ? 'border-blue-500 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {(image && image.trim() !== '') ? (
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover transition-transform duration-200"
                      />
                    ) : (
                      <Image
                        src="/placeholder-image.svg"
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover transition-transform duration-200"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">{product.brand}</p>
              <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  {renderStars(reviewSummary?.averageRating || product.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  {reviewSummary?.averageRating.toFixed(1) || product.rating.toFixed(1)}
                  ({reviewSummary?.totalReviews || product.reviewCount} reviews)
                </span>
                <button
                  onClick={() => setShowReviews(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Read reviews
                </button>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Color Selection */}
            {product.colors.length > 1 && (
              <div>
                <h3 className="font-semibold mb-3">Color: {currentColor.name}</h3>
                <div className="flex gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedColor(index);
                        setSelectedImage(0);
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === index
                          ? 'border-gray-800 scale-110'
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map((sizeOption) => (
                  <button
                    key={sizeOption.size}
                    onClick={() => setSelectedSize(sizeOption.size)}
                    disabled={!sizeOption.inStock}
                    className={`py-3 px-4 border rounded-lg text-sm font-medium transition-colors ${
                      selectedSize === sizeOption.size
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : sizeOption.inStock
                        ? 'border-gray-300 hover:border-gray-400'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {sizeOption.size}
                    {!sizeOption.inStock && (
                      <div className="text-xs text-gray-400 mt-1">Out of Stock</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-medium min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : product.inStock
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } flex items-center justify-center gap-2`}
              >
                {addedToCart ? (
                  <>
                    <Check size={20} />
                    Added to Cart!
                  </>
                ) : (
                  'Add to Cart'
                )}
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`p-4 border rounded-lg transition-colors ${
                  isWishlisted
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
              </button>
              <button
                onClick={handleComparisonToggle}
                disabled={!canAddMore && !inComparison}
                className={`p-4 border rounded-lg transition-colors ${
                  inComparison
                    ? 'border-blue-500 text-blue-500 bg-blue-50'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
              >
                <ArrowLeftRight size={20} />
              </button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Modal */}
      {showReviews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Product Reviews</h2>
              <button
                onClick={() => setShowReviews(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <ProductReviews productId={product.id} />
            </div>
          </div>
        </div>
      )}

      {/* Global Components */}
      <CartSidebar />
      <AuthModal />
      <WishlistSidebar />
      <ComparisonSidebar />

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        quantity={quantity}
      />
    </div>
  );
}
