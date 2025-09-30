'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Order, ShippingAddress, PaymentMethod, CartItem } from '@/lib/types';

interface OrdersContextType {
  orders: Order[];
  currentOrder: Partial<Order> | null;
  isLoading: boolean;
  createOrder: (items: CartItem[], shippingAddress: ShippingAddress, billingAddress: ShippingAddress, paymentMethod: PaymentMethod) => Promise<Order>;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (userId: string) => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  setCurrentOrder: (order: Partial<Order> | null) => void;
  calculateTotals: (items: CartItem[], shippingAddress?: ShippingAddress, discountCode?: string) => { subtotal: number; shipping: number; tax: number; discount: number; total: number };
}

type OrdersAction =
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'SET_CURRENT_ORDER'; payload: Partial<Order> | null }
  | { type: 'LOAD_ORDERS'; payload: Order[] }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState = {
  orders: [] as Order[],
  currentOrder: null as Partial<Order> | null,
  isLoading: false,
};

function ordersReducer(state: typeof initialState, action: OrdersAction): typeof initialState {
  switch (action.type) {
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
        currentOrder: action.payload,
      };

    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status, updatedAt: new Date() }
            : order
        ),
      };

    case 'SET_CURRENT_ORDER':
      return {
        ...state,
        currentOrder: action.payload,
      };

    case 'LOAD_ORDERS':
      return {
        ...state,
        orders: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(ordersReducer, initialState);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('evershop-orders');
    if (savedOrders) {
      try {
        const orders = JSON.parse(savedOrders).map((order: Record<string, unknown>) => ({
          ...order,
          createdAt: new Date(order.createdAt as string),
          updatedAt: new Date(order.updatedAt as string),
          estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery as string) : undefined,
        }));
        dispatch({ type: 'LOAD_ORDERS', payload: orders });
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
      }
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (state.orders.length > 0) {
      localStorage.setItem('evershop-orders', JSON.stringify(state.orders));
    }
  }, [state.orders]);

  const calculateTotals = useCallback((items: CartItem[], shippingAddress?: ShippingAddress, discountCode?: string) => {
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Standard delivery shipping fee
    const shipping = 5.00;

    // Calculate tax (8.5% for demo)
    const tax = subtotal * 0.085;

    // Calculate discount based on discount code
    let discount = 0;
    if (discountCode) {
      // Simple discount logic - can be expanded
      switch (discountCode.toUpperCase()) {
        case 'SAVE10':
          discount = subtotal * 0.1; // 10% off
          break;
        case 'SAVE20':
          discount = subtotal * 0.2; // 20% off
          break;
        case 'FREESHIP':
          discount = shipping; // Free shipping
          break;
        default:
          discount = 0;
      }
    }

    const total = subtotal + shipping + tax - discount;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }, []);

  const createOrder = useCallback(async (
    items: CartItem[],
    shippingAddress: ShippingAddress,
    billingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    userId?: string
  ): Promise<Order> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const totals = calculateTotals(items, shippingAddress);

      // Generate a more readable and unique order ID
      // Format: timestamp + random alphanumeric (e.g., 1759194655781-A4H137)
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substr(2, 6).toUpperCase();
      const orderId = `${timestamp}-${randomSuffix}`;

      const order: Order = {
        id: orderId,
        userId: userId || 'guest-user', // Use provided userId or fallback to guest
        items,
        shippingAddress,
        billingAddress,
        paymentMethod: {
          type: paymentMethod.type,
          cardNumber: `****-****-****-${paymentMethod.cardNumber.slice(-4)}`,
          expiryMonth: paymentMethod.expiryMonth,
          expiryYear: paymentMethod.expiryYear,
          nameOnCard: paymentMethod.nameOnCard,
        },
        ...totals,
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date(),
        trackingNumber: `TRK${Date.now()}`,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      };

      dispatch({ type: 'ADD_ORDER', payload: order });

      // Simulate order confirmation email
      console.log('Order confirmation email sent for order:', order.id);

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [calculateTotals]);

  const getOrderById = useCallback((orderId: string): Order | undefined => {
    return state.orders.find(order => order.id === orderId);
  }, [state.orders]);

  const getUserOrders = useCallback((userId: string): Order[] => {
    return state.orders.filter(order => order.userId === userId);
  }, [state.orders]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
  }, []);

  const setCurrentOrder = useCallback((order: Partial<Order> | null) => {
    dispatch({ type: 'SET_CURRENT_ORDER', payload: order });
  }, []);

  return (
    <OrdersContext.Provider value={{
      orders: state.orders,
      currentOrder: state.currentOrder,
      isLoading: state.isLoading,
      createOrder,
      getOrderById,
      getUserOrders,
      updateOrderStatus,
      setCurrentOrder,
      calculateTotals,
    }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
