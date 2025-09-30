'use client';

import React, { useState } from 'react';
import { useReviews } from '@/contexts/ReviewsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Star, ThumbsUp, ThumbsDown, Plus, X, Check } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { getProductReviews, getReviewSummary, addReview, voteHelpful } = useReviews();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    content: '',
    pros: [''],
    cons: [''],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviews = getProductReviews(productId);
  const summary = getReviewSummary(productId);

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'oldest':
        return a.createdAt.getTime() - b.createdAt.getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        onClick={() => interactive && onRate && onRate(i + 1)}
        disabled={!interactive}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} transition-transform ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      >
        <Star size={interactive ? 24 : 16} />
      </button>
    ));
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (!reviewForm.rating || !reviewForm.title || !reviewForm.content) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      addReview({
        productId,
        userId: user!.id,
        userName: `${user!.firstName} ${user!.lastName}`,
        userAvatar: user!.avatar,
        rating: reviewForm.rating,
        title: reviewForm.title,
        content: reviewForm.content,
        pros: reviewForm.pros.filter(pro => pro.trim()),
        cons: reviewForm.cons.filter(con => con.trim()),
        verified: true, // Mock verification
      });

      setShowReviewForm(false);
      setReviewForm({
        rating: 0,
        title: '',
        content: '',
        pros: [''],
        cons: [''],
      });
    } catch (error) {
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addProCon = (type: 'pros' | 'cons') => {
    setReviewForm(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const updateProCon = (type: 'pros' | 'cons', index: number, value: string) => {
    setReviewForm(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? value : item)
    }));
  };

  const removeProCon = (type: 'pros' | 'cons', index: number) => {
    setReviewForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  if (summary.totalReviews === 0 && !showReviewForm) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>
        <div className="text-center py-8">
          <Star size={48} className="mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-semibold mb-2">No reviews yet</h4>
          <p className="text-gray-600 mb-6">Be the first to share your thoughts about this product</p>
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Write a Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Customer Reviews</h3>
        <button
          onClick={() => setShowReviewForm(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Plus size={16} />
          Write Review
        </button>
      </div>

      {/* Rating Summary */}
      {summary.totalReviews > 0 && (
        <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{summary.averageRating.toFixed(1)}</div>
            <div className="flex justify-center mb-2">
              {renderStars(summary.averageRating)}
            </div>
            <div className="text-gray-600">Based on {summary.totalReviews} reviews</div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm">{rating}</span>
                  <Star size={12} className="text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${summary.totalReviews > 0
                        ? (summary.ratingDistribution[rating as keyof typeof summary.ratingDistribution] / summary.totalReviews) * 100
                        : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {summary.ratingDistribution[rating as keyof typeof summary.ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold">Write a Review</h4>
              <button
                onClick={() => setShowReviewForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex gap-1">
                  {renderStars(reviewForm.rating, true, (rating) =>
                    setReviewForm(prev => ({ ...prev, rating }))
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title *
                </label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Summary of your experience"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review *
                </label>
                <textarea
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your experience with this product"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Pros */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pros (Optional)
                </label>
                <div className="space-y-2">
                  {reviewForm.pros.map((pro, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={pro}
                        onChange={(e) => updateProCon('pros', index, e.target.value)}
                        placeholder="What did you like?"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {reviewForm.pros.length > 1 && (
                        <button
                          onClick={() => removeProCon('pros', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addProCon('pros')}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + Add another pro
                  </button>
                </div>
              </div>

              {/* Cons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cons (Optional)
                </label>
                <div className="space-y-2">
                  {reviewForm.cons.map((con, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={con}
                        onChange={(e) => updateProCon('cons', index, e.target.value)}
                        placeholder="What could be improved?"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {reviewForm.cons.length > 1 && (
                        <button
                          onClick={() => removeProCon('cons', index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addProCon('cons')}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + Add another con
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || !reviewForm.rating || !reviewForm.title || !reviewForm.content}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-semibold">Reviews ({reviews.length})</h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful')}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest rating</option>
              <option value="lowest">Lowest rating</option>
              <option value="helpful">Most helpful</option>
            </select>
          </div>

          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-start gap-4">
                  {review.userAvatar && (
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold">{review.userName}</span>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <Check size={14} />
                          Verified Purchase
                        </span>
                      )}
                      <span className="text-gray-500 text-sm">
                        {review.createdAt.toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span className="font-semibold">{review.title}</span>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

                    {(review.pros && review.pros.length > 0) && (
                      <div className="mb-3">
                        <h6 className="font-medium text-green-700 mb-1">Pros:</h6>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {review.pros.map((pro, index) => (
                            <li key={index}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(review.cons && review.cons.length > 0) && (
                      <div className="mb-3">
                        <h6 className="font-medium text-red-700 mb-1">Cons:</h6>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {review.cons.map((con, index) => (
                            <li key={index}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Was this helpful?</span>
                      <button
                        onClick={() => voteHelpful(review.id, 'helpful')}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${
                          review.userHelpfulVote === 'helpful'
                            ? 'bg-green-100 text-green-700'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <ThumbsUp size={14} />
                        <span>{review.helpful}</span>
                      </button>
                      <button
                        onClick={() => voteHelpful(review.id, 'unhelpful')}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${
                          review.userHelpfulVote === 'unhelpful'
                            ? 'bg-red-100 text-red-700'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <ThumbsDown size={14} />
                        <span>{review.unhelpful}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
