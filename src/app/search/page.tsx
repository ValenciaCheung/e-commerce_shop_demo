'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { searchProducts, products, getAvailableBrands, getAvailableSizes, getPriceRange } from '@/lib/products';
import { SearchFilters } from '@/lib/types';
import Header from '@/components/Header';
import CartSidebar from '@/components/CartSidebar';
import AuthModal from '@/components/AuthModal';
import WishlistSidebar from '@/components/WishlistSidebar';
import ComparisonSidebar from '@/components/ComparisonSidebar';
import ProductCard from '@/components/ProductCard';
import { Search, Filter, X } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: getPriceRange(),
    sizes: [],
    brands: [],
    inStock: false,
    sortBy: 'newest',
  });

  const availableBrands = getAvailableBrands();
  const availableSizes = getAvailableSizes();
  const [minPrice, maxPrice] = getPriceRange();

  // Initialize search from URL params
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  const searchResults = useMemo(() => {
    let results = searchQuery ? searchProducts(searchQuery) : products;

    // Apply filters
    if (filters.category) {
      results = results.filter(product => product.category === filters.category);
    }

    if (filters.priceRange) {
      results = results.filter(
        product => product.price >= filters.priceRange![0] && product.price <= filters.priceRange![1]
      );
    }

    if (filters.brands && filters.brands.length > 0) {
      results = results.filter(product => filters.brands!.includes(product.brand));
    }

    if (filters.sizes && filters.sizes.length > 0) {
      results = results.filter(product =>
        product.sizes.some(size => filters.sizes!.includes(size.size) && size.inStock)
      );
    }

    if (filters.inStock) {
      results = results.filter(product => product.inStock);
    }

    // Sort results
    switch (filters.sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        break;
    }

    return results;
  }, [searchQuery, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
    (filters.priceRange?.[0] !== minPrice || filters.priceRange?.[1] !== maxPrice ? 1 : 0) +
    (filters.category ? 1 : 0);

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for shoes..."
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <Search size={24} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </form>

          <div className="text-center">
            {searchQuery ? (
              <h1 className="text-2xl font-bold mb-2">
                Search results for "{searchQuery}"
              </h1>
            ) : (
              <h1 className="text-2xl font-bold mb-2">All Products</h1>
            )}
            <p className="text-gray-600">
              Showing {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
            </p>
          </div>
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

              {/* Category */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Category</h4>
                <div className="space-y-2">
                  {['men', 'women', 'kids'].map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category}
                        onChange={() => handleFilterChange('category', category)}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{category}</span>
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={!filters.category}
                      onChange={() => handleFilterChange('category', undefined)}
                      className="mr-2"
                    />
                    <span className="text-sm">All Categories</span>
                  </label>
                </div>
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
                      handleFilterChange('priceRange', [0, parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
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
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* No Results */}
            {searchResults.length === 0 && (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-lg text-gray-600 mb-4">
                  {searchQuery ? `No products found for "${searchQuery}"` : 'No products found'}
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-between items-center">
            <div className="flex justify-center md:justify-start">
              <div className="flex items-center gap-4">
                <Image
                  src="https://ext.same-assets.com/1344025563/1846205134.svg"
                  alt="Payment Methods"
                  width={38}
                  height={40}
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="38" height="24" viewBox="0 0 38 24" role="img" aria-labelledby="pi-visa">
                  <title id="pi-visa">Visa</title>
                  <rect x="0" y="0" width="38" height="24" rx="3" fill="#000" opacity="0.07" />
                  <text x="19" y="16" textAnchor="middle" fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" fontSize="12" fontWeight="700" fill="#1A1F71">VISA</text>
                </svg>
                <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" width="38" height="24" role="img" aria-labelledby="pi-paypal">
                  <title id="pi-paypal">PayPal</title>
                  <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
                  <text x="19" y="16" textAnchor="middle" fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" fontSize="10" fontWeight="700" fill="#003087">PayPal</text>
                </svg>
              </div>
            </div>
            <div className="text-center md:text-right text-gray-500">
              <span>© 2022 Evershop. All Rights Reserved.</span>
            </div>
          </div>
        </div>
      </footer>

      <CartSidebar />
      <AuthModal />
      <WishlistSidebar />
      <ComparisonSidebar />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
