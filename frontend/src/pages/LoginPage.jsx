import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
    const location = useLocation();
    const queryRole = new URLSearchParams(location.search).get('role');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginType, setLoginType] = useState(queryRole === 'dealer' ? 'dealer' : queryRole === 'fleet' ? 'fleet' : 'user');

    const getRedirectPath = (role) => {
        if (role === 'admin') return '/admin';
        if (role === 'dealer') return '/dealerdashboard';
        if (role === 'fleet') return '/dealerdashboard';
        return '/dashboard';
    };
    const [error, setError] = useState('');
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSuccess = async (tokenResponse) => {
        console.log("Google raw response received:", tokenResponse);
        if (tokenResponse?.access_token) {
            console.log("Attempting backend authentication with access token...");
            const result = await googleLogin(tokenResponse.access_token, loginType);
            if (result.success) {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if ((loginType === 'dealer' || loginType === 'fleet') && userInfo.role !== 'dealer' && userInfo.role !== 'fleet') {
                    setError('This account is not registered as a partner.');
                    toast.error('This account is not registered as a partner.');
                    return;
                }
                toast.success('Welcome back!');
                navigate(getRedirectPath(userInfo.role));
            } else {
                console.error("Backend auth failed:", result.message, result.details);
                const errorMsg = result.details ? `${result.message}: ${result.details}` : result.message;
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } else {
            console.error("No access token in Google response:", tokenResponse);
            toast.error("Google didn't return an access token.");
        }
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: (err) => {
            console.error('Google Login Hook Error:', err);
            toast.error('Google Login Failed. Check console.');
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('=== LOGIN DEBUG ===');
        console.log('loginType:', loginType);
        console.log('queryRole:', queryRole);
        console.log('email:', email);
        const result = await login(email, password, loginType);
        console.log('login result:', result);
        if (result.success) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            console.log('userInfo from localStorage:', userInfo);
            console.log('userInfo.role:', userInfo.role);

            toast.success('Welcome back!');
            console.log('Redirecting to', getRedirectPath(userInfo.role));
            navigate(getRedirectPath(userInfo.role));
        } else {
            setError(result.message);
            toast.error(result.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
            <div className="bg-surface p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-gray-800 transition-all">
                {queryRole ? (
                    <div className="flex justify-center mb-10">
                        <div className="bg-background/50 p-1.5 rounded-2xl flex border border-gray-800">
                            <button
                                onClick={() => navigate(`/login?role=${queryRole}`)}
                                className="px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-primary text-background shadow-lg"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate(`/register?role=${queryRole}`)}
                                className="px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-textSecondary hover:text-white"
                            >
                                Register
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center mb-10">
                        <div className="bg-background/50 p-1.5 rounded-2xl flex border border-gray-800">
                            <button
                                onClick={() => setLoginType('user')}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginType === 'user' ? 'bg-primary text-background shadow-lg' : 'text-textSecondary hover:text-white'}`}
                            >
                                Individual
                            </button>
                            <button
                                onClick={() => setLoginType('dealer')}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginType === 'dealer' ? 'bg-primary text-background shadow-lg' : 'text-textSecondary hover:text-white'}`}
                            >
                                Dealer
                            </button>
                            <button
                                onClick={() => setLoginType('fleet')}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${loginType === 'fleet' ? 'bg-primary text-background shadow-lg' : 'text-textSecondary hover:text-white'}`}
                            >
                                Fleet
                            </button>
                        </div>
                    </div>
                )}

                <div className="text-center mb-10">
                    <h2 className="text-4xl font-serif font-bold text-white mb-3">
                        {loginType === 'dealer' ? 'Dealer Portal' : loginType === 'fleet' ? 'Fleet Portal' : 'Join UrbanCruizo'}
                    </h2>
                    <p className="text-textSecondary text-sm italic">
                        {loginType === 'dealer'
                            ? "Access your Dealer Dashboard to manage vehicles and earnings."
                            : loginType === 'fleet'
                                ? "Access your Fleet Dashboard to manage your fleet operations."
                                : "Login to discover and book premium rentals across India."}
                    </p>
                </div>

                {error && <div className="bg-red-500/10 text-red-500 p-4 mb-8 rounded-xl text-xs font-bold text-center border border-red-500/20 uppercase tracking-widest leading-relaxed">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-textSecondary font-black pl-1">Authorized Email</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="authorized@urbancruizo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center pl-1">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-textSecondary font-black">Security Password</label>
                        </div>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full btn-primary py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 group transition-all shadow-xl shadow-primary/20">
                        {loginType === 'dealer' ? 'Authorize & Enter' : loginType === 'fleet' ? 'Fleet Login' : 'Sign In Now'}
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </form>

                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-800/50"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-textSecondary font-bold">
                        <span className="px-4 bg-surface italic">Institutional Auth</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => loginGoogle()}
                    className="w-full bg-white text-gray-900 py-3.5 rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all font-black uppercase tracking-widest text-[10px] border border-gray-200 shadow-lg"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                    Google Workspace
                </button>

                <div className="mt-10 text-center text-[10px] uppercase tracking-widest font-bold text-textSecondary">
                    {loginType === 'dealer' ? (
                        <>Institutional Partner? <a href="/register?role=dealer" className="text-primary hover:underline">Register Now</a></>
                    ) : (
                        <>New to UrbanCruizo? <a href={queryRole === 'user' ? "/register?role=user" : "/register"} className="text-primary hover:underline">Create Account</a></>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

