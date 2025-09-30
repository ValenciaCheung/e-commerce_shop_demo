'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { AuthState, User } from '@/lib/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  openAuthModal: (mode: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register' | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'OPEN_AUTH_MODAL'; payload: 'login' | 'register' }
  | { type: 'CLOSE_AUTH_MODAL' }
  | { type: 'LOAD_USER'; payload: User };

const initialState: AuthState & { authModalMode: 'login' | 'register' | null } = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  authModalMode: null,
};

function authReducer(state: typeof initialState, action: AuthAction): typeof initialState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
        isAuthModalOpen: false,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...initialState,
      };

    case 'OPEN_AUTH_MODAL':
      return {
        ...state,
        isAuthModalOpen: true,
        authModalMode: action.payload,
      };

    case 'CLOSE_AUTH_MODAL':
      return {
        ...state,
        isAuthModalOpen: false,
      };

    case 'LOAD_USER':
      return {
        ...state,
        isAuthenticated: !!action.payload,
        user: action.payload,
      };

    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return;
    
    try {
      const savedUser = localStorage.getItem('evershop-user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        // Validate user data structure
        if (user && typeof user === 'object' && user.id && user.email) {
          dispatch({ type: 'LOAD_USER', payload: user });
        } else {
          console.warn('Invalid user data in localStorage, clearing...');
          localStorage.removeItem('evershop-user');
        }
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      // Clear corrupted data
      try {
        localStorage.removeItem('evershop-user');
      } catch (clearError) {
        console.error('Error clearing corrupted user data:', clearError);
      }
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return;
    
    try {
      if (state.user) {
        localStorage.setItem('evershop-user', JSON.stringify(state.user));
      } else {
        localStorage.removeItem('evershop-user');
      }
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }, [state.user]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate potential network error (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Network error. Please check your connection.');
      }

      // Mock authentication - in real app, this would call your API
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        firstName: 'John',
        lastName: 'Doe',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error; // Re-throw to let the UI handle the error message
    }
  }, []);

  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Validate input
      if (!email || !password || !firstName || !lastName) {
        throw new Error('All fields are required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Name validation
      if (firstName.trim().length < 2 || lastName.trim().length < 2) {
        throw new Error('First name and last name must be at least 2 characters');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate potential network error (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Network error. Please check your connection.');
      }
      
      // Simulate email already exists error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('An account with this email already exists');
      }

      // Mock registration - in real app, this would call your API
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error; // Re-throw to let the UI handle the error message
    }
  }, []);

  const logout = useCallback(() => {
    try {
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const openAuthModal = useCallback((mode: 'login' | 'register') => {
    dispatch({ type: 'OPEN_AUTH_MODAL', payload: mode });
  }, []);

  const closeAuthModal = useCallback(() => {
    dispatch({ type: 'CLOSE_AUTH_MODAL' });
  }, []);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      openAuthModal,
      closeAuthModal,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
