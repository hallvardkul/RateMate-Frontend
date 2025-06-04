import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProductDetail } from '../components/products/ProductDetail';
import { ReviewList } from '../components/reviews/ReviewList';
import { ReviewForm } from '../components/reviews/ReviewForm';
import { useProducts } from '../hooks/useProducts';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { Review } from '../types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { product, loading: productLoading, error: productError, fetchProduct } = useProducts();
  const {
    reviews,
    total: totalReviews,
    page: reviewPage,
    totalPages: reviewTotalPages,
    loading: reviewsLoading,
    error: reviewsError,
    fetchReviews,
    addReview,
    setPage: setReviewPage,
  } = useReviews();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
      fetchReviews(id);
    }
  }, [id]);

  const handleReviewSubmit = async (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (id) {
      await addReview(review);
      fetchReviews(id);
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading product</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{productError?.message || 'Product not found'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductDetail product={product} />

        <div className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
            {user && (
              <div className="rounded-md bg-white p-6 shadow">
                <h3 className="text-lg font-medium text-gray-900">Write a Review</h3>
                <div className="mt-4">
                  <ReviewForm productId={product.id} onSubmit={handleReviewSubmit} />
                </div>
              </div>
            )}
          </div>

          {reviewsLoading ? (
            <div className="mt-8 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
          ) : reviewsError ? (
            <div className="mt-8 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading reviews</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{reviewsError.message}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <ReviewList
                reviews={reviews}
                total={totalReviews}
                page={reviewPage}
                totalPages={reviewTotalPages}
                onPageChange={setReviewPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 