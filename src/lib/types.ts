export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'men' | 'women' | 'kids';
  brand: string;
  images: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  featured: boolean;
}

export interface ProductSize {
  size: string;
  inStock: boolean;
  quantity: number;
}

export interface ProductColor {
  name: string;
  hex: string;
  images: string[];
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string | null;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  itemCount: number;
}

export interface SearchFilters {
  category?: string;
  priceRange?: [number, number];
  sizes?: string[];
  colors?: string[];
  brands?: string[];
  inStock?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

// Orders and Checkout
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface PaymentMethod {
  type: 'card' | 'cash';
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  nameOnCard: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  paymentMethod: {
    type: 'card' | 'cash';
    cardNumber: string; // This will be masked like ****-****-****-1234
    expiryMonth: string;
    expiryYear: string;
    nameOnCard: string;
  };
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

// Reviews and Ratings
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  verified: boolean;
  helpful: number;
  unhelpful: number;
  userHelpfulVote?: 'helpful' | 'unhelpful' | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// Wishlist
export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: Date;
}

export interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
}

// Product Comparison
export interface ComparisonState {
  items: Product[];
  isOpen: boolean;
  maxItems: number;
}

// Notifications
export interface Notification {
  id: string;
  type: 'order' | 'shipping' | 'promotion' | 'review';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// User Dashboard
export interface UserProfile extends User {
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  addresses: ShippingAddress[];
  preferences: {
    emailMarketing: boolean;
    smsMarketing: boolean;
    pushNotifications: boolean;
    currency: string;
    language: string;
  };
  createdAt: Date;
}
