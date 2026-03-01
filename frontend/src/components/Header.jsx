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
                    <NavLink to="/vehicles" className={navLinkClass}>
                        Find Dealers
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
                        <div className="flex items-center space-x-6 ml-4">
                            <NavLink
                                to="/login?role=dealer"
                                className={({ isActive }) =>
                                    `transition text-sm font-bold uppercase tracking-wider relative py-1 after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:bg-primary after:transition-all after:duration-300 ${location.pathname === '/login' && location.search === '?role=dealer'
                                        ? 'text-primary after:w-full'
                                        : 'text-secondary hover:text-primary after:w-0 hover:after:w-full'
                                    }`
                                }
                            >
                                Partner with us
                            </NavLink>
                            <div className="h-4 w-[1px] bg-secondary/30"></div>
                            <NavLink to="/login?role=user" className="btn-primary">
                                Join UrbanCruizo
                            </NavLink>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
