import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { reviews as reviewsApi, dashboard as dashboardApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import RatingBar from '../shared/RatingBar';

interface RatingCategory {
  category_id: number;
  category_name: string;
  description: string;
  is_active: boolean;
}

interface ProductCategoryStat {
  category: string;
  average_score: string | number;
  rating_count: number;
}

interface Props {
  productId: string;
}

export default function RatingOverviewCard({ productId }: Props) {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState<RatingCategory[]>([]);
  const [stats, setStats] = useState<ProductCategoryStat[]>([]);
  const [overallAvg, setOverallAvg] = useState<number>(0);
  const [overallCount, setOverallCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedScore, setSelectedScore] = useState<number>(0);

  // Review form state
  const [overallRating, setOverallRating] = useState<number>(10);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [catsRes, dashRes] = await Promise.all([
          reviewsApi.getCategories(),
          dashboardApi.getProduct(productId),
        ]);
        if (!mounted) return;
        setCategories((catsRes.data || []) as RatingCategory[]);
        const categoryStats = (dashRes.data?.category_ratings || []) as ProductCategoryStat[];
        setStats(categoryStats);
        const rs = dashRes.data?.rating_statistics;
        if (rs) {
          setOverallAvg(Number(rs.average_rating || 0));
          setOverallCount(Number(rs.total_reviews || 0));
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(e.response?.data?.error || e.message || 'Failed to load ratings');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (productId) load();
    return () => {
      mounted = false;
    };
  }, [productId]);

  const statsByCategory = useMemo(() => {
    const map = new Map<string, ProductCategoryStat>();
    stats.forEach((s) => map.set(s.category, s));
    return map;
  }, [stats]);

  const openModalFor = (category: string | null, score: number) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setSelectedCategory(category);
    setSelectedScore(score);
    // If rating overall directly, prefill overallRating with chosen score
    setOverallRating(category ? overallRating : score);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const payload: any = {
        product_id: Number(productId),
        title,
        content,
        rating: overallRating,
      };
      if (selectedCategory) {
        payload.category_ratings = { [selectedCategory]: selectedScore };
      }
      await reviewsApi.create(payload);
      setIsModalOpen(false);
      setTitle('');
      setContent('');
      setOverallRating(10);
      setSelectedCategory(null);
      setSelectedScore(0);
      // Refresh stats after submission
      const dashRes = await dashboardApi.getProduct(productId);
      const categoryStats = (dashRes.data?.category_ratings || []) as ProductCategoryStat[];
      setStats(categoryStats);
      const rs = dashRes.data?.rating_statistics;
      if (rs) {
        setOverallAvg(Number(rs.average_rating || 0));
        setOverallCount(Number(rs.total_reviews || 0));
      }
    } catch (e: any) {
      alert(e.response?.data?.error || e.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">Loading ratings…</div>
    );
  }
  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 ring-1 ring-red-200 text-red-700">{error}</div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Ratings Overview</h3>
        {!isAuthenticated && (
          <span className="text-sm text-slate-500">Sign in to rate</span>
        )}
      </div>

      {/* Overall rating row */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">Overall rating</p>
            <p className="text-xs text-slate-500">{overallCount} reviews • avg {overallAvg.toFixed(1)}/10</p>
          </div>
          <div>
            <RatingBar rating={overallAvg} max={10} onChange={(v) => openModalFor(null, v)} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => {
          const stat = statsByCategory.get(cat.category_name);
          const avg = stat ? Number(stat.average_score) : 0;
          const count = stat?.rating_count || 0;
          return (
            <div key={cat.category_id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {cat.category_name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </p>
                  <p className="text-xs text-slate-500">{count} ratings • avg {avg.toFixed ? avg.toFixed(1) : avg}/10</p>
                </div>
                <div>
                  <RatingBar rating={avg} max={10} onChange={(v) => openModalFor(cat.category_name, v)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
            <h4 className="text-lg font-semibold mb-4">
              {selectedCategory ? `Rate ${selectedCategory.split('_').join(' ')}` : 'Rate this product'}
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Overall rating</label>
                <RatingBar rating={overallRating} max={10} onChange={setOverallRating} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Summarize your experience"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Review</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  rows={4}
                  placeholder="Share details (pros, cons, usage)"
                />
              </div>

              {selectedCategory && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{selectedCategory.split('_').join(' ')} rating</label>
                  <RatingBar rating={selectedScore} max={10} onChange={setSelectedScore} />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md border border-slate-300 px-4 py-2 text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !title || !content || overallRating < 1}
                className="rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 disabled:opacity-50"
              >
                {submitting ? 'Submitting…' : 'Submit review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 