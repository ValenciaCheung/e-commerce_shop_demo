'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { ComparisonState, Product } from '@/lib/types';

interface ComparisonContextType extends ComparisonState {
  addToComparison: (product: Product) => boolean;
  removeFromComparison: (productId: string) => void;
  isInComparison: (productId: string) => boolean;
  toggleComparison: () => void;
  clearComparison: () => void;
  canAddMore: boolean;
}

type ComparisonAction =
  | { type: 'ADD_TO_COMPARISON'; payload: Product }
  | { type: 'REMOVE_FROM_COMPARISON'; payload: string }
  | { type: 'CLEAR_COMPARISON' }
  | { type: 'TOGGLE_COMPARISON' }
  | { type: 'LOAD_COMPARISON'; payload: Product[] };

const initialState: ComparisonState = {
  items: [],
  isOpen: false,
  maxItems: 4, // Maximum 4 products for comparison
};

function comparisonReducer(state: ComparisonState, action: ComparisonAction): ComparisonState {
  switch (action.type) {
    case 'ADD_TO_COMPARISON': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem || state.items.length >= state.maxItems) {
        return state; // Item already in comparison or max limit reached
      }

      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case 'REMOVE_FROM_COMPARISON':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case 'CLEAR_COMPARISON':
      return {
        ...state,
        items: [],
      };

    case 'TOGGLE_COMPARISON':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'LOAD_COMPARISON':
      return {
        ...state,
        items: action.payload.slice(0, state.maxItems), // Ensure we don't exceed max items
      };

    default:
      return state;
  }
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(comparisonReducer, initialState);

  // Load comparison from localStorage on mount
  useEffect(() => {
    // Check if localStorage is available (SSR compatibility)
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      const savedComparison = localStorage.getItem('evershop-comparison');
      if (savedComparison) {
        const parsedData: Product[] = JSON.parse(savedComparison);
        
        // Validate the parsed data
        if (Array.isArray(parsedData)) {
          const validItems = parsedData.filter((item: unknown): item is Product => 
            item !== null &&
            typeof item === 'object' && 
            'id' in item &&
            'name' in item &&
            'price' in item &&
            typeof (item as Product).price === 'number'
          );
          
          if (validItems.length > 0) {
            dispatch({ type: 'LOAD_COMPARISON', payload: validItems });
          }
        }
      }
    } catch (error) {
      console.error('Error loading comparison from localStorage:', error);
      // Clear corrupted data
      try {
        localStorage.removeItem('evershop-comparison');
      } catch (clearError) {
        console.error('Error clearing corrupted comparison data:', clearError);
      }
    }
  }, []);

  // Save comparison to localStorage whenever it changes
  useEffect(() => {
    // Check if localStorage is available (SSR compatibility)
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      localStorage.setItem('evershop-comparison', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving comparison to localStorage:', error);
    }
  }, [state.items]);

  const addToComparison = useCallback((product: Product): boolean => {
    if (state.items.length >= state.maxItems || state.items.some(item => item.id === product.id)) {
      return false; // Cannot add more items or item already exists
    }

    dispatch({ type: 'ADD_TO_COMPARISON', payload: product });
    return true;
  }, [state.items, state.maxItems]);

  const removeFromComparison = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_FROM_COMPARISON', payload: productId });
  }, []);

  const isInComparison = useCallback((productId: string): boolean => {
    return state.items.some(item => item.id === productId);
  }, [state.items]);

  const toggleComparison = useCallback(() => {
    dispatch({ type: 'TOGGLE_COMPARISON' });
  }, []);

  const clearComparison = useCallback(() => {
    dispatch({ type: 'CLEAR_COMPARISON' });
  }, []);

  const canAddMore = state.items.length < state.maxItems;

  return (
    <ComparisonContext.Provider value={{
      ...state,
      addToComparison,
      removeFromComparison,
      isInComparison,
      toggleComparison,
      clearComparison,
      canAddMore,
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
