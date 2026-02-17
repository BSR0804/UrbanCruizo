import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";

    const handleGoogleSuccess = async (tokenResponse) => {
        // useGoogleLogin 'implicit' flow returns access_token. 
        // OR better, we can use 'id_token' flow if we want simple backend verification.
        // However, useGoogleLogin by default (implicit) returns access_token.
        // But for backend verification 'id_token' is better (OpenID Connect).
        // Let's use the 'credential' which comes from the <GoogleLogin> component usually.
        // But for custom button with useGoogleLogin, we receive a code or token depending on flow.

        // Actually, for backend verification, getting an ID Token is standard.
        // But useGoogleLogin hook gives us an access_token (implicit) or code (auth-code).
        // Let's use the simplest: GoogleLogin component rendering? 
        // No, user wants custom button.
        // So we use useGoogleLogin using 'onSuccess' callback which provides a tokenResponse.
        // BUT, verification on backend requires ID Token for simplest setup with google-auth-library.
        // Let's switch to receiving 'credential' if we were using the Component.
        // For custom button + useGoogleLogin: we can get code and exchange it, OR just get access_token and fetch profile on backend.
        // WAIT: google-auth-library `verifyIdToken` expects an ID TOKEN.
        // `useGoogleLogin` with `flow: 'implicit'` returns access_token.
        // We cannot use verifyIdToken with access_token.
        // Start simple: Use the `GoogleLogin` component logic?
        // Or configure useGoogleLogin to give us an id_token?
        // Actually, the new reacting-oauth/google library has a distinct onSucces for <GoogleLogin> (gives credential/jwt) vs useGoogleLogin (gives access_token).

        // CORRECTION: To get ID Token with custom button via useGoogleLogin, it is harder.
        // EASIER PATH: Use the provided <GoogleLogin> component but start with invisible mode?
        // OR: Just send the access_token to backend, and backend uses it to fetch user info from https://www.googleapis.com/oauth2/v3/userinfo.
        // Let's update backend to handle access_token instead of ID_Token?
        // NO, ID Token is safer and standard for "Auth".

        // ALTERNATIVE: Use the <GoogleLogin> component but styled?
        // No, user likely wants the style I just made.

        // Let's use the approach of validation via userinfo endpoint on backend.
        // It is equally valid for this use case. 
        // SO: Frontend sends access_token. Backend fetches profile.

        console.log("Google response", tokenResponse);
        if (tokenResponse?.access_token) {
            const result = await googleLogin(tokenResponse.access_token);
            if (result.success) {
                toast.success('Welcome back!');
                navigate(from, { replace: true });
            } else {
                setError(result.message);
                toast.error(result.message);
            }
        }
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => toast.error('Google Login Failed'),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            toast.success('Welcome back!');
            navigate(from, { replace: true });
        } else {
            setError(result.message);
            toast.error(result.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
            <div className="bg-surface p-8 rounded-lg shadow-2xl w-full max-w-md border border-secondary/20">
                <h2 className="text-3xl font-serif text-center mb-8 text-primary">Welcome Back</h2>
                {error && <div className="bg-red-500/10 text-red-500 p-3 mb-4 rounded text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-textSecondary mb-2">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-textSecondary mb-2">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full btn-primary py-3">
                        Sign In
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-surface text-textSecondary">Or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => loginGoogle()}
                    className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-medium"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Google Account
                </button>
                <div className="mt-6 text-center text-textSecondary">
                    Don't have an account? <a href="/register" className="text-primary hover:underline">Register</a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

