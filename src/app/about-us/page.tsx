import { Metadata } from 'next';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import CartSidebar from '@/components/CartSidebar';
import AuthModal from '@/components/AuthModal';
import WishlistSidebar from '@/components/WishlistSidebar';
import ComparisonSidebar from '@/components/ComparisonSidebar';

export const metadata: Metadata = {
  title: 'About Us - EverShop',
  description: 'Learn more about EverShop and our commitment to providing quality products and exceptional customer service.',
};

export default function AboutUsPage() {
  const breadcrumbItems = [
    { label: 'About us' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartSidebar />
      <AuthModal />
      <WishlistSidebar />
      <ComparisonSidebar />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About us</h1>
        
        {/* Content Section */}
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed space-y-6">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nec turpis at arcu consequat dictum. 
              In eu euismod quam. Praesent ut finibus risus. Ut eu aliquet libero, non ornare nisl. Aenean gravida 
              urna at ligula viverra, sed pharetra ante pharetra. Interdum et malesuada fames ac ante ipsum primis 
              in faucibus. Quisque efficitur a mi eget hendrerit. Quisque tortor lorem, aliquet eget feugiat ac, 
              volutpat et lorem. Integer porta luctus leo et interdum. Morbi porta diam sem, sit amet porta lectus 
              iaculis ac.
            </p>
            
            <p>
              Donec lacinia malesuada orci, vitae tempor tortor volutpat in. Nullam tempor ex vel eros varius 
              bibendum. Fusce non risus ut ligula mollis molestie. Quisque vel pretium elit. Vestibulum ante 
              ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam sed lectus luctus, 
              auctor diam nec, varius diam. Sed id tortor at sem hendrerit aliquam.
            </p>
          </div>
        </div>
        
        {/* Additional Content Sections */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              We are committed to providing high-quality products and exceptional customer service. 
              Our goal is to make shopping convenient, enjoyable, and accessible for everyone.
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-700 leading-relaxed">
              Quality, integrity, and customer satisfaction are at the heart of everything we do. 
              We believe in building lasting relationships with our customers through trust and reliability.
            </p>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="mt-12 bg-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Have questions or feedback? We'd love to hear from you. Our customer service team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="/" 
              className="inline-block px-6 py-3 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors text-center"
            >
              Shop Now
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}