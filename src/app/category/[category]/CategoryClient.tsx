'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductsByCategory, getAvailableBrands, getAvailableSizes, getPriceRange } from '@/lib/products';
import { SearchFilters } from '@/lib/types';
import Header from '@/components/Header';
import CartSidebar from '@/components/CartSidebar';
import AuthModal from '@/components/AuthModal';
import WishlistSidebar from '@/components/WishlistSidebar';
import ComparisonSidebar from '@/components/ComparisonSidebar';
import ProductCard from '@/components/ProductCard';
import Breadcrumb from '@/components/Breadcrumb';
import { Filter, SlidersHorizontal, X } from 'lucide-react';

export default function CategoryClient() {
  const params = useParams();
  const category = params.category as string;

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category,
    priceRange: getPriceRange(),
    sizes: [],
    brands: [],
    inStock: false,
    sortBy: 'newest',
  });

  const allProducts = getProductsByCategory(category);
  const availableBrands = getAvailableBrands();
  const availableSizes = getAvailableSizes(category);
  const [minPrice, maxPrice] = getPriceRange();

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter(
        product => product.price >= filters.priceRange![0] && product.price <= filters.priceRange![1]
      );
    }

    // Filter by brands
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(product => filters.brands!.includes(product.brand));
    }

    // Filter by sizes
    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes.some(size => filters.sizes!.includes(size.size) && size.inStock)
      );
    }

    // Filter by stock
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Sort products
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        // Keep original order for newest
        break;
    }

    return filtered;
  }, [allProducts, filters]);

  const handleFilterChange = (key: keyof SearchFilters, value: SearchFilters[keyof SearchFilters]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleBrand = (brand: string) => {
    const currentBrands = filters.brands || [];
    const updatedBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    handleFilterChange('brands', updatedBrands);
  };

  const toggleSize = (size: string) => {
    const currentSizes = filters.sizes || [];
    const updatedSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    handleFilterChange('sizes', updatedSizes);
  };

  const clearFilters = () => {
    setFilters({
      category,
      priceRange: [minPrice, maxPrice],
      sizes: [],
      brands: [],
      inStock: false,
      sortBy: 'newest',
    });
  };

  const activeFiltersCount =
    (filters.brands?.length || 0) +
    (filters.sizes?.length || 0) +
    (filters.inStock ? 1 : 0) +
    (filters.priceRange?.[0] !== minPrice || filters.priceRange?.[1] !== maxPrice ? 1 : 0);

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Breadcrumb items={[{ label: category, href: `/category/${category}` }]} />
          <h1 className="text-3xl font-bold capitalize mb-2">{category} Shoes</h1>
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {allProducts.length} products
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
            <div className="bg-white border rounded-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear all ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={filters.priceRange?.[1] || maxPrice}
                    onChange={(e) =>
                      handleFilterChange('priceRange', [minPrice, parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${minPrice}</span>
                    <span>${filters.priceRange?.[1] || maxPrice}</span>
                  </div>
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Brands</h4>
                <div className="space-y-2">
                  {availableBrands.map(brand => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.brands?.includes(brand) || false}
                        onChange={() => toggleBrand(brand)}
                        className="mr-2"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Sizes</h4>
                <div className="grid grid-cols-3 gap-2">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`py-2 px-3 border rounded text-sm transition-colors ${
                        filters.sizes?.includes(size)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock || false}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle & Sort */}
            <div className="flex items-center justify-between mb-6 lg:justify-end">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Filter size={16} />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* No Products Found */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 mb-4">No products found matching your criteria</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CartSidebar />
      <AuthModal />
      <WishlistSidebar />
      <ComparisonSidebar />
    </div>
  );
}
