import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

const RegisterPage = () => {
    const location = useLocation();
    const queryRole = new URLSearchParams(location.search).get('role');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(queryRole === 'dealer' ? 'dealer' : 'user');
    const [error, setError] = useState('');
    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSuccess = async (tokenResponse) => {
        if (tokenResponse?.access_token) {
            const result = await googleLogin(tokenResponse.access_token);
            if (result.success) {
                toast.success('Account created successfully!');
                navigate('/');
            } else {
                setError(result.message);
                toast.error(result.message);
            }
        }
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => toast.error('Google Link Failed'),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(name, email, password, role);
        if (result.success) {
            toast.success(role === 'dealer' ? 'Dealer account created! Welcome partner.' : 'Account created successfully!');
            navigate(role === 'dealer' ? '/admin' : '/');
        } else {
            setError(result.message);
            toast.error(result.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
            <div className="bg-surface p-8 rounded-2xl shadow-2xl w-full max-w-md border border-secondary/20 transition-all">
                {!queryRole && (
                    <div className="flex justify-center mb-8">
                        <div className="bg-background/50 p-1 rounded-xl flex border border-gray-800">
                            <button
                                onClick={() => setRole('user')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${role === 'user' ? 'bg-primary text-background shadow-lg' : 'text-textSecondary hover:text-white'}`}
                            >
                                Customer
                            </button>
                            <button
                                onClick={() => setRole('dealer')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${role === 'dealer' ? 'bg-primary text-background shadow-lg' : 'text-textSecondary hover:text-white'}`}
                            >
                                Dealer
                            </button>
                        </div>
                    </div>
                )}

                <h2 className="text-3xl font-serif text-center mb-8 text-primary">
                    {role === 'dealer' ? (queryRole === 'dealer' ? 'Partner Registration' : 'Become a Partner') : 'Join CarawINN'}
                </h2>

                {error && <div className="bg-red-500/10 text-red-500 p-3 mb-6 rounded-lg text-sm text-center border border-red-500/20">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-textSecondary mb-2 font-medium">Full Name</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-textSecondary mb-2 font-medium">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-textSecondary mb-2 font-medium">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full btn-primary py-4 rounded-xl text-lg flex items-center justify-center gap-2 group transition-all">
                        {role === 'dealer' ? 'Create Partner Account' : 'Create Account'}
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest text-textSecondary">
                        <span className="px-4 bg-surface">Or join with</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => loginGoogle()}
                    className="w-full bg-white text-gray-900 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all font-bold border border-gray-200"
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

                <div className="mt-8 text-center text-sm text-textSecondary">
                    Already have an account? <a href={role === 'dealer' ? "/login?role=dealer" : "/login"} className="text-primary font-bold hover:underline">Login</a>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

