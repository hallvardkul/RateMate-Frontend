import { useState, useCallback } from 'react';
import { api } from '../services/api';
import { Product, ProductFilters, PaginatedResponse } from '../types';
import { useApi } from './useApi';

interface UseProductsState {
  products: Product[];
  product: Product | undefined;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: ProductFilters;
}

export function useProducts() {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    product: undefined,
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    filters: {},
  });

  const { execute: getProducts, loading, error } = useApi<PaginatedResponse<Product>>();
  const { execute: getProduct } = useApi<Product>();

  const fetchProducts = useCallback(async (page: number = 1, filters: ProductFilters = {}) => {
    const response = await getProducts(() => api.getProducts(page, state.limit, filters));
    if (response.data) {
      const { items, total, page: currentPage, totalPages } = response.data;
      const validProducts = items.filter((product): product is Product => product !== undefined);
      setState((prev) => ({
        ...prev,
        products: validProducts,
        total,
        page: currentPage,
        totalPages,
        filters,
      }));
    }
    return response;
  }, [getProducts, state.limit]);

  const fetchProduct = useCallback(async (id: string) => {
    const response = await getProduct(() => api.getProduct(id));
    if (response.data) {
      setState((prev) => ({
        ...prev,
        product: response.data,
      }));
    }
    return response;
  }, [getProduct]);

  const setPage = useCallback((page: number) => {
    fetchProducts(page, state.filters);
  }, [fetchProducts, state.filters]);

  const setFilters = useCallback((filters: ProductFilters) => {
    fetchProducts(1, filters);
  }, [fetchProducts]);

  const setLimit = useCallback((limit: number) => {
    setState((prev) => ({ ...prev, limit }));
    fetchProducts(1, state.filters);
  }, [fetchProducts, state.filters]);

  return {
    ...state,
    loading,
    error,
    fetchProducts,
    fetchProduct,
    setPage,
    setFilters,
    setLimit,
  };
} 