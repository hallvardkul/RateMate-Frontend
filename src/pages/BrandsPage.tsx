import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { brands as brandsApi } from '../services/api'; // Use the existing brands SDK

interface PublicBrand {
  brand_id: number;
  brand_name: string;
  is_verified: boolean;
  website?: string; // Optional: if you want to display it
  // We might get more data like product count or average rating from the API.
  // For now, these are the core fields based on the schema.
}

// Define expected API response structure for brands list
interface GetPublicBrandsResponse {
  data: any; 
}

const BrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<PublicBrand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log('[BrandsPage] Fetching brands...');
    setLoading(true);
    brandsApi.getAll()
      .then((res: GetPublicBrandsResponse) => {
        console.log('[BrandsPage] API Response:', res);
        // Backend returns { brands: [...], pagination: {...} }
        const payload = (res as any)?.data;
        const rows = payload?.brands ?? payload ?? [];
        if (Array.isArray(rows)) {
          setBrands(rows);
          console.log('[BrandsPage] Brands set:', rows);
        } else {
          console.error('[BrandsPage] API response is not an array:', payload);
          setError('Received invalid data from server.');
          setBrands([]);
        }
      })
      .catch((err: any) => {
        console.error('[BrandsPage] API Error:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load brands');
      })
      .finally(() => {
        console.log('[BrandsPage] Fetch complete. Setting loading to false.');
        setLoading(false);
      });
  }, []);

  console.log('[BrandsPage] Rendering - Loading:', loading, 'Error:', error, 'Brands Count:', brands.length);

  if (loading) return <p className="p-8 text-center">Loading brands...</p>;
  if (error) return <p className="p-8 text-red-600 text-center">Error: {error}</p>;
  if (!brands || brands.length === 0) return <p className="p-8 text-center">No brands found.</p>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Explore Brands
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Discover a wide variety of brands on RateMate.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.brand_id}
            to={`/brands/${brand.brand_id}`}
            className="block p-6 border rounded-xl hover:shadow-lg transition-shadow duration-300 ease-in-out bg-white"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-800 truncate" title={brand.brand_name}>
                {brand.brand_name}
              </h2>
              {brand.is_verified && (
                <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                  Verified
                </span>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500"></p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrandsPage; 