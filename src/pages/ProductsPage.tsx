import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { ProductFilters } from '../components/products/ProductFilters';
import ProductGrid from '../components/products/ProductGrid';
import { Pagination } from '../components/common/Pagination';
import { SearchBar } from '../components/common/SearchBar';
import { useProducts } from '../hooks/useProducts';
import { ProductFilters as ProductFiltersType } from '../types';
import { categories as categoriesApi, brands as brandsApi } from '../services/api';
import { Category, Brand } from '../types';

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
    setFilters: setProductFilters,
  } = useProducts();

  // Fetch categories and brands once on mount
  useEffect(() => {
    const fetchMeta = async () => {
      const [categoriesResponse, brandsResponse] = await Promise.all([
        categoriesApi.getAll(),
        brandsApi.getAll(),
      ]);

      if (categoriesResponse.data) setCategories(categoriesResponse.data);
      if (brandsResponse.data) setBrands(brandsResponse.data);
    };

    fetchMeta();
  }, []);

  // Memoised filters object passed to hook
  const debouncedSearch = useDebounce(searchQuery, 400);
  const combinedFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  );

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
      <div className="min-h-screen bg-gray-50 py-12">
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <div className="flex items-center gap-4">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search products..."
              className="w-full sm:w-96"
            />
            <button
              type="button"
              onClick={() => setIsFiltersOpen(true)}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <FunnelIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
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
            <div className="mt-8">
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