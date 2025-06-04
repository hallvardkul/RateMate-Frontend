export interface User {
  user_id: number;
  username: string;
  email: string;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brandId: string;
  subcategoryId: string;
  imageUrl?: string;
  averageRating: number;
  totalReviews: number;
  categoryRatings: {
    value_for_money: number;
    build_quality: number;
    performance: number;
    design: number;
    reliability: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: number;
  rating: number;
  title: string;
  content: string;
  categoryRatings: {
    value_for_money: number;
    build_quality: number;
    performance: number;
    design: number;
    reliability: number;
  };
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  reviewId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
}

export interface ProductFilters {
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  items: (T | undefined)[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  code: number;
  message: string;
  details?: string;
}

export interface ApiResponse<T> {
  data: T | undefined;
  error?: ApiError;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
  register: (credentials: RegisterCredentials) => Promise<ApiResponse<AuthResponse>>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateUser: (user: User) => void;
} 