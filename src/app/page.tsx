import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedProducts } from '@/lib/products';
import CartSidebar from '@/components/CartSidebar';
import AuthModal from '@/components/AuthModal';
import WishlistSidebar from '@/components/WishlistSidebar';
import ComparisonSidebar from '@/components/ComparisonSidebar';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';

export default function Home() {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="bg-white">
      {/* Header */}
      <Header />

      <main>
        {/* Hero Section */}
        <section
          className="relative min-h-[500px] mt-0 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #aad3ff, #0056b3)'
          }}
        >
          <div className="flex items-center max-w-6xl w-full px-5 flex-wrap">
            {/* 3D Cube Logo */}
            <div className="flex-1 min-w-[300px] flex justify-center lg:justify-start">
              <div className="w-64 h-64 relative">
                <svg viewBox="0 0 300 300" className="w-full h-full">
                  {/* 3D Cube Design */}
                  <defs>
                    <linearGradient id="face1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e40af" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                    <linearGradient id="face2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <linearGradient id="face3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#93c5fd" />
                    </linearGradient>
                  </defs>

                  {/* Back faces */}
                  <polygon points="60,80 180,80 180,150 60,150" fill="url(#face1)" />
                  <polygon points="80,60 200,60 200,130 80,130" fill="url(#face2)" />
                  <polygon points="100,40 220,40 220,110 100,110" fill="url(#face3)" />

                  {/* Front faces */}
                  <polygon points="80,100 200,100 200,170 80,170" fill="url(#face1)" />
                  <polygon points="100,80 220,80 220,150 100,150" fill="url(#face2)" />
                  <polygon points="120,60 240,60 240,130 120,130" fill="url(#face3)" />

                  {/* Connecting lines */}
                  <line x1="60" y1="80" x2="80" y2="100" stroke="#1d4ed8" strokeWidth="2" />
                  <line x1="180" y1="80" x2="200" y2="100" stroke="#1d4ed8" strokeWidth="2" />
                  <line x1="60" y1="150" x2="80" y2="170" stroke="#1d4ed8" strokeWidth="2" />
                  <line x1="180" y1="150" x2="200" y2="170" stroke="#1d4ed8" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Hero Text */}
            <div className="flex-1 min-w-[300px] text-left p-5">
              <h1 className="text-6xl font-bold text-white mb-5">Your Heading Here</h1>
              <p className="text-xl text-white mb-8 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ultricies sodales mi, at ornare elit semper ac.
              </p>
              <a
                href="#featured"
                className="inline-block px-6 py-3 bg-white text-blue-700 font-bold rounded-md hover:bg-gray-100 transition-colors"
              >
                SHOP NOW
              </a>
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <section className="page-width mt-12 max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
            <div className="text-left">
              <h3 className="text-xl font-bold mb-4">Kids shoes collection</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Constructed from luxury nylons, leathers, and custom hardware, featuring sport details such as hidden breathing vents, waterproof + antimicrobial linings, and more.
              </p>
              <Link
                href="/category/kids"
                className="inline-block px-6 py-3 bg-gray-800 text-white font-semibold rounded hover:bg-gray-700 transition-colors"
              >
                Shop kids
              </Link>
            </div>

            <div className="text-left">
              <h3 className="text-xl font-bold mb-4">Women shoes collection</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Constructed from luxury nylons, leathers, and custom hardware, featuring sport details such as hidden breathing vents, waterproof + antimicrobial linings, and more.
              </p>
              <Link
                href="/category/women"
                className="inline-block px-6 py-3 bg-gray-800 text-white font-semibold rounded hover:bg-gray-700 transition-colors"
              >
                Shop women
              </Link>
            </div>

            <div className="text-left">
              <h3 className="text-xl font-bold mb-4">Men shoes collection</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Constructed from luxury nylons, leathers, and custom hardware, featuring sport details such as hidden breathing vents, waterproof + antimicrobial linings, and more.
              </p>
              <Link
                href="/category/men"
                className="inline-block px-6 py-3 bg-gray-800 text-white font-semibold rounded hover:bg-gray-700 transition-colors"
              >
                Shop men
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section id="featured" className="pt-12 max-w-6xl mx-auto px-5">
          <h3 className="mt-12 mb-12 text-center uppercase text-lg tracking-widest font-semibold">
            Featured Products
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}    
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-between items-center">
            <div className="flex justify-center md:justify-start">
              <div className="flex items-center gap-4">
                <Image
                  src="https://ext.same-assets.com/1344025563/1846205134.svg"
                  alt="Payment Methods"
                  width={38}
                  height={40}
                />

                {/* Visa */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38"
                  height="24"
                  viewBox="0 0 38 24"
                  role="img"
                  aria-labelledby="pi-visa"
                >
                  <title id="pi-visa">Visa</title>
                  <rect x="0" y="0" width="38" height="24" rx="3" fill="#000" opacity="0.07" />
                  <text
                    x="19"
                    y="16"
                    textAnchor="middle"
                    fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
                    fontSize="12"
                    fontWeight="700"
                    fill="#1A1F71"
                  >
                    VISA
                  </text>
                </svg>

                {/* PayPal */}
                <svg
                  viewBox="0 0 38 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width="38"
                  height="24"
                  role="img"
                  aria-labelledby="pi-paypal"
                >
                  <title id="pi-paypal">PayPal</title>
                  <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
                  <text
                    x="19"
                    y="16"
                    textAnchor="middle"
                    fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
                    fontSize="10"
                    fontWeight="700"
                    fill="#003087"
                  >
                    PayPal
                  </text>
                </svg>
              </div>
            </div>
            <div className="text-center md:text-right text-gray-500">
              <span>© 2026 Evershop. All Rights Reserved.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Components */}
      <CartSidebar />
      <AuthModal />
      <WishlistSidebar />
      <ComparisonSidebar />
    </div>
  );
}
