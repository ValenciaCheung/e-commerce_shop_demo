import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SearchPage from '../app/search/page'
import { searchProducts, getProductsByCategory } from '@/lib/products'

// Mock the products module
jest.mock('@/lib/products', () => ({
  searchProducts: jest.fn(),
  getProductsByCategory: jest.fn(),
  getAvailableBrands: jest.fn(() => ['TestBrand1', 'TestBrand2']),
  getAvailableSizes: jest.fn(() => ['S', 'M', 'L']),
  getPriceRange: jest.fn(() => ({ min: 0, max: 1000 }))
}))

// Mock Next.js components
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: jest.fn((key) => {
      if (key === 'q') return 'test query'
      if (key === 'category') return 'electronics'
      return null
    })
  }),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn()
  })
}))

jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) {
    return <img src={src} alt={alt} {...props} />
  }
})

jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) {
    return <a href={href} {...props}>{children}</a>
  }
})

// Mock components
jest.mock('@/components/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>
  }
})

jest.mock('@/components/CartSidebar', () => {
  return function MockCartSidebar() {
    return <div data-testid="cart-sidebar">Cart Sidebar</div>
  }
})

jest.mock('@/components/AuthModal', () => {
  return function MockAuthModal() {
    return <div data-testid="auth-modal">Auth Modal</div>
  }
})

jest.mock('@/components/ProductCard', () => {
  return function MockProductCard({ product }: { product: { id: string; name: string; price: number } }) {
    return (
      <div data-testid={`product-${product.id}`}>
        <h3>{product.name}</h3>
        <p>${product.price}</p>
      </div>
    )
  }
})

const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    price: 99.99,
    category: 'electronics',
    brand: 'TestBrand1',
    images: ['image1.jpg'],
    inStock: true,
    rating: 4.5,
    reviewCount: 10
  },
  {
    id: '2',
    name: 'Test Product 2',
    price: 149.99,
    category: 'electronics',
    brand: 'TestBrand2',
    images: ['image2.jpg'],
    inStock: true,
    rating: 4.0,
    reviewCount: 5
  }
]

describe('Search Functionality', () => {
  beforeEach(() => {
    ;(searchProducts as jest.Mock).mockReturnValue(mockProducts)
    ;(getProductsByCategory as jest.Mock).mockReturnValue(mockProducts)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('displays search results correctly', async () => {
    render(<SearchPage />)

    await waitFor(() => {
      expect(screen.getByText('Search results for "test query"')).toBeInTheDocument()
    })

    expect(screen.getByText('Showing 2 products')).toBeInTheDocument()
    expect(screen.getByTestId('product-1')).toBeInTheDocument()
    expect(screen.getByTestId('product-2')).toBeInTheDocument()
  })

  it('calls searchProducts with correct query', () => {
    render(<SearchPage />)

    expect(searchProducts).toHaveBeenCalledWith('test query')
  })

  it('displays no results message when no products found', async () => {
    ;(searchProducts as jest.Mock).mockReturnValue([])

    render(<SearchPage />)

    await waitFor(() => {
      expect(screen.getByText('Showing 0 products')).toBeInTheDocument()
    })
  })

  it('handles category filtering', () => {
    render(<SearchPage />)

    expect(getProductsByCategory).toHaveBeenCalledWith('electronics')
  })

  it('displays filter options', async () => {
    render(<SearchPage />)

    await waitFor(() => {
      expect(screen.getByText('Filters')).toBeInTheDocument()
    })

    expect(screen.getByText('Brand')).toBeInTheDocument()
    expect(screen.getByText('Size')).toBeInTheDocument()
    expect(screen.getByText('Price Range')).toBeInTheDocument()
  })
})

// Test search utility functions
describe('Search Utility Functions', () => {
  // Reset mocks for utility function tests
  beforeEach(() => {
    jest.resetModules()
  })

  it('searchProducts filters by name', () => {
    // This would test the actual searchProducts function
    // We need to import the real function for this test
    const { searchProducts: realSearchProducts } = jest.requireActual('@/lib/products')
    
    // Mock products data
    const mockProductsData = [
      { id: '1', name: 'iPhone 14', description: 'Apple smartphone', brand: 'Apple' },
      { id: '2', name: 'Samsung Galaxy', description: 'Android phone', brand: 'Samsung' },
      { id: '3', name: 'iPad Pro', description: 'Apple tablet', brand: 'Apple' }
    ]

    // Mock the products array
    jest.doMock('@/lib/products', () => ({
      ...jest.requireActual('@/lib/products'),
      products: mockProductsData
    }))

    const results = realSearchProducts('iPhone')
    expect(results).toHaveLength(1)
    expect(results[0].name).toBe('iPhone 14')
  })

  it('searchProducts filters by brand', () => {
    const { searchProducts: realSearchProducts } = jest.requireActual('@/lib/products')
    
    const mockProductsData = [
      { id: '1', name: 'iPhone 14', description: 'Apple smartphone', brand: 'Apple' },
      { id: '2', name: 'Samsung Galaxy', description: 'Android phone', brand: 'Samsung' }
    ]

    jest.doMock('@/lib/products', () => ({
      ...jest.requireActual('@/lib/products'),
      products: mockProductsData
    }))

    const results = realSearchProducts('Apple')
    expect(results).toHaveLength(1)
    expect(results[0].brand).toBe('Apple')
  })

  it('searchProducts is case insensitive', () => {
    const { searchProducts: realSearchProducts } = jest.requireActual('@/lib/products')
    
    const mockProductsData = [
      { id: '1', name: 'iPhone 14', description: 'Apple smartphone', brand: 'Apple' }
    ]

    jest.doMock('@/lib/products', () => ({
      ...jest.requireActual('@/lib/products'),
      products: mockProductsData
    }))

    const results = realSearchProducts('iphone')
    expect(results).toHaveLength(1)
    expect(results[0].name).toBe('iPhone 14')
  })
})