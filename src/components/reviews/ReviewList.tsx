import React from 'react';
import { Review } from '../../types';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { Pagination } from '../common/Pagination';

interface ReviewListProps {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ReviewList({ reviews, total, page, totalPages, onPageChange }: ReviewListProps) {
  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<StarIcon key={i} className="h-5 w-5 text-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<StarIcon key={i} className="h-5 w-5 text-yellow-400" />);
      } else {
        stars.push(<StarOutlineIcon key={i} className="h-5 w-5 text-yellow-400" />);
      }
    }
    return stars;
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{review.title}</h3>
                <div className="mt-1 flex items-center">
                  {renderRatingStars(review.rating)}
                  <p className="ml-2 text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500">{review.likes} likes</span>
              </div>
            </div>

            <div className="mt-4 text-gray-600">{review.content}</div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Category Ratings</h4>
              <div className="mt-2 space-y-2">
                {Object.entries(review.categoryRatings).map(([category, rating]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                    <div className="flex items-center">
                      {renderRatingStars(rating)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

export default ReviewList; 