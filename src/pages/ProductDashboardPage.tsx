import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MediaGallery from '../components/products/MediaGallery';
import { useProductMedia } from '../hooks/useProductMedia';
import { useAuth } from '../hooks/useAuth';
import { dashboard } from '../services/api';

interface DashboardResponse {
  product: {
    product_id: number;
    product_name: string;
    description: string;
    product_category: string;
  };
  rating_statistics: {
    average_rating: string;
    total_reviews: number;
  };
  category_ratings: {
    category: string;
    average_score: string;
    rating_count: number;
  }[];
  reviews: Array<{
    review_id: number;
    title: string;
    content: string;
    rating: number;
    username: string;
    user_verified: boolean;
    category_ratings: { category: string; score: number; created_at?: string }[];
    comments: any[];
  }>;
}

export default function ProductDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const { media, loading: mediaLoading } = useProductMedia(id || '');
  const { user } = useAuth();

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    dashboard.getProduct(id)
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmitReview = async () => {
    if (!id) return;
    try {
      await dashboard.submitReview(id, { product_id: Number(id), title, content, rating });
      const res = await dashboard.getProduct(id);
      setData(res.data);
      setTitle('');
      setContent('');
      setRating(5);
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <p>Loading product dashboard…</p>;
  if (error) return <p className="p-8 text-red-600">Error: {error}</p>;
  if (!data) return <p className="p-8">No data available.</p>;

  const { product, rating_statistics, category_ratings, reviews } = data;

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12">
      <h1 className="text-3xl font-bold">{product.product_name}</h1>
      {mediaLoading ? <p>Loading media…</p> : <MediaGallery media={media} />}
      <p className="mt-6">{product.description}</p>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Overall Rating</h2>
        <p>
          {rating_statistics.average_rating} / 10 ({rating_statistics.total_reviews} reviews)
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Category Ratings</h2>
        <ul>
          {category_ratings.map(cr => (
            <li key={cr.category}>
              {cr.category}: {cr.average_score} / 10 ({cr.rating_count})
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        {user !== undefined && (
          <div className="space-y-2 p-4 border rounded-md">
            <h3>Your Review</h3>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <label className="flex items-center space-x-2">
              <span>Rating:</span>
              <input
                type="range"
                min={1}
                max={10}
                value={rating}
                onChange={e => setRating(Number(e.target.value))}
              />
              <span>{rating}</span>
            </label>
            <button
              onClick={handleSubmitReview}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Submit Review
            </button>
          </div>
        )}
        {reviews.length === 0 && <p>No reviews yet. Be the first to review this product!</p>}
        {reviews.map(r => (
          <div key={r.review_id} className="p-4 border rounded-md space-y-2">
            <h4 className="font-semibold">{r.title} — {r.rating}/10</h4>
            <p>by {r.username}</p>
            <p>{r.content}</p>
          </div>
        ))}
      </section>
    </div>
  );
} 