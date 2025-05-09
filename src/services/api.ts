import axios from 'axios';

// Flat Axios client configured via environment variable
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Attach JWT token from localStorage on each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
export { api };

/* ----------------------------------------------------------------
   TODO: long-term, migrate to this shared instance + hooks pattern
-------------------------------------------------------------------
*/
// import axios from 'axios';
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL
// });
// export default api;
