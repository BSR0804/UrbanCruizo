import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        window.location.href = 'https://caraw-inn.vercel.app/';
    };

    const navLinkClass = ({ isActive }) =>
        `hover:text-primary transition font-medium relative py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 ${isActive ? 'text-primary after:w-full' : 'after:w-0 hover:after:w-full'
        }`;

    const isPartnerRoute = location.pathname === '/partner' || location.pathname === '/dealer/dashboard';

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
                            {location.pathname === '/partner' && (
                                <>
                                    <button onClick={() => window.location.hash = '#features'} className="text-xs uppercase tracking-widest text-textSecondary hover:text-primary transition font-bold">Features</button>
                                    <button onClick={() => window.location.hash = '#benefits'} className="text-xs uppercase tracking-widest text-textSecondary hover:text-primary transition font-bold">Benefits</button>
                                    <button onClick={() => window.location.hash = '#stats'} className="text-xs uppercase tracking-widest text-textSecondary hover:text-primary transition font-bold">Performance</button>
                                </>
                            )}
                            {location.pathname === '/dealer/dashboard' && user && (
                                <button
                                    onClick={handleLogout}
                                    className="text-xs uppercase tracking-widest text-textSecondary hover:text-primary transition font-bold"
                                >
                                    Logout
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <NavLink to="/" className={navLinkClass}>
                                Home
                            </NavLink>
                            <NavLink
                                to="/home"
                                className={navLinkClass}
                            >
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
                                    {/* Authorization handled via protected routes and individual login pages */}
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
