'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useComparison } from '@/contexts/ComparisonContext';
import { Search, ShoppingBag, User, LogOut, Heart, ArrowLeftRight } from 'lucide-react';

export default function Header() {
  const { itemCount, toggleCart } = useCart();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { items: wishlistItems, toggleWishlist } = useWishlist();
  const { items: comparisonItems, toggleComparison } = useComparison();
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <header className="grid grid-cols-3 p-4 items-center">
      {/* Left Navigation */}
      <div className="flex justify-start">
        <nav className="flex items-center gap-6">
          <div className="relative">
            <button
              className="flex items-center gap-1 hover:text-gray-300 transition-colors"
              onMouseEnter={() => setShopOpen(true)}
              aria-haspopup="true"
              aria-expanded={shopOpen}
            >
              Shop ❤️
            </button>
            <div
              className={`absolute left-0 top-full mt-3 w-48 bg-white shadow-lg rounded-md transform transition-all duration-300 ease-in-out z-30 border-t-4 ${shopOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <Link href="/category/men" className="block px-4 py-3 text-gray-700 hover:bg-gray-100">Men</Link>
              <Link href="/category/women" className="block px-4 py-3 text-gray-700 hover:bg-gray-100">Women</Link>
              <Link href="/category/kids" className="block px-4 py-3 text-gray-700 hover:bg-gray-100">Kids</Link>
            </div>
          </div>
          <Link href="/about-us" className="hover:text-gray-300 transition-colors">About us</Link>
        </nav>
      </div>

      {/* Center Logo */}
      <div className="flex justify-center">
        <Link href="/">
          <Image
            src="https://ext.same-assets.com/1344025563/1409401597.svg"
            alt="Logo"
            width={40}
            height={40}
          />
        </Link>
      </div>

      {/* Right Icons */}
      <div className="flex justify-end items-center space-x-4">
        {/* Search */}
        <Link href="/search" className="hover:opacity-70 transition-opacity">
          <Search size={22} />
        </Link>

        {/* Wishlist */}
        <button
          onClick={toggleWishlist}
          className="hover:opacity-70 transition-opacity relative"
        >
          <Heart size={23} />
          {wishlistItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
            </span>
          )}
        </button>

        {/* Comparison */}
        <button
          onClick={toggleComparison}
          className="hover:opacity-70 transition-opacity relative"
        >
          <ArrowLeftRight size={23} />
          {comparisonItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {comparisonItems.length}
            </span>
          )}
        </button>

        {/* Cart */}
        <button
          onClick={toggleCart}
          className="hover:opacity-70 transition-opacity relative"
        >
          <ShoppingBag size={25} />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </button>

        {/* User Account */}
        {isAuthenticated && user ? (
          <div className="relative group">
            <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              {user.avatar && user.avatar.trim() !== '' ? (
                <Image
                  src={user.avatar}
                  alt={user.firstName}
                  width={25}
                  height={25}
                  className="rounded-full"
                />
              ) : (
                <User size={25} />
              )}
            </button>
            <div className="absolute right-0 top-full mt-3 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transform transition-all duration-300 ease-in-out z-30 border-t-4">
              <div className="px-4 py-3 border-b">
                <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Link href="/account" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm">
                My Account
              </Link>

              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm flex items-center gap-2"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="hover:opacity-70 transition-opacity"
          >
            <User size={25} />
          </button>
        )}
      </div>
    </header>
  );
}
