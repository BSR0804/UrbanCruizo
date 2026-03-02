import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { Car, LogIn, Chrome, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('dealer');
    const [isLoading, setIsLoading] = useState(false);
    const { login, googleLogin } = useAuth();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const redirectPath = queryParams.get('redirect');

    const getRedirectPath = () => {
        if (redirectPath) return redirectPath;
        // Direct to the main dealer dashboard if no redirect path is given
        return 'https://caraw-inn.vercel.app/dealer/dashboard';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await login(email, password, selectedRole);
        setIsLoading(false);
        if (res.success) {
            const path = getRedirectPath();
            if (path.startsWith('http')) {
                window.location.href = path;
            } else {
                navigate(path);
            }
        } else {
            toast.error(res.message);
        }
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            const res = await googleLogin(tokenResponse.access_token, selectedRole);
            setIsLoading(false);
            if (res.success) {
                if (!res.isProfileComplete) {
                    toast.success('Welcome! Please complete your profile to get started.');
                } else {
                    toast.success('Authenticated with Google');
                }
                const path = getRedirectPath();
                // If it's an external URL (like the main site), use window.location
                if (path.startsWith('http')) {
                    window.location.href = path;
                } else {
                    navigate(path);
                }
            } else {
                toast.error(res.message);
            }
        },
        onError: () => toast.error('Google Login Failed'),
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[200px]" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-[480px]"
            >
                {/* Top badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center mb-8"
                >
                    <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-5 py-2 rounded-full backdrop-blur-md">
                        <Shield className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-black">Secure Partner Authentication</span>
                    </div>
                </motion.div>

                <div className="bg-surface/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-black/40 border border-gray-800/80 relative overflow-hidden">
                    {/* Inner glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />

                    <div className="text-center mb-10">
                        <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-6 h-6 text-background" />
                            </div>
                            <span className="text-2xl font-serif font-bold text-white tracking-tight">UrbanCruizo</span>
                        </Link>
                        <h2 className="text-3xl font-serif font-bold text-white mb-2">Partner Portal</h2>
                        <p className="text-textSecondary text-sm">Authorize & manage your premium fleet.</p>
                    </div>



                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-textSecondary font-black pl-1">Authorized Email</label>
                            <input
                                type="email"
                                className="input-field rounded-xl py-3.5"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="partner@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-textSecondary font-black pl-1">Access Secret</label>
                            <input
                                type="password"
                                className="input-field rounded-xl py-3.5"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-primary/30 transition-all"
                        >
                            {isLoading ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-background border-t-transparent rounded-full" />
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4" />
                                    Authorize & Enter
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-textSecondary font-bold"><span className="px-4 bg-surface/80 italic">Or Continue With</span></div>
                    </div>

                    <button
                        onClick={() => loginGoogle()}
                        disabled={isLoading}
                        className="w-full bg-white/95 hover:bg-white text-gray-900 py-3.5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] border border-gray-200 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="group-hover:translate-x-0.5 transition-transform">Google Workspace</span>
                    </button>

                    <p className="mt-3 text-center text-[10px] text-textSecondary/60 italic leading-relaxed">
                        First-time Google login? You'll be asked to complete<br />your dealer profile before accessing the dashboard.
                    </p>

                    <div className="mt-8 text-center text-[10px] uppercase tracking-widest font-bold text-textSecondary">
                        New Partner? <Link to="/register" className="text-primary hover:underline underline-offset-4 transition-all">Register Fleet <ArrowRight className="w-3 h-3 inline" /></Link>
                    </div>
                </div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 flex justify-center gap-8 text-[9px] uppercase tracking-[0.2em] text-textSecondary/40 font-black"
                >
                    <span>🔒 256-bit SSL</span>
                    <span>✓ SOC2 Compliant</span>
                    <span>⚡ Real-time Sync</span>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
