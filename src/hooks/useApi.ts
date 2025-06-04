import { useState, useCallback } from 'react';
import { ApiResponse, ApiError } from '../types';

interface UseApiState<T> {
  data: T | undefined;
  error: ApiError | undefined;
  loading: boolean;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: undefined,
    error: undefined,
    loading: false,
  });

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    setState((prev) => ({ ...prev, loading: true, error: undefined }));
    try {
      const response = await apiCall();
      setState({
        data: response.data,
        error: response.error,
        loading: false,
      });
      return response;
    } catch (error) {
      const apiError: ApiError = {
        code: 500,
        message: 'An unexpected error occurred',
      };
      setState({
        data: undefined,
        error: apiError,
        loading: false,
      });
      return { data: undefined, error: apiError };
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: undefined,
      error: undefined,
      loading: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
} 