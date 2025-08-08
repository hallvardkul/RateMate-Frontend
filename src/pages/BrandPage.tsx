import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { brands as brandsApi } from '../services/api';
import { getProductMedia } from '../services/media';
import { StarIcon as SolidStar } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStar } from '@heroicons/react/24/outline';

interface BrandSummary {
  brand_id: number;
  brand_name: string;
  is_verified: boolean;
  created_at: string;
  total_products: number;
  total_reviews: number;
  average_rating: string | number;
}

interface BrandProductRow {
  product_id: number;
  product_name: string;
  description?: string;
  product_category?: string;
  review_count: number | string;
  average_rating: number | string;
}

interface BrandResponsePayload {
  brand: BrandSummary;
  products: BrandProductRow[];
}

const BrandPage: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const [brand, setBrand] = useState<BrandSummary | null>(null);
  const [products, setProducts] = useState<BrandProductRow[]>([]);
  const [thumbByProductId, setThumbByProductId] = useState<Record<number, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helpers
  const renderStars = (ratingNum: number) => {
    const rating = Math.max(0, Math.min(5, ratingNum / 2)); // convert /10 to /5 stars visually
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0; // using full star for half as design has no half icon currently
    return (
      <div className="flex items-center" aria-label={`rating-${ratingNum}`}>
        {Array.from({ length: 5 }, (_, i) => {
          const index = i + 1;
          if (index <= full + half) {
            return <SolidStar key={index} className="h-5 w-5 text-yellow-400" />;
          }
          return <OutlineStar key={index} className="h-5 w-5 text-yellow-400" />;
        })}
      </div>
    );
  };

  useEffect(() => {
    const load = async () => {
      if (!brandId) return;
      try {
        setLoading(true);
        const res = await brandsApi.getById(brandId);
        const payload: BrandResponsePayload = res.data?.brand ? res.data : res.data ?? res;
        if (!payload || !payload.brand) throw new Error('Brand not found');
        setBrand(payload.brand);
        setProducts(Array.isArray(payload.products) ? payload.products : []);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Failed to load brand');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [brandId]);

  // Fetch thumbnails for each product
  useEffect(() => {
    const fetchThumbs = async () => {
      if (!products || products.length === 0) return;
      const entries = await Promise.all(
        products.map(async (p) => {
          try {
            const res = await getProductMedia(p.product_id);
            const media = res.data?.media ?? res.data ?? [];
            const firstUrl: string | null = Array.isArray(media) && media.length > 0 ? media[0].file_url : null;
            return [p.product_id, firstUrl] as const;
          } catch {
            return [p.product_id, null] as const;
          }
        })
      );
      const map: Record<number, string | null> = {};
      for (const [id, url] of entries) map[id] = url;
      setThumbByProductId(map);
    };
    fetchThumbs();
  }, [products]);

  const averageOutOfTen = useMemo(() => {
    if (!brand) return null;
    const n = typeof brand.average_rating === 'string' ? parseFloat(brand.average_rating) : brand.average_rating;
    return isNaN(n) ? null : n;
  }, [brand]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <h2 className="text-xl font-semibold">Error Loading Brand</h2>
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.history.back()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-600">Brand not found</h2>
        <button 
          onClick={() => window.history.back()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Brand header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{brand.brand_name}</h1>
              {brand.is_verified && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">Member since {new Date(brand.created_at).toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-3 divide-x rounded-lg overflow-hidden border">
            <div className="px-4 py-2 text-center">
              <div className="text-xs uppercase text-gray-500">Products</div>
              <div className="text-lg font-semibold">{brand.total_products}</div>
            </div>
            <div className="px-4 py-2 text-center">
              <div className="text-xs uppercase text-gray-500">Reviews</div>
              <div className="text-lg font-semibold">{brand.total_reviews}</div>
            </div>
            <div className="px-4 py-2 text-center">
              <div className="text-xs uppercase text-gray-500">Avg. Rating</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg font-semibold">{averageOutOfTen ?? '—'}</span>
                {averageOutOfTen !== null && renderStars(averageOutOfTen)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Products by {brand.brand_name}</h2>
        {products.length === 0 ? (
          <div className="text-gray-500 text-center py-16 bg-white border rounded-lg">No products yet</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => {
              const avg = typeof p.average_rating === 'string' ? parseFloat(p.average_rating) : p.average_rating;
              const img = thumbByProductId[p.product_id] ?? null;
              return (
                <Link key={p.product_id} to={`/products/${p.product_id}/dashboard`} className="group">
                  <div className="bg-white border rounded-lg overflow-hidden shadow-sm transition hover:shadow-md">
                    <div className="aspect-w-1 aspect-h-1 w-full bg-gray-100">
                      {img ? (
                        <img src={img} alt={p.product_name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">No image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{p.product_name}</h3>
                      {p.description && (
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{p.description}</p>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center">
                          {renderStars(Number(avg || 0))}
                        </div>
                        <span className="text-xs text-gray-500">{p.review_count} reviews</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage; 