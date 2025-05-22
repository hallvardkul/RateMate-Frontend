import axios from 'axios';

// Flat Axios client configured via environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7073/api',
  withCredentials: true,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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

// Products methods
const products = {
  getAll: (page = 1, limit = 20) => api.get(`/products?page=${page}&limit=${limit}`),
  getById: (id: string | number) => api.get(`/products/${id}`),
  create: (productData: any) => api.post('/products', productData),
  update: (id: string | number, productData: any) => api.put(`/products/${id}`, productData),
  delete: (id: string | number) => api.delete(`/products/${id}`),
};

// Categories methods
const categories = {
  getAll: () => api.get('/categories'),
};

// Brands methods
const brands = {
  getAll: () => api.get('/brands'),
};

// Reviews methods
const reviews = {
  getAll: (productId: string, page = 1, limit = 20) => api.get(`/reviews?productId=${productId}&page=${page}&limit=${limit}`),
  create: (reviewData: any) => api.post('/reviews', reviewData),
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
export { auth, products, categories, brands, reviews, comments, user };

/* ----------------------------------------------------------------
   TODO: long-term, migrate to this shared instance + hooks pattern
-------------------------------------------------------------------
*/
// import axios from 'axios';
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL
// });
// export default api;
