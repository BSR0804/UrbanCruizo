import axios from 'axios';

// Normalise the env var: strip trailing slash + any existing /api, then always append /api
// This handles both:
//   VITE_API_URL=https://carawinn-2.onrender.com        → https://carawinn-2.onrender.com/api
//   VITE_API_URL=https://carawinn-2.onrender.com/api    → https://carawinn-2.onrender.com/api
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const baseURL = rawUrl.replace(/\/api\/?$/, '').replace(/\/$/, '') + '/api/v1/';

const api = axios.create({ baseURL });

if (import.meta.env.PROD) {
    console.log("🚀 Running in PRODUCTION mode");
    console.log("🔗 Backend URL:", baseURL);
}

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
