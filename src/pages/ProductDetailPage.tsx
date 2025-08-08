import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductDetail } from '../components/products/ProductDetail';
import { ReviewList } from '../components/reviews/ReviewList';
import { ReviewForm } from '../components/reviews/ReviewForm';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { Review, Product } from '../types';
import RatingOverviewCard from '../components/ratings/RatingOverviewCard';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [productLoading, setProductLoading] = useState<boolean>(true);
  const [productError, setProductError] = useState<Error | null>(null);

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
    if (!id) return;
    setProductLoading(true);
    setProductError(null);

    // Fetch single product from public endpoint and map to UI Product type
    api
      .get(`/public/products/${id}`)
      .then((res) => {
        const p = res.data.product as any;
        const mapped: Product = {
          id: String(p.product_id),
          name: p.product_name,
          description: p.description,
          price: 0,
          brandId: String(p.brand_id ?? ''),
          subcategoryId: String(p.subcategory_id ?? ''),
          averageRating: Number(p.average_rating || 0),
          totalReviews: Number(p.total_reviews || 0),
          categoryRatings: {
            value_for_money: 0,
            build_quality: 0,
            performance: 0,
            design: 0,
            reliability: 0,
          },
          createdAt: '',
          updatedAt: '',
        };
        setProduct(mapped);
      })
      .catch((e) => setProductError(e))
      .finally(() => setProductLoading(false));

    fetchReviews(id);
  }, [id]);

  const handleReviewSubmit = async (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (id) {
      await addReview(review);
      fetchReviews(id);
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen py-12">
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
      <div className="min-h-screen py-12">
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
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductDetail product={product} />

        <div className="mt-12">
          <RatingOverviewCard productId={id!} />
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Reviews</h2>
            {user && (
              <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-lg font-medium text-slate-900">Write a Review</h3>
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