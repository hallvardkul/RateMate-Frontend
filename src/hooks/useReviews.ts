import { useState, useCallback } from 'react';
import { reviews as reviewsApi, comments as commentsApi } from '../services/api';
import { Review, Comment, PaginatedResponse } from '../types';
import { useApi } from './useApi';

interface UseReviewsState {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useReviews() {
  const [state, setState] = useState<UseReviewsState>({
    reviews: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  const { execute: getReviews, loading, error } = useApi<PaginatedResponse<Review>>();
  const { execute: createReview } = useApi<Review>();

  const fetchReviews = useCallback(async (productId: string, page: number = 1) => {
    const response = await getReviews(() => reviewsApi.getAll(productId, page, state.limit));
    if (response.data) {
      const { items, total, page: currentPage, totalPages } = response.data;
      const validReviews: Review[] = (items || []).filter((r): r is Review => Boolean(r));
      setState((prev) => ({
        ...prev,
        reviews: validReviews,
        total,
        page: currentPage,
        totalPages,
      }));
    }
    return response;
  }, [getReviews, state.limit]);

  const addReview = useCallback(async (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await createReview(() => reviewsApi.create(review));
    if (response.data) {
      setState((prev) => ({
        ...prev,
        reviews: [response.data as Review, ...prev.reviews],
        total: prev.total + 1,
      }));
    }
    return response;
  }, [createReview]);

  const setPage = useCallback((page: number) => {
    fetchReviews(state.reviews[0]?.productId || '', page);
  }, [fetchReviews, state.reviews]);

  return {
    ...state,
    loading,
    error,
    fetchReviews,
    addReview,
    setPage,
  };
}

interface UseCommentsState {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useComments() {
  const [state, setState] = useState<UseCommentsState>({
    comments: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  const { execute: getComments, loading, error } = useApi<PaginatedResponse<Comment>>();
  const { execute: createComment } = useApi<Comment>();

  const fetchComments = useCallback(async (reviewId: string, page: number = 1) => {
    const response = await getComments(() => commentsApi.getAll(reviewId, page, state.limit));
    if (response.data) {
      const { items, total, page: currentPage, totalPages } = response.data;
      const validComments: Comment[] = (items || []).filter((c): c is Comment => Boolean(c));
      setState((prev) => ({
        ...prev,
        comments: validComments,
        total,
        page: currentPage,
        totalPages,
      }));
    }
    return response;
  }, [getComments, state.limit]);

  const addComment = useCallback(async (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await createComment(() => commentsApi.create(comment));
    if (response.data) {
      setState((prev) => ({
        ...prev,
        comments: [response.data as Comment, ...prev.comments],
        total: prev.total + 1,
      }));
    }
    return response;
  }, [createComment]);

  const setPage = useCallback((page: number) => {
    fetchComments(state.comments[0]?.reviewId || '', page);
  }, [fetchComments, state.comments]);

  return {
    ...state,
    loading,
    error,
    fetchComments,
    addComment,
    setPage,
  };
} 