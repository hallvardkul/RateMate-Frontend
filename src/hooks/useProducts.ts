import { useEffect, useState, useCallback } from 'react';
import { products as productsApi } from '../services/api';
import { ProductWithStats as Product, ProductsResponse } from '../types/Product';

export type ProductFilters = { brandId?: number; categoryId?: number; search?: string };

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async (overridePage?: number, overrideFilters?: ProductFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: overridePage ?? page,
        limit: 20,
        ...filters,
        ...overrideFilters,
      };
      const response = await productsApi.getAll(params.page, 20);
      const data = response.data as ProductsResponse | Product[];

      if (Array.isArray(data)) {
        setProducts(data as Product[]);
        setTotal(data.length);
        setTotalPages(1);
      } else {
        setProducts(data.products || []);
        setTotal(data.total || (data.products?.length ?? 0));
        setTotalPages((data as any).totalPages || 1);
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchProducts();
  }, [page, filters, fetchProducts]);

  return {
    products,
    total,
    page,
    totalPages,
    loading,
    error,
    fetchProducts,
    setPage,
    setFilters,
  };
} 