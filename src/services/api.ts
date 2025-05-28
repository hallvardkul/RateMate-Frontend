import axios from 'axios';

// Flat Axios client configured via environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7071/api',
  withCredentials: true,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('brandToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      
      // Handle specific error cases
      if (error.response.status === 401) {
        // Clear token and redirect to login if unauthorized
        localStorage.removeItem('token');
        localStorage.removeItem('brandToken');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Authentication methods
const auth = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
};

// Brand authentication methods
const brandAuth = {
  register: (brandData: any) => api.post('/brands/auth/register', brandData),
  login: (credentials: any) => api.post('/brands/auth/login', credentials),
  dashboard: () => api.get('/brands/dashboard'),
};

// Products methods - Updated to use public endpoints
const products = {
  getAll: (page = 1, limit = 20) => api.get(`/public/products?page=${page}&limit=${limit}`),
  getById: (id: string | number) => api.get(`/public/products/${id}`),
  create: (productData: any) => api.post('/brands/products', productData),
  update: (id: string | number, productData: any) => api.put(`/brands/products/${id}`, productData),
  delete: (id: string | number) => api.delete(`/brands/products/${id}`),
  uploadMedia: (productId: string | number, files: File[]) => {
    const form = new FormData();
    files.forEach((file) => form.append('media', file));
    return api.post(`/brands/products/${productId}/media`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  // Brand-specific product methods
  getBrandProducts: () => api.get('/brands/dashboard/products'),
  getProductReviews: (productId: string | number) => api.get(`/brands/products/${productId}/reviews`),
};

// Categories methods
const categories = {
  getAll: () => api.get('/public/products/categories'),
};

// Brands methods - Updated to use public endpoints
const brands = {
  getAll: () => api.get('/public/brands'),
  getById: (id: string | number) => api.get(`/public/brands/${id}`),
};

// Reviews methods
const reviews = {
  getAll: (productId: string, page = 1, limit = 20) => api.get(`/reviews?productId=${productId}&page=${page}&limit=${limit}`),
  create: (reviewData: any) => api.post('/users/reviews', reviewData),
  getUserReviews: () => api.get('/users/reviews'),
};

// Comments methods
const comments = {
  getAll: (reviewId: string, page = 1, limit = 20) => api.get(`/comments?reviewId=${reviewId}&page=${page}&limit=${limit}`),
  create: (commentData: any) => api.post('/comments', commentData),
};

// User methods
const user = {
  update: (userId: number, data: any) => api.put(`/user/${userId}`, data),
  profile: () => api.get('/user/profile'),
};

export default api;
export { auth, brandAuth, products, categories, brands, reviews, comments, user };

/* ----------------------------------------------------------------
   TODO: long-term, migrate to this shared instance + hooks pattern
-------------------------------------------------------------------
*/
// import axios from 'axios';
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL
// });
// export default api;
