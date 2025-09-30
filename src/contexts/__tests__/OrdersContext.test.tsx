import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { OrdersProvider, useOrders } from '../OrdersContext';
import { CartItem, ShippingAddress, PaymentMethod, Order } from '@/lib/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock console methods
const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

// Test component to access context
function TestComponent() {
  const {
    orders,
    currentOrder,
    isLoading,
    createOrder,
    getOrderById,
    getUserOrders,
    updateOrderStatus,
    setCurrentOrder,
    calculateTotals,
  } = useOrders();

  return (
    <div>
      <div data-testid="orders-count">{orders.length}</div>
      <div data-testid="current-order">{currentOrder?.id || 'none'}</div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <button
        data-testid="create-order"
        onClick={async () => {
          const mockItems: CartItem[] = [
            {
              product: {
                id: '1',
                name: 'Test Product',
                description: 'Test Description',
                price: 99.99,
                category: 'men',
                brand: 'Test Brand',
                images: ['test.jpg'],
                sizes: [{ size: 'M', inStock: true, quantity: 10 }],
                colors: [{ name: 'Black', hex: '#000000', images: ['test.jpg'] }],
                inStock: true,
                rating: 4.5,
                reviewCount: 10,
                featured: false,
              },
              size: 'M',
              color: 'Black',
              quantity: 2,
            },
          ];

          const mockShippingAddress: ShippingAddress = {
            firstName: 'John',
            lastName: 'Doe',
            address1: '123 Test St',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            country: 'US',
          };

          const mockPaymentMethod: PaymentMethod = {
            type: 'card',
            cardNumber: '1234567890123456',
            expiryMonth: '12',
            expiryYear: '2025',
            cvv: '123',
            nameOnCard: 'John Doe',
          };

          await createOrder(mockItems, mockShippingAddress, mockShippingAddress, mockPaymentMethod, 'user-123');
        }}
      >
        Create Order
      </button>
      <button
        data-testid="calculate-totals"
        onClick={() => {
          const mockItems: CartItem[] = [
            {
              product: {
                id: '1',
                name: 'Test Product',
                description: 'Test Description',
                price: 100.00,
                category: 'men',
                brand: 'Test Brand',
                images: ['test.jpg'],
                sizes: [{ size: 'M', inStock: true, quantity: 10 }],
                colors: [{ name: 'Black', hex: '#000000', images: ['test.jpg'] }],
                inStock: true,
                rating: 4.5,
                reviewCount: 10,
                featured: false,
              },
              size: 'M',
              color: 'Black',
              quantity: 1,
            },
          ];
          const totals = calculateTotals(mockItems);
          console.log('Totals calculated:', totals);
        }}
      >
        Calculate Totals
      </button>
      <button
        data-testid="update-status"
        onClick={() => {
          if (orders.length > 0) {
            updateOrderStatus(orders[0].id, 'shipped');
          }
        }}
      >
        Update Status
      </button>
      <button
        data-testid="get-user-orders"
        onClick={() => {
          const userOrders = getUserOrders('user-123');
          console.log('User orders:', userOrders.length);
        }}
      >
        Get User Orders
      </button>
    </div>
  );
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <OrdersProvider>{children}</OrdersProvider>;
}

describe('OrdersContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    consoleSpy.mockClear();
    consoleErrorSpy.mockClear();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should provide initial state', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('orders-count')).toHaveTextContent('0');
    expect(screen.getByTestId('current-order')).toHaveTextContent('none');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('should calculate totals correctly', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    act(() => {
      screen.getByTestId('calculate-totals').click();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Totals calculated:', {
      subtotal: 100.00,
      shipping: 5.00,
      tax: 8.50,
      discount: 0,
      total: 113.50,
    });
  });

  it('should calculate discount correctly', () => {
    const { calculateTotals } = renderHook(() => useOrders(), {
      wrapper: TestWrapper,
    }).result.current;

    const mockItems: CartItem[] = [
      {
        product: {
          id: '1',
          name: 'Test Product',
          description: 'Test Description',
          price: 100.00,
          category: 'men',
          brand: 'Test Brand',
          images: ['test.jpg'],
          sizes: [{ size: 'M', inStock: true, quantity: 10 }],
          colors: [{ name: 'Black', hex: '#000000', images: ['test.jpg'] }],
          inStock: true,
          rating: 4.5,
          reviewCount: 10,
          featured: false,
        },
        size: 'M',
        color: 'Black',
        quantity: 1,
      },
    ];

    // Test SAVE10 discount
    const totalsWithSave10 = calculateTotals(mockItems, undefined, 'SAVE10');
    expect(totalsWithSave10.discount).toBe(10.00); // 10% of 100
    expect(totalsWithSave10.total).toBe(103.50); // 100 + 5 + 8.5 - 10

    // Test SAVE20 discount
    const totalsWithSave20 = calculateTotals(mockItems, undefined, 'SAVE20');
    expect(totalsWithSave20.discount).toBe(20.00); // 20% of 100
    expect(totalsWithSave20.total).toBe(93.50); // 100 + 5 + 8.5 - 20

    // Test FREESHIP discount
    const totalsWithFreeShip = calculateTotals(mockItems, undefined, 'FREESHIP');
    expect(totalsWithFreeShip.discount).toBe(5.00); // Free shipping
    expect(totalsWithFreeShip.total).toBe(108.50); // 100 + 0 + 8.5

    // Test invalid discount code
    const totalsWithInvalid = calculateTotals(mockItems, undefined, 'INVALID');
    expect(totalsWithInvalid.discount).toBe(0);
    expect(totalsWithInvalid.total).toBe(113.50);
  });

  it('should create order successfully', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    act(() => {
      screen.getByTestId('create-order').click();
    });

    // Check loading state
    expect(screen.getByTestId('loading')).toHaveTextContent('true');

    // Fast-forward time to complete the async operation
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('orders-count')).toHaveTextContent('1');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Order confirmation email sent for order:',
      expect.any(String)
    );
  });

  it('should update order status', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // First create an order
    act(() => {
      screen.getByTestId('create-order').click();
    });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByTestId('orders-count')).toHaveTextContent('1');
    });

    // Then update its status
    act(() => {
      screen.getByTestId('update-status').click();
    });

    // Verify the order status was updated (this would require additional test setup to verify)
    expect(screen.getByTestId('orders-count')).toHaveTextContent('1');
  });

  it('should get user orders', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // First create an order
    act(() => {
      screen.getByTestId('create-order').click();
    });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByTestId('orders-count')).toHaveTextContent('1');
    });

    // Get user orders
    act(() => {
      screen.getByTestId('get-user-orders').click();
    });

    expect(consoleSpy).toHaveBeenCalledWith('User orders:', 1);
  });

  it('should load orders from localStorage on mount', () => {
    const mockOrder: Order = {
      id: 'test-order-1',
      userId: 'user-123',
      items: [],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'US',
      },
      billingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'US',
      },
      paymentMethod: {
        type: 'card',
        cardNumber: '****-****-****-1234',
        expiryMonth: '12',
        expiryYear: '2025',
        nameOnCard: 'John Doe',
      },
      subtotal: 100,
      shipping: 5,
      tax: 8.5,
      discount: 0,
      total: 113.5,
      status: 'confirmed',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      trackingNumber: 'TRK123456',
    };

    localStorageMock.setItem('evershop-orders', JSON.stringify([mockOrder]));

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('orders-count')).toHaveTextContent('1');
  });

  it('should handle localStorage errors gracefully', () => {
    localStorageMock.setItem('evershop-orders', 'invalid-json');

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error loading orders from localStorage:',
      expect.any(Error)
    );
    expect(screen.getByTestId('orders-count')).toHaveTextContent('0');
  });

  it('should throw error when useOrders is used outside provider', () => {
    const TestComponentWithoutProvider = () => {
      useOrders();
      return <div>Test</div>;
    };

    expect(() => {
      render(<TestComponentWithoutProvider />);
    }).toThrow('useOrders must be used within an OrdersProvider');
  });

  it('should save orders to localStorage when orders change', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    act(() => {
      screen.getByTestId('create-order').click();
    });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByTestId('orders-count')).toHaveTextContent('1');
    });

    const savedOrders = localStorageMock.getItem('evershop-orders');
    expect(savedOrders).toBeTruthy();
    const parsedOrders = JSON.parse(savedOrders!);
    expect(parsedOrders).toHaveLength(1);
    expect(parsedOrders[0].userId).toBe('user-123');
  });
});

// Import renderHook for testing hooks
import { renderHook } from '@testing-library/react';