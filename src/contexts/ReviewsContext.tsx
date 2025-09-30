'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Review, ReviewSummary } from '@/lib/types';

interface ReviewsContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpful' | 'unhelpful' | 'userHelpfulVote'>) => void;
  getProductReviews: (productId: string) => Review[];
  getReviewSummary: (productId: string) => ReviewSummary;
  voteHelpful: (reviewId: string, vote: 'helpful' | 'unhelpful') => void;
  isLoading: boolean;
}

type ReviewsAction =
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'VOTE_HELPFUL'; payload: { reviewId: string; vote: 'helpful' | 'unhelpful' } }
  | { type: 'LOAD_REVIEWS'; payload: Review[] }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState = {
  reviews: [] as Review[],
  isLoading: false,
};

function reviewsReducer(state: typeof initialState, action: ReviewsAction): typeof initialState {
  switch (action.type) {
    case 'ADD_REVIEW':
      return {
        ...state,
        reviews: [...state.reviews, action.payload],
      };

    case 'VOTE_HELPFUL': {
      const { reviewId, vote } = action.payload;
      return {
        ...state,
        reviews: state.reviews.map(review => {
          if (review.id === reviewId) {
            // Remove previous vote if exists
            let helpful = review.helpful;
            let unhelpful = review.unhelpful;

            if (review.userHelpfulVote === 'helpful') helpful--;
            if (review.userHelpfulVote === 'unhelpful') unhelpful--;

            // Add new vote if different from current
            if (review.userHelpfulVote !== vote) {
              if (vote === 'helpful') helpful++;
              if (vote === 'unhelpful') unhelpful++;
            }

            return {
              ...review,
              helpful,
              unhelpful,
              userHelpfulVote: review.userHelpfulVote === vote ? null : vote,
            };
          }
          return review;
        }),
      };
    }

    case 'LOAD_REVIEWS':
      return {
        ...state,
        reviews: action.payload,
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

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reviewsReducer, initialState);

  // Load reviews from localStorage on mount
  useEffect(() => {
    const savedReviews = localStorage.getItem('evershop-reviews');
    if (savedReviews) {
      try {
        const reviews = JSON.parse(savedReviews).map((review: Record<string, unknown>) => ({
          ...review,
          createdAt: new Date(review.createdAt as string),
          updatedAt: new Date(review.updatedAt as string),
        }));
        dispatch({ type: 'LOAD_REVIEWS', payload: reviews });
      } catch (error) {
        console.error('Error loading reviews from localStorage:', error);
      }
    } else {
      // Load mock reviews for demo
      loadMockReviews();
    }
  }, []);

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    if (state.reviews.length > 0) {
      localStorage.setItem('evershop-reviews', JSON.stringify(state.reviews));
    }
  }, [state.reviews]);

  const loadMockReviews = () => {
    const mockReviews: Review[] = [
      {
        id: '1',
        productId: 'nike-react-infinity-run-flyknit',
        userId: 'user1',
        userName: 'Sarah Johnson',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        rating: 5,
        title: 'Amazing comfort for long runs!',
        content: 'I\'ve been running in these shoes for 3 months now and they\'re incredible. The cushioning is perfect and they\'ve helped reduce my knee pain significantly.',
        pros: ['Excellent cushioning', 'Durable', 'Great for long distances'],
        cons: ['A bit expensive'],
        verified: true,
        helpful: 12,
        unhelpful: 1,
        userHelpfulVote: null,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        productId: 'nike-react-infinity-run-flyknit',
        userId: 'user2',
        userName: 'Mike Chen',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
        rating: 4,
        title: 'Good shoe, runs a bit small',
        content: 'Overall very satisfied with the purchase. The only issue is that they run about half a size small, so order accordingly.',
        pros: ['Lightweight', 'Good support'],
        cons: ['Runs small', 'Limited color options'],
        verified: true,
        helpful: 8,
        unhelpful: 2,
        userHelpfulVote: null,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        id: '3',
        productId: 'nike-court-vision-low',
        userId: 'user3',
        userName: 'Emma Williams',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
        rating: 5,
        title: 'Love the retro style!',
        content: 'These shoes are perfect for casual wear. The retro basketball design is exactly what I was looking for and they\'re surprisingly comfortable.',
        pros: ['Stylish design', 'Comfortable', 'Good value'],
        cons: [],
        verified: true,
        helpful: 15,
        unhelpful: 0,
        userHelpfulVote: null,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25'),
      },
    ];

    dispatch({ type: 'LOAD_REVIEWS', payload: mockReviews });
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpful' | 'unhelpful' | 'userHelpfulVote'>) => {
    const review: Review = {
      ...reviewData,
      id: Math.random().toString(36).substr(2, 9),
      helpful: 0,
      unhelpful: 0,
      userHelpfulVote: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch({ type: 'ADD_REVIEW', payload: review });
  };

  const getProductReviews = (productId: string): Review[] => {
    return state.reviews.filter(review => review.productId === productId);
  };

  const getReviewSummary = (productId: string): ReviewSummary => {
    const productReviews = getProductReviews(productId);

    if (productReviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / productReviews.length;

    const ratingDistribution = productReviews.reduce((dist, review) => {
      dist[review.rating as keyof typeof dist]++;
      return dist;
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

    return {
      averageRating,
      totalReviews: productReviews.length,
      ratingDistribution,
    };
  };

  const voteHelpful = (reviewId: string, vote: 'helpful' | 'unhelpful') => {
    dispatch({ type: 'VOTE_HELPFUL', payload: { reviewId, vote } });
  };

  return (
    <ReviewsContext.Provider value={{
      reviews: state.reviews,
      addReview,
      getProductReviews,
      getReviewSummary,
      voteHelpful,
      isLoading: state.isLoading,
    }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
}
