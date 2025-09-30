import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';
import { Product } from '@/lib/types';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock product data
const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  originalPrice: 129.99,
  images: ['/test-image.jpg'],
  brand: 'Test Brand',
  category: 'Test Category',
  description: 'Test description',
  features: ['Feature 1', 'Feature 2'],
  sizes: ['S', 'M', 'L'],
  colors: ['Red', 'Blue'],
  inStock: true,
  rating: 4.5,
  reviewCount: 100,
  isNew: false,
  isSale: true,
};

// Test component to access cart context
function TestComponent() {
  const {
    items,
    total,
    itemCount,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
  } = useCart();

  return (
    <div>
      <div data-testid="item-count">{itemCount}</div>
      <div data-testid="total">{total.toFixed(2)}</div>
      <div data-testid="is-open">{isOpen ? 'open' : 'closed'}</div>
      <div data-testid="items-length">{items.length}</div>
      
      <button
        data-testid="add-to-cart"
        onClick={() => addToCart(mockProduct, 'M', 'Red', 2)}
      >
        Add to Cart
      </button>
      
      <button
        data-testid="remove-from-cart"
        onClick={() => removeFromCart('1', 'M', 'Red')}
      >
        Remove from Cart
      </button>
      
      <button
        data-testid="update-quantity"
        onClick={() => updateQuantity('1', 'M', 'Red', 3)}
      >
        Update Quantity
      </button>
      
      <button data-testid="clear-cart" onClick={clearCart}>
        Clear Cart
      </button>
      
      <button data-testid="toggle-cart" onClick={toggleCart}>
        Toggle Cart
      </button>
      
      {items.map((item, index) => (
        <div key={index} data-testid={`item-${index}`}>
          <span data-testid={`item-name-${index}`}>{item.product.name}</span>
          <span data-testid={`item-quantity-${index}`}>{item.quantity}</span>
          <span data-testid={`item-size-${index}`}>{item.size}</span>
          <span data-testid={`item-color-${index}`}>{item.color}</span>
        </div>
      ))}
    </div>
  );
}

function renderWithProvider() {
  return render(
    <CartProvider>
      <TestComponent />
    </CartProvider>
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
  });

  it('should initialize with empty cart', () => {
    renderWithProvider();
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total')).toHaveTextContent('0.00');
    expect(screen.getByTestId('is-open')).toHaveTextContent('closed');
    expect(screen.getByTestId('items-length')).toHaveTextContent('0');
  });

  it('should add item to cart', () => {
    renderWithProvider();
    
    act(() => {
      fireEvent.click(screen.getByTestId('add-to-cart'));
    });
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('2');
    expect(screen.getByTestId('total')).toHaveTextContent('199.98');
    expect(screen.getByTestId('items-length')).toHaveTextContent('1');
    expect(screen.getByTestId('item-name-0')).toHaveTextContent('Test Product');
    expect(screen.getByTestId('item-quantity-0')).toHaveTextContent('2');
    expect(screen.getByTestId('item-size-0')).toHaveTextContent('M');
    expect(screen.getByTestId('item-color-0')).toHaveTextContent('Red');
  });

  it('should update quantity when adding same item', () => {
    renderWithProvider();
    
    // Add item first time
    act(() => {
      fireEvent.click(screen.getByTestId('add-to-cart'));
    });
    
    // Add same item again
    act(() => {
      fireEvent.click(screen.getByTestId('add-to-cart'));
    });
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('4');
    expect(screen.getByTestId('total')).toHaveTextContent('399.96');
    expect(screen.getByTestId('items-length')).toHaveTextContent('1');
    expect(screen.getByTestId('item-quantity-0')).toHaveTextContent('4');
  });

  it('should remove item from cart', () => {
    renderWithProvider();
    
    // Add item first
    act(() => {
      fireEvent.click(screen.getByTestId('add-to-cart'));
    });
    
    // Remove item
    act(() => {
      fireEvent.click(screen.getByTestId('remove-from-cart'));
    });
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total')).toHaveTextContent('0.00');
    expect(screen.getByTestId('items-length')).toHaveTextContent('0');
  });

  it('should update item quantity', () => {
    renderWithProvider();
    
    // Add item first
    act(() => {
      fireEvent.click(screen.getByTestId('add-to-cart'));
    });
    
    // Update quantity
    act(() => {
      fireEvent.click(screen.getByTestId('update-quantity'));
    });
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('3');
    expect(screen.getByTestId('total')).toHaveTextContent('299.97');
    expect(screen.getByTestId('item-quantity-0')).toHaveTextContent('3');
  });

  it('should remove item when quantity is updated to 0', () => {
    renderWithProvider();
    
    // Add item first
    act(() => {
      fireEvent.click(screen.getByTestId('add-to-cart'));
    });
    
    // Update quantity to 0
    act(() => {
      fireEvent.click(screen.getByTestId('update-quantity'));
    });
    
    // Manually update to 0
    const { updateQuantity } = useCart();
    act(() => {
      updateQuantity('1', 'M', 'Red', 0);
    });
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    expect(screen.getByTestId('items-length')).toHaveTextContent('0');
  });

  it('should clear all items from cart', () => {
    renderWithProvider();
    
    // Add item first
    act(() => {
      fireEvent.click(screen.getByTestId('add-to-cart'));
    });
    
    // Clear cart
    act(() => {
      fireEvent.click(screen.getByTestId('clear-cart'));
    });
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total')).toHaveTextContent('0.00');
    expect(screen.getByTestId('items-length')).toHaveTextContent('0');
  });

  it('should toggle cart open/close state', () => {
    renderWithProvider();
    
    expect(screen.getByTestId('is-open')).toHaveTextContent('closed');
    
    act(() => {
      fireEvent.click(screen.getByTestId('toggle-cart'));
    });
    
    expect(screen.getByTestId('is-open')).toHaveTextContent('open');
    
    act(() => {
      fireEvent.click(screen.getByTestId('toggle-cart'));
    });
    
    expect(screen.getByTestId('is-open')).toHaveTextContent('closed');
  });

  it('should save cart to localStorage when items change', () => {
    renderWithProvider();
    
    act(() => {
      fireEvent.click(screen.getByTestId('add-to-cart'));
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'cart',
      expect.stringContaining('Test Product')
    );
  });

  it('should load cart from localStorage on initialization', () => {
    const savedCart = JSON.stringify([
      {
        product: mockProduct,
        size: 'L',
        color: 'Blue',
        quantity: 1,
      },
    ]);
    
    localStorageMock.getItem.mockReturnValue(savedCart);
    
    renderWithProvider();
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('1');
    expect(screen.getByTestId('total')).toHaveTextContent('99.99');
    expect(screen.getByTestId('items-length')).toHaveTextContent('1');
  });

  it('should handle different sizes and colors as separate items', () => {
    renderWithProvider();
    
    const { addToCart } = useCart();
    
    // Add same product with different size/color combinations
    act(() => {
      addToCart(mockProduct, 'M', 'Red', 1);
    });
    
    act(() => {
      addToCart(mockProduct, 'L', 'Red', 1);
    });
    
    act(() => {
      addToCart(mockProduct, 'M', 'Blue', 1);
    });
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('3');
    expect(screen.getByTestId('items-length')).toHaveTextContent('3');
  });
});