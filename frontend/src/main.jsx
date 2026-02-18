import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google';

// Use environment variable with a fallback and a console warning
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "345892520340-cabi9kjcqvud38u76ua5gghnqheg8fta.apps.googleusercontent.com";

if (!import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.PROD) {
  console.warn("WARNING: VITE_GOOGLE_CLIENT_ID is not set in Vercel. Using fallback ID.");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
