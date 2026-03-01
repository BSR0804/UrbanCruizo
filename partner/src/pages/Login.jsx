import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { Car, Truck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('dealer');
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const getRedirectPath = (role) => {
        return role === 'fleet' ? '/fleet-dashboard' : '/dashboard';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password, selectedRole);
        if (res.success) {
            toast.success(`Welcome back, ${selectedRole === 'fleet' ? 'Fleet Manager' : 'Partner'}!`);
            navigate(getRedirectPath(res.role || selectedRole));
        } else {
            toast.error(res.message);
        }
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const res = await googleLogin(tokenResponse.access_token, selectedRole);
            if (res.success) {
                toast.success('Authenticated with Google');
                navigate(getRedirectPath(selectedRole));
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

                {/* Role Selector */}
                <div className="mb-8">
                    <label className="text-[10px] uppercase tracking-widest text-textSecondary font-black pl-1 mb-3 block">Select Your Role</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setSelectedRole('dealer')}
                            className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${selectedRole === 'dealer'
                                ? 'bg-primary text-background border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                                : 'bg-background text-textSecondary border-gray-800 hover:border-primary/30 hover:text-white'
                                }`}
                        >
                            <Car className="w-4 h-4" />
                            Dealer
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole('fleet')}
                            className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${selectedRole === 'fleet'
                                ? 'bg-primary text-background border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                                : 'bg-background text-textSecondary border-gray-800 hover:border-primary/30 hover:text-white'
                                }`}
                        >
                            <Truck className="w-4 h-4" />
                            Fleet Manager
                        </button>
                    </div>
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
                    New Partner? <Link to="/register" className="text-primary hover:underline">Register Fleet</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
