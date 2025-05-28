import { useEffect, useState } from 'react';
import { getProductMedia } from '../services/media';

export interface ProductMedia {
  media_id: number;
  file_url: string;
  file_type: string;
  uploaded_at: string;
}

export function useProductMedia(productId?: string | number) {
  const [media, setMedia] = useState<ProductMedia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    getProductMedia(productId)
      .then(res => setMedia(res.data.media))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [productId]);

  return { media, loading, error };
} 