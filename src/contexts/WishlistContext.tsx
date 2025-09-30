'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { WishlistItem, WishlistState, Product } from '@/lib/types';

interface WishlistContextType extends WishlistState {
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: () => void;
  clearWishlist: () => void;
  shareWishlist: (email: string) => Promise<boolean>;
}

type WishlistAction =
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'TOGGLE_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] };

const initialState: WishlistState = {
  items: [],
  isOpen: false,
};

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_TO_WISHLIST': {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        return state; // Item already in wishlist
      }

      const newItem: WishlistItem = {
        id: Math.random().toString(36).substring(2, 11),
        product: action.payload,
        addedAt: new Date(),
      };

      return {
        ...state,
        items: [...state.items, newItem],
      };
    }

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload),
      };

    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: [],
      };

    case 'TOGGLE_WISHLIST':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'LOAD_WISHLIST':
      return {
        ...state,
        items: action.payload,
      };

    default:
      return state;
  }
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedWishlist = localStorage.getItem('evershop-wishlist');
       if (savedWishlist) {
         try {
           const parsedData: Product[] = JSON.parse(savedWishlist);
           // Validate that parsedData is an array
           if (Array.isArray(parsedData)) {
             // Type guard function for WishlistItem validation
           const isValidWishlistItem = (item: unknown): item is WishlistItem => {
             if (!item || typeof item !== 'object') return false;
             
             const obj = item as Record<string, unknown>;
             if (!obj.id || !obj.product) return false;
             
             const product = obj.product as Record<string, unknown>;
             return !!(product.id && product.name && typeof product.price === 'number');
           };
           
           const items = parsedData.map((item: unknown): WishlistItem | null => {
             if (isValidWishlistItem(item)) {
               return {
                   ...item,
                   addedAt: item.addedAt ? new Date(item.addedAt as unknown as string | number) : new Date(),
                 };
             }
             return null;
           }).filter((item): item is WishlistItem => item !== null);
             dispatch({ type: 'LOAD_WISHLIST', payload: items });
           }
         } catch (error) {
           console.error('Error loading wishlist from localStorage:', error);
           // Clear corrupted data
           localStorage.removeItem('evershop-wishlist');
         }
       }
    }
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('evershop-wishlist', JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving wishlist to localStorage:', error);
      }
    }
  }, [state.items]);

  const addToWishlist = useCallback((product: Product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  }, []);

  const isInWishlist = useCallback((productId: string): boolean => {
    return state.items.some(item => item.product.id === productId);
  }, [state.items]);

  const toggleWishlist = useCallback(() => {
    dispatch({ type: 'TOGGLE_WISHLIST' });
  }, []);

  const clearWishlist = useCallback(() => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  }, []);

  const shareWishlist = useCallback(async (email: string): Promise<boolean> => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format');
      return false;
    }

    // Simulate email sharing
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real application, this would send an email
      console.log(`Sharing wishlist with ${email}:`, state.items);

      // Mock successful sharing
      return true;
    } catch (error) {
      console.error('Error sharing wishlist:', error);
      return false;
    }
  }, [state.items]);

  return (
    <WishlistContext.Provider value={{
      ...state,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      clearWishlist,
      shareWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
