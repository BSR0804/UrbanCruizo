import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-surface shadow-md sticky top-0 z-50 border-b border-secondary/20">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-3xl font-serif font-bold text-primary">
                    CarawINN
                </Link>
                <nav className="hidden md:flex space-x-10 items-center">
                    <Link to="/" className="hover:text-primary transition font-medium">
                        Home
                    </Link>
                    <Link to="/home" className="hover:text-primary transition font-medium text-sm">
                        Destinations
                    </Link>
                    <Link to="/caravans" className="hover:text-primary transition font-medium text-sm">
                        Luxury Fleet
                    </Link>
                    <Link to="/vehicles" className="hover:text-primary transition font-medium text-sm text-primary">
                        Find Dealers
                    </Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="hover:text-primary transition">
                                Dashboard
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="hover:text-primary transition">
                                    Admin Panel
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="btn-outline px-4 py-1 text-sm"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex space-x-4">
                            <Link to="/login" className="hover:text-primary transition pt-2">
                                Login
                            </Link>
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
