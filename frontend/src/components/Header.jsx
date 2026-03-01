import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClass = ({ isActive }) =>
        `hover:text-primary transition font-medium relative py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 ${isActive ? 'text-primary after:w-full' : 'after:w-0 hover:after:w-full'
        }`;

    const isPartnerRoute = location.pathname === '/partner';

    return (
        <header className="bg-surface shadow-md sticky top-0 z-50 border-b border-secondary/20">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {isPartnerRoute ? (
                    <Link to="/partner" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <Car className="w-5 h-5 text-background" />
                        </div>
                        <div>
                            <h1 className="text-xl font-serif font-bold text-white leading-none">UrbanCruizo</h1>
                            <p className="text-[8px] uppercase tracking-[0.3em] text-primary font-black">Partner Portal</p>
                        </div>
                    </Link>
                ) : (
                    <Link to="/" className="text-3xl font-serif font-bold text-primary">
                        UrbanCruizo
                    </Link>
                )}

                <nav className="hidden md:flex md:space-x-8 lg:space-x-10 items-center">
                    {isPartnerRoute ? (
                        <>
                            <a href="#features" className="text-xs uppercase tracking-widest text-textSecondary hover:text-primary transition font-bold">Features</a>
                            <a href="#benefits" className="text-xs uppercase tracking-widest text-textSecondary hover:text-primary transition font-bold">Benefits</a>
                            <a href="#stats" className="text-xs uppercase tracking-widest text-textSecondary hover:text-primary transition font-bold">Performance</a>


                        </>
                    ) : (
                        <>
                            <NavLink to="/" end className={navLinkClass}>
                                Home
                            </NavLink>
                            <NavLink to="/home" className={navLinkClass}>
                                Destinations
                            </NavLink>
                            <NavLink to="/caravans" className={navLinkClass}>
                                Luxury Caravans
                            </NavLink>

                            {user ? (
                                <>
                                    <NavLink
                                        to={user.role === 'dealer' ? "/dealer/dashboard" : "/dashboard"}
                                        className={navLinkClass}
                                    >
                                        {user.role === 'dealer' ? 'Dealer Panel' : 'Dashboard'}
                                    </NavLink>
                                    {user.role === 'admin' && (
                                        <NavLink to="/admin" className={navLinkClass}>
                                            Admin Panel
                                        </NavLink>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="btn-outline px-4 py-1 text-sm ml-4"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center space-x-8 ml-4">
                                    {/* Partner Link */}
                                    <NavLink to="/partner" className={navLinkClass}>
                                        Partner With Us
                                    </NavLink>

                                    {/* Divider */}
                                    <div className="h-6 w-[1px] bg-gray-800"></div>

                                    {/* User Dropdown */}
                                    <div className="relative group">
                                        <button className="btn-primary px-6 py-2 text-sm flex items-center gap-2">
                                            Join UrbanCruizo
                                            <svg className="w-3 h-3 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                        <div className="absolute top-full left-0 mt-2 w-48 bg-surface border border-gray-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                                            <Link to="/login?role=user" className="block px-6 py-4 text-sm font-bold text-textSecondary hover:bg-primary hover:text-background transition-all">Login</Link>
                                            <Link to="/register?role=user" className="block px-6 py-4 text-sm font-bold text-textSecondary hover:bg-primary hover:text-background border-t border-gray-800/50 transition-all">Register</Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
