import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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
                        Luxury Fleet
                    </NavLink>
                    <NavLink to="/vehicles" className={navLinkClass}>
                        Find Dealers
                    </NavLink>
                    {user ? (
                        <>
                            <NavLink to="/dashboard" className={navLinkClass}>
                                Dashboard
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
                        <div className="flex items-center space-x-4 ml-4">
                            <NavLink to="/login" className={navLinkClass}>
                                Login
                            </NavLink>
                            <Link to="/register" className="btn-primary">
                                Register
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
