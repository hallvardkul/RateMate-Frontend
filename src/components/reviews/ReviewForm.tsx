import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { Review } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface ReviewFormProps {
  productId: string;
  onSubmit: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export function ReviewForm({ productId, onSubmit }: ReviewFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [categoryRatings, setCategoryRatings] = useState({
    value_for_money: 5,
    build_quality: 5,
    performance: 5,
    design: 5,
    reliability: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        productId,
        userId: user.user_id,
        title,
        content,
        rating,
        categoryRatings,
        likes: 0,
      });

      // Reset form
      setTitle('');
      setContent('');
      setRating(5);
      setCategoryRatings({
        value_for_money: 5,
        build_quality: 5,
        performance: 5,
        design: 5,
        reliability: 5,
      });
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRatingStars = (value: number, onChange: (value: number) => void) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="focus:outline-none"
        >
          {i <= value ? (
            <StarIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <StarOutlineIcon className="h-6 w-6 text-yellow-400" />
          )}
        </button>
      );
    }
    return stars;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Review
        </label>
        <textarea
          id="content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Overall Rating</label>
        <div className="mt-1 flex items-center">
          {renderRatingStars(rating, setRating)}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category Ratings</label>
        <div className="mt-4 space-y-4">
          {Object.entries(categoryRatings).map(([category, value]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
              <div className="flex items-center">
                {renderRatingStars(value, (newValue) =>
                  setCategoryRatings((prev) => ({ ...prev, [category]: newValue }))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
} 