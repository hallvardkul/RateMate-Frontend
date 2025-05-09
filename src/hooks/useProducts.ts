import { useEffect, useState } from 'react';
import api from '../services/api';
import { Product } from '../types/Product';

export type ProductFilters = { brandId?: number; categoryId?: number };

export function useProducts(
  page: number = 1,
  limit: number = 20,
  filters?: ProductFilters
) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const filtersString = JSON.stringify(filters);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get<Product[]>('/products', { params: { page, limit, ...filters } })
      .then((r) => alive && setData(r.data))
      .catch((e) => alive && setError(e))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [page, limit, filtersString]);

  return { data, loading, error };
} 