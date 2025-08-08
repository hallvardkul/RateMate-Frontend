import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MediaGallery from '../components/products/MediaGallery';
import { useProductMedia } from '../hooks/useProductMedia';
import { useAuth } from '../hooks/useAuth';
import { dashboard } from '../services/api';
import RatingOverviewCard from '../components/ratings/RatingOverviewCard';

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
    comments: Array<{ comment_id?: number; content: string; username?: string; created_at?: string }>;
  }>;
}

export default function ProductDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { media, loading: mediaLoading } = useProductMedia(id || '');
  const { user } = useAuth();

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [quickContent, setQuickContent] = useState<string>('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    dashboard.getProduct(id)
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const refreshDashboard = async () => {
    if (!id) return;
    const res = await dashboard.getProduct(id);
    setData(res.data);
  };

  const handleQuickPost = async () => {
    if (!id) return;
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const titleFromContent = quickContent.trim().split('\n')[0].slice(0, 80) || 'Review';
    try {
      await dashboard.submitReview(id, {
        product_id: Number(id),
        title: titleFromContent,
        content: quickContent,
        rating: 10,
      });
      setQuickContent('');
      await refreshDashboard();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleReplyToggle = (reviewId: number) => {
    setReplyingTo(prev => (prev === reviewId ? null : reviewId));
  };

  const handlePostComment = async (reviewId: number) => {
    if (!id) return;
    const content = (replyTexts[reviewId] || '').trim();
    if (!content) return;

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      await dashboard.submitComment(reviewId, { content });
      setReplyTexts(prev => ({ ...prev, [reviewId]: '' }));
      setReplyingTo(null);
      await refreshDashboard();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <p>Loading product dashboard…</p>;
  if (error) return <p className="p-8 text-red-600">Error: {error}</p>;
  if (!data) return <p className="p-8">No data available.</p>;

  const { product, reviews } = data;

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12">
      <h1 className="text-3xl font-bold">{product.product_name}</h1>
      {mediaLoading ? <p>Loading media…</p> : <MediaGallery media={media} />}
      <p className="mt-6">{product.description}</p>

      {/* Interactive ratings overview (overall + category bars) */}
      <RatingOverviewCard productId={id!} />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Reviews</h2>

        {/* Quick review box – always shown */}
        <div className="p-4 border rounded-md bg-white">
          <label className="block text-sm font-medium text-slate-700 mb-2">Write a review</label>
          <textarea
            value={quickContent}
            onChange={(e) => setQuickContent(e.target.value)}
            rows={4}
            placeholder={user ? 'Share your experience with this product…' : 'Sign in is required to post. You can still write your review here.'}
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleQuickPost}
              disabled={!quickContent.trim()}
              className="rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 disabled:opacity-50"
            >
              Post review
            </button>
          </div>
        </div>

        {reviews.length === 0 && <p>No reviews yet. Be the first to review this product!</p>}
        {reviews.map(r => (
          <div key={r.review_id} className="p-4 border rounded-md space-y-3 bg-white">
            <div>
              <h4 className="font-semibold">{r.title} — {r.rating}/10</h4>
              <p className="text-sm text-slate-600">by {r.username}</p>
              <p className="mt-2">{r.content}</p>
            </div>

            {/* Existing comments (if any) */}
            {r.comments && r.comments.length > 0 && (
              <div className="mt-2 space-y-2 border-t pt-2">
                {r.comments.map((c, idx) => (
                  <div key={c.comment_id ?? idx} className="text-sm text-slate-700">
                    <span className="font-medium mr-2">{c.username ?? 'User'}:</span>
                    <span>{c.content}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Reply controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleReplyToggle(r.review_id)}
                className="text-sm text-slate-700 hover:text-slate-900"
              >
                {replyingTo === r.review_id ? 'Cancel' : 'Reply'}
              </button>
            </div>

            {replyingTo === r.review_id && (
              <div className="mt-2">
                <textarea
                  value={replyTexts[r.review_id] || ''}
                  onChange={(e) => setReplyTexts(prev => ({ ...prev, [r.review_id]: e.target.value }))}
                  rows={3}
                  placeholder={user ? 'Write your comment…' : 'Sign in is required to comment.'}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handlePostComment(r.review_id)}
                    disabled={!((replyTexts[r.review_id] || '').trim())}
                    className="rounded-md bg-amber-500 px-3 py-1.5 text-white hover:bg-amber-600 disabled:opacity-50"
                  >
                    Post comment
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
} 