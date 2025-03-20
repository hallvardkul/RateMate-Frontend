import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  ApiError,
  ApiResponse,
  AuthResponse,
  Category,
  Comment,
  LoginCredentials,
  PaginatedResponse,
  Product,
  ProductFilters,
  RegisterCredentials,
  Review,
  Subcategory,
  User,
  Brand,
} from '../types';

interface ErrorResponse {
  message: string;
  details?: string;
}

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7073/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private handleError(error: AxiosError<ErrorResponse>): ApiError {
    return {
      code: error.response?.status || 500,
      message: error.response?.data?.message || 'An unexpected error occurred',
      details: error.response?.data?.details,
    };
  }

  // Auth Services
  public async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      return { data: response.data };
    } catch (error) {
      return { data: undefined, error: this.handleError(error as AxiosError<ErrorResponse>) };
    }
  }

  public async register(credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/register', credentials);
      localStorage.setItem('token', response.data.token);
      return { data: response.data };
    } catch (error) {
      return { data: undefined, error: this.handleError(error as AxiosError<ErrorResponse>) };
    }
  }

  public logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  // Product Services
  public async getProducts(
    page: number = 1,
    limit: number = 20,
    filters?: ProductFilters
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    try {
      const response = await this.api.get<PaginatedResponse<Product>>('/products', {
        params: { page, limit, ...filters },
      });
      return { data: response.data };
    } catch (error) {
      return { data: undefined, error: this.handleError(error as AxiosError<ErrorResponse>) };
    }
  }

  public async getProduct(id: string): Promise<ApiResponse<Product>> {
    try {
      const response = await this.api.get<Product>(`/products/${id}`);
      return { data: response.data };
    } catch (error) {
      return { data: undefined, error: this.handleError(error as AxiosError<ErrorResponse>) };
    }
  }

  // Category Services
  public async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const response = await this.api.get<Category[]>('/categories');
      return { data: response.data };
    } catch (error) {
      return { data: undefined, error: this.handleError(error as AxiosError<ErrorResponse>) };
    }
  }

  public async getSubcategories(): Promise<ApiResponse<Subcategory[]>> {
    try {
      const response = await this.api.get<Subcategory[]>('/subcategories');
      return { data: response.data };
    } catch (error) {
      return { data: undefined, error: this.handleError(error as AxiosError<ErrorResponse>) };
    }
  }

  // Review Services
  public async getReviews(
    productId?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Review>>> {
    try {
      const response = await this.api.get<PaginatedResponse<Review>>('/reviews', {
        params: { productId, page, limit },
      });
      return { data: response.data };
    } catch (error) {
      return { data: undefined, error: this.handleError(error as AxiosError<ErrorResponse>) };
    }
  }

  public async createReview(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Review>> {
    try {
      const response = await this.api.post<Review>('/reviews', review);
      return { data: response.data };
    } catch (error) {
      return { data: undefined, error: this.handleError(error as AxiosError<ErrorResponse>) };
    }
  }

  // Comment Services
  public async getComments(
    reviewId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Comment>>> {
    try {
      const response = await this.api.get<PaginatedResponse<Comment>>('/comments', {
        params: { reviewId, page, limit },
      });
      return { data: response.data };
    } catch (error) {
      return { data: undefined, error: this.handleError(error as AxiosError<ErrorResponse>) };
    }
  }

  public async createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Comment>> {
    try {
      const response = await this.api.post<Comment>('/comments', comment);
      return { data: response.data };
    } catch (error) {
      return { data: undefined, error: this.handleError(error as AxiosError<ErrorResponse>) };
    }
  }

  // User Services
  public async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.get<User>('/users/me');
      return { data: response.data };
    } catch (error) {
      return { data: undefined, error: this.handleError(error as AxiosError<ErrorResponse>) };
    }
  }

  public async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.patch<User>(`/users/${id}`, userData);
      return { data: response.data };
    } catch (error) {
      return { data: undefined, error: this.handleError(error as AxiosError<ErrorResponse>) };
    }
  }

  // Brand Services
  public async getBrands(): Promise<ApiResponse<Brand[]>> {
    try {
      const response = await this.api.get<Brand[]>('/brands');
      return { data: response.data };
    } catch (error) {
      return { data: undefined, error: this.handleError(error as AxiosError<ErrorResponse>) };
    }
  }
}

export const api = ApiService.getInstance(); 