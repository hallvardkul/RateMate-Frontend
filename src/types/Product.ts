// Backend API Product type - matches the actual API response
export interface Product {
  product_id: number;
  product_name: string;
  product_category: string;
  description: string;
  subcategory_id: number | null;
  category_id: number | null;
  brand_id: number;
  brand_name: string;
  brand_verified: boolean;
  average_rating: string;
  total_reviews: string;
}

// Brand type from backend
export interface Brand {
  brand_id: number;
  brand_name: string;
  email: string;
  is_verified: boolean;
  created_at: string;
}

// Product filters for API calls
export interface ProductFilters {
  category?: string;
  brand?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// API Response types
export interface ProductsResponse {
  products: Product[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface BrandsResponse {
  brands: Brand[];
}

export interface CreateProductRequest {
  product_name: string;
  product_description?: string;
  product_category: string;
  price?: number;
  image_url?: string;
}

export interface UpdateProductRequest {
  product_name?: string;
  product_description?: string;
  product_category?: string;
  price?: number;
  image_url?: string;
  is_active?: boolean;
}

export interface ProductWithStats {
  product_id: number;
  product_name: string;
  product_category: string;
  description: string;
  subcategory_id: number | null;
  category_id: number | null;
  brand_id: number;
  brand_name: string;
  brand_verified: boolean;
  average_rating: string;
  total_reviews: string;
  brand_logo_url?: string;
  verification_status?: string;
}

export interface ProductCategory {
  category: string;
  product_count: number;
} 