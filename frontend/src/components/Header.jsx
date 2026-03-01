import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

    return (
        <header className="bg-surface shadow-md sticky top-0 z-50 border-b border-secondary/20">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-3xl font-serif font-bold text-primary">
                    UrbanCruizo
                </Link>
                <nav className="hidden md:flex space-x-10 items-center">
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
                            {/* Partner Dropdown */}
                            <div className="relative group">
                                <button className={`flex items-center gap-1 transition text-xs font-black uppercase tracking-[0.2em] py-2 ${location.search.includes('role=dealer') ? 'text-primary' : 'text-textSecondary hover:text-primary'}`}>
                                    Partner With Us
                                    <svg className="w-3 h-3 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-gray-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                                    <Link to="/login?role=dealer" className="block px-6 py-4 text-sm font-bold text-textSecondary hover:bg-primary hover:text-background transition-all">Login</Link>
                                    <Link to="/register?role=dealer" className="block px-6 py-4 text-sm font-bold text-textSecondary hover:bg-primary hover:text-background border-t border-gray-800/50 transition-all">Register</Link>
                                </div>
                            </div>

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
                </nav>
            </div>
        </header>
    );
};

export default Header;
