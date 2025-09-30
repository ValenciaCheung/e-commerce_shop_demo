import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import CartSidebar from '../CartSidebar';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/lib/types';

// Mock Next.js components
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock CartContext
jest.mock('@/contexts/CartContext', () => ({
  useCart: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;

// Mock cart items
const mockCartItems: CartItem[] = [
  {
    product: {
      id: '1',
      name: 'Test Product 1',
      price: 99.99,
      originalPrice: 129.99,
      images: ['/test-image-1.jpg'],
      brand: 'Test Brand',
      category: 'Test Category',
      description: 'Test description',
      features: ['Feature 1'],
      sizes: ['S', 'M', 'L'],
      colors: ['Red', 'Blue'],
      inStock: true,
      rating: 4.5,
      reviewCount: 100,
      isNew: false,
      isSale: true,
    },
    size: 'M',
    color: 'Red',
    quantity: 2,
  },
  {
    product: {
      id: '2',
      name: 'Test Product 2',
      price: 49.99,
      originalPrice: 69.99,
      images: ['/test-image-2.jpg'],
      brand: 'Test Brand 2',
      category: 'Test Category 2',
      description: 'Test description 2',
      features: ['Feature 2'],
      sizes: ['S', 'M', 'L'],
      colors: ['Green', 'Yellow'],
      inStock: true,
      rating: 4.0,
      reviewCount: 50,
      isNew: true,
      isSale: false,
    },
    size: 'L',
    color: 'Green',
    quantity: 1,
  },
];

const mockCartContextValue = {
  items: mockCartItems,
  isOpen: true,
  total: 249.97,
  itemCount: 3,
  updateQuantity: jest.fn(),
  removeFromCart: jest.fn(),
  toggleCart: jest.fn(),
  addToCart: jest.fn(),
  clearCart: jest.fn(),
  getTotalPrice: jest.fn(() => 249.97),
};

const mockEmptyCartContextValue = {
  items: [],
  isOpen: true,
  total: 0,
  itemCount: 0,
  updateQuantity: jest.fn(),
  removeFromCart: jest.fn(),
  toggleCart: jest.fn(),
  addToCart: jest.fn(),
  clearCart: jest.fn(),
  getTotalPrice: jest.fn(() => 0),
};

describe('CartSidebar', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    } as ReturnType<typeof useRouter>);
    
    jest.clearAllMocks();
  });

  it('should render empty cart message when cart is empty', () => {
    mockUseCart.mockReturnValue(mockEmptyCartContextValue);
    
    render(<CartSidebar />);
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('CONTINUE SHOPPING')).toBeInTheDocument();
  });

  it('should not render sidebar when cart is closed', () => {
    mockUseCart.mockReturnValue({
      ...mockEmptyCartContextValue,
      isOpen: false,
    });
    
    render(<CartSidebar />);
    
    // The sidebar should not be visible when closed
    const sidebar = screen.queryByText('Your cart is empty');
    expect(sidebar).not.toBeInTheDocument();
  });

  it('should render cart items when cart has items', () => {
    mockUseCart.mockReturnValue(mockCartContextValue);
    
    render(<CartSidebar />);
    
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('Size: M')).toBeInTheDocument();
    expect(screen.getByText('Color: Red')).toBeInTheDocument();
    expect(screen.getByText('Size: L')).toBeInTheDocument();
    expect(screen.getByText('Color: Green')).toBeInTheDocument();
  });

  it('should display correct total and item count', () => {
    mockUseCart.mockReturnValue(mockCartContextValue);
    
    render(<CartSidebar />);
    
    expect(screen.getByText('$249.97')).toBeInTheDocument();
    expect(screen.getByText('Order summary')).toBeInTheDocument();
  });

  it('should call updateQuantity when quantity buttons are clicked', () => {
    mockUseCart.mockReturnValue(mockCartContextValue);
    
    render(<CartSidebar />);
    
    // Find quantity increase button for first item
    const increaseButtons = screen.getAllByRole('button', { name: /\+/ });
    const decreaseButtons = screen.getAllByRole('button', { name: /-/ });
    
    fireEvent.click(increaseButtons[0]);
    expect(mockCartContextValue.updateQuantity).toHaveBeenCalledWith('1', 'M', 'Red', 3);
    
    fireEvent.click(decreaseButtons[0]);
    expect(mockCartContextValue.updateQuantity).toHaveBeenCalledWith('1', 'M', 'Red', 1);
  });

  it('should call removeFromCart when remove button is clicked', () => {
    mockUseCart.mockReturnValue(mockCartContextValue);
    
    render(<CartSidebar />);
    
    const removeButtons = screen.getAllByRole('button', { name: /×/ });
    fireEvent.click(removeButtons[0]);
    
    expect(mockCartContextValue.removeFromCart).toHaveBeenCalledWith('1', 'M', 'Red');
  });

  it('should call toggleCart when close button is clicked', () => {
    mockUseCart.mockReturnValue(mockCartContextValue);
    
    render(<CartSidebar />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockCartContextValue.toggleCart).toHaveBeenCalled();
  });

  it('should call toggleCart when continue shopping is clicked', () => {
    mockUseCart.mockReturnValue(mockEmptyCartContextValue);
    
    render(<CartSidebar />);
    
    const continueShoppingButton = screen.getByText('CONTINUE SHOPPING');
    fireEvent.click(continueShoppingButton);
    
    expect(mockEmptyCartContextValue.toggleCart).toHaveBeenCalled();
  });

  it('should render checkout button when cart has items', () => {
    mockUseCart.mockReturnValue(mockCartContextValue);
    
    render(<CartSidebar />);
    
    const checkoutButton = screen.getByText('Checkout');
    expect(checkoutButton).toBeInTheDocument();
    expect(checkoutButton.closest('a')).toHaveAttribute('href', '/checkout');
  });

  it('should render continue shopping button when cart has items', () => {
    mockUseCart.mockReturnValue(mockCartContextValue);
    
    render(<CartSidebar />);
    
    const continueShoppingButton = screen.getByText('Continue Shopping');
    expect(continueShoppingButton).toBeInTheDocument();
    
    fireEvent.click(continueShoppingButton);
    expect(mockCartContextValue.toggleCart).toHaveBeenCalled();
  });

  it('should display product images correctly', () => {
    mockUseCart.mockReturnValue(mockCartContextValue);
    
    render(<CartSidebar />);
    
    const productImages = screen.getAllByRole('img');
    expect(productImages[0]).toHaveAttribute('src', '/test-image-1.jpg');
    expect(productImages[0]).toHaveAttribute('alt', 'Test Product 1');
    expect(productImages[1]).toHaveAttribute('src', '/test-image-2.jpg');
    expect(productImages[1]).toHaveAttribute('alt', 'Test Product 2');
  });

  it('should display placeholder image when product has no images', () => {
    const cartWithNoImages = {
      ...mockCartContextValue,
      items: [
        {
          ...mockCartItems[0],
          product: {
            ...mockCartItems[0].product,
            images: [],
          },
        },
      ],
    };
    
    mockUseCart.mockReturnValue(cartWithNoImages);
    
    render(<CartSidebar />);
    
    const placeholderImage = screen.getByRole('img');
    expect(placeholderImage).toHaveAttribute('src', '/placeholder-image.svg');
  });

  it('should display correct quantity for each item', () => {
    mockUseCart.mockReturnValue(mockCartContextValue);
    
    render(<CartSidebar />);
    
    // Check quantity displays
    const quantityDisplays = screen.getAllByText(/^\d+$/);
    expect(quantityDisplays).toHaveLength(2); // Two items with quantities
  });

  it('should handle overlay click to close cart', () => {
    mockUseCart.mockReturnValue(mockCartContextValue);
    
    render(<CartSidebar />);
    
    // Find the overlay (the backdrop)
    const overlay = screen.getByTestId('cart-overlay') || document.querySelector('.fixed.inset-0');
    if (overlay) {
      fireEvent.click(overlay);
      expect(mockCartContextValue.toggleCart).toHaveBeenCalled();
    }
  });

  it('should prevent quantity from going below 1', () => {
    const cartWithSingleQuantity = {
      ...mockCartContextValue,
      items: [
        {
          ...mockCartItems[0],
          quantity: 1,
        },
      ],
    };
    
    mockUseCart.mockReturnValue(cartWithSingleQuantity);
    
    render(<CartSidebar />);
    
    const decreaseButton = screen.getByRole('button', { name: /-/ });
    fireEvent.click(decreaseButton);
    
    // Should call updateQuantity with 0, which should trigger removal
    expect(mockCartContextValue.updateQuantity).toHaveBeenCalledWith('1', 'M', 'Red', 0);
  });
});