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

// Add a request interceptor to include the token in headers.
// Pick the partner token on dealer/admin routes, customer token elsewhere.
const isPartnerPath = (pathname) =>
    pathname.startsWith('/dealer') ||
    pathname.startsWith('/partner') ||
    pathname.startsWith('/admin');

api.interceptors.request.use(
    (config) => {
        const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
        const key = isPartnerPath(pathname) ? 'uc_partner' : 'uc_user';
        // Prefer this tab's sessionStorage; fall back to cross-tab localStorage.
        const userInfo = sessionStorage.getItem(key) || localStorage.getItem(key);
        if (userInfo) {
            try {
                const { token } = JSON.parse(userInfo);
                if (token) config.headers.Authorization = `Bearer ${token}`;
            } catch { /* ignore malformed JSON */ }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
