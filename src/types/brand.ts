export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface Brand {
    brand_id: number;
    user_id: number;
    brand_name: string;
    brand_description?: string;
    logo_url?: string;
    website?: string;
    contact_email?: string;
    phone?: string;
    address?: string;
    verification_status: VerificationStatus;
    created_at: string;
    updated_at: string;
}

export interface CreateBrandRequest {
    brand_name: string;
    brand_description?: string;
    website?: string;
    contact_email?: string;
    phone?: string;
    address?: string;
}

export interface UpdateBrandRequest {
    brand_name?: string;
    brand_description?: string;
    logo_url?: string;
    website?: string;
    contact_email?: string;
    phone?: string;
    address?: string;
}

export interface BrandProfile extends Brand {
    username?: string;
    followers_count?: number;
    products_count?: number;
    average_rating?: number;
    total_reviews?: number;
}

export interface BrandFollower {
    follow_id: number;
    brand_id: number;
    user_id: number;
    created_at: string;
} 