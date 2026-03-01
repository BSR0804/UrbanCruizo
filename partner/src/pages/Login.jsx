import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            toast.success('Welcome back, Partner!');
            navigate('/dashboard');
        } else {
            toast.error(res.message);
        }
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const res = await googleLogin(tokenResponse.access_token, 'dealer');
            if (res.success) {
                toast.success('Authenticated with Google');
                navigate('/dashboard');
            } else {
                toast.error(res.message);
            }
        },
        onError: () => toast.error('Google Login Failed'),
    });

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
            <div className="bg-surface p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-gray-800">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-serif font-bold text-white mb-2">Partner Portal</h2>
                    <p className="text-textSecondary text-sm italic">Authorize & manage your premium fleet.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-textSecondary font-black pl-1">Authorized Email</label>
                        <input type="email" className="input-field" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-textSecondary font-black pl-1">Access Secret</label>
                        <input type="password" className="input-field" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full btn-primary py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20">Authorize & Enter</button>
                </form>

                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-textSecondary font-bold"><span className="px-4 bg-surface italic">Institutional Entry</span></div>
                </div>

                <button onClick={() => loginGoogle()} className="w-full bg-white text-gray-900 py-3.5 rounded-xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] border border-gray-200 shadow-lg">
                    Google Workspace
                </button>

                <div className="mt-10 text-center text-[10px] uppercase tracking-widest font-bold text-textSecondary">
                    New Partner? <a href="/register" className="text-primary hover:underline">Register Fleet</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
