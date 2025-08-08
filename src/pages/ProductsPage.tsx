import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { ProductFilters } from '../components/products/ProductFilters';
import ProductGrid from '../components/products/ProductGrid';
import { Pagination } from '../components/common/Pagination';
import { SearchBar } from '../components/common/SearchBar';
import { useProducts } from '../hooks/useProducts';
import { ProductFilters as ProductFiltersType, Category, Brand } from '../types';
import { categories as categoriesApi, brands as brandsApi } from '../services/api';

export default function ProductsPage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filters, setFilters] = useState<ProductFiltersType>({});
  const [searchQuery, setSearchQuery] = useState('');

  const {
    products,
    total,
    page,
    totalPages,
    loading,
    error,
    fetchProducts,
    setPage,
  } = useProducts();

  // Fetch categories and brands once on mount
  useEffect(() => {
    const fetchMeta = async () => {
      const [categoriesResponse, brandsResponse] = await Promise.all([
        categoriesApi.getAll(),
        brandsApi.getAll(),
      ]);

      // Transform categories: backend returns { categories: [{ category: 'smartphone', product_count: 10 }, ...] }
      const catRows = categoriesResponse.data?.categories ?? categoriesResponse.data ?? [];
      const mappedCategories = (Array.isArray(catRows) ? catRows : []).map((c: any, idx: number) => ({
        id: c.category ?? idx.toString(),
        name: c.category ?? String(c),
      }));

      // Transform brands: backend returns { brands: [{ brand_id, brand_name, ...}, ...], pagination }
      const brandRows = brandsResponse.data?.brands ?? brandsResponse.data ?? [];
      const mappedBrands = (Array.isArray(brandRows) ? brandRows : []).map((b: any) => ({
        id: String(b.brand_id ?? b.id ?? ''),
        name: b.brand_name ?? b.name ?? '',
      }));

      setCategories(mappedCategories as any);
      setBrands(mappedBrands as any);
    };

    fetchMeta();
  }, []);

  // Memoised filters object passed to hook
  const debouncedSearch = useDebounce(searchQuery, 400);
  const combinedFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  );

  // Trigger product fetch when filters/search/page change
  useEffect(() => {
    fetchProducts(page, combinedFilters as any);
  }, [page, combinedFilters, fetchProducts]);

  const handleFilterChange = (newFilters: ProductFiltersType) => {
    setFilters(newFilters);
    setIsFiltersOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error.message}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Products</h1>
            <p className="mt-1 text-sm text-slate-600">Discover and review products from top brands.</p>
          </div>
          <div className="flex items-center gap-4">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search products..."
              className="w-full sm:w-96"
            />
            <button
              type="button"
              onClick={() => setIsFiltersOpen(true)}
              className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <FunnelIcon className="mr-2 h-5 w-5 text-slate-400" aria-hidden="true" />
              Filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <ProductGrid products={products} />
            </div>

            {total > 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          categories={categories}
          brands={brands}
        />
      </div>
    </div>
  );
} 