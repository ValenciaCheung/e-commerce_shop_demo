import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProductCard from '../ProductCard'
import { Product } from '@/lib/types'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { ComparisonProvider } from '@/contexts/ComparisonContext'
import { ReviewsProvider } from '@/contexts/ReviewsContext'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) {
    return <a href={href} {...props}>{children}</a>
  }
})

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  originalPrice: 129.99,
  category: 'electronics',
  brand: 'TestBrand',
  images: ['https://example.com/image1.jpg'],
  colors: ['Red', 'Blue'],
  sizes: ['M', 'L'],
  inStock: true,
  featured: true,
  rating: 4.5,
  reviewCount: 10,
  tags: ['popular']
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <WishlistProvider>
      <ComparisonProvider>
        <ReviewsProvider>
          {children}
        </ReviewsProvider>
      </ComparisonProvider>
    </WishlistProvider>
  )
}

describe('ProductCard Component', () => {
  it('renders product information correctly', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    )

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('TestBrand')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('$129.99')).toBeInTheDocument()
    expect(screen.getByAltText('Test Product')).toBeInTheDocument()
  })

  it('displays stock status correctly', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    )

    expect(screen.getByText('In Stock')).toBeInTheDocument()
  })

  it('displays out of stock when product is not in stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false }
    
    render(
      <TestWrapper>
        <ProductCard product={outOfStockProduct} />
      </TestWrapper>
    )

    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
  })

  it('displays rating and review count', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    )

    expect(screen.getByText('4.5 (10)')).toBeInTheDocument()
  })

  it('has correct product link', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    )

    const productLink = screen.getByRole('link')
    expect(productLink).toHaveAttribute('href', '/product/1')
  })

  it('handles wishlist toggle', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    )

    const wishlistButton = screen.getByTitle('Add to wishlist')
    expect(wishlistButton).toBeInTheDocument()
    
    fireEvent.click(wishlistButton)
    // After clicking, the title should change to 'Remove from wishlist'
    // This would require checking the context state change
  })

  it('handles comparison toggle', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    )

    const comparisonButton = screen.getByTitle('Add to comparison')
    expect(comparisonButton).toBeInTheDocument()
    
    fireEvent.click(comparisonButton)
    // After clicking, the button state should change
  })

  it('hides actions when showActions is false', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} showActions={false} />
      </TestWrapper>
    )

    expect(screen.queryByTitle('Add to wishlist')).not.toBeInTheDocument()
    expect(screen.queryByTitle('Add to comparison')).not.toBeInTheDocument()
  })
})