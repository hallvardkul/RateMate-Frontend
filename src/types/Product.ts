export interface Product {
  product_id: number;
  product_name: string;
  description: string;
  brand_id: number;
  category_id: number;
  brand_name: string;   // returned by join
  category_name: string;
} 