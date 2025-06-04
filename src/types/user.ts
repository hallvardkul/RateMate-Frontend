export type UserType = 'user' | 'brand';

export interface User {
    user_id: number;
    username: string;
    email: string;
    user_type: UserType;
    is_verified: boolean;
    bio?: string;
    avatar_url?: string;
    phone?: string;
    website?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    user_type: UserType;
    bio?: string;
    phone?: string;
    website?: string;
}

export interface UpdateUserRequest {
    username?: string;
    email?: string;
    bio?: string;
    avatar_url?: string;
    phone?: string;
    website?: string;
}

export interface UserProfile extends User {
    followers_count?: number;
    following_count?: number;
    reviews_count?: number;
    products_count?: number; // For brand users
}

export interface AuthResponse {
    user: User;
    token: string;
} 