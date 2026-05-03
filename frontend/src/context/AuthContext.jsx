import { createContext, useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../utils/api';

const AuthContext = createContext();

const PARTNER_KEY = 'uc_partner';
const USER_KEY = 'uc_user';

// Routes considered partner/dealer space — auth from these routes uses uc_partner storage
const isPartnerRoute = (pathname) =>
    pathname.startsWith('/dealer') ||
    pathname.startsWith('/partner') ||
    pathname.startsWith('/admin');

const storageKeyForRole = (role) =>
    role === 'dealer' || role === 'admin' ? PARTNER_KEY : USER_KEY;

export const AuthProvider = ({ children }) => {
    const location = useLocation();
    const [partnerUser, setPartnerUser] = useState(null);
    const [customerUser, setCustomerUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const partnerRaw = localStorage.getItem(PARTNER_KEY);
        const customerRaw = localStorage.getItem(USER_KEY);
        if (partnerRaw) setPartnerUser(JSON.parse(partnerRaw));
        if (customerRaw) setCustomerUser(JSON.parse(customerRaw));
        setLoading(false);
    }, []);

    // Active user depends on current route — dealer routes use partner session, others use customer
    const onPartner = isPartnerRoute(location.pathname);
    const user = onPartner ? partnerUser : customerUser;

    const persist = (data) => {
        const key = storageKeyForRole(data.role);
        localStorage.setItem(key, JSON.stringify(data));
        if (key === PARTNER_KEY) setPartnerUser(data);
        else setCustomerUser(data);
    };

    const login = async (email, password, role) => {
        try {
            const { data } = await axios.post('auth/login', { email, password, role });
            persist(data);
            return {
                success: true,
                role: data.role,
                isProfileComplete: data.isProfileComplete,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    };

    const register = async (name, email, password, role = 'user') => {
        try {
            const { data } = await axios.post('auth/register', {
                name,
                email,
                password,
                role
            });
            persist(data);
            return {
                success: true,
                role: data.role,
                isProfileComplete: data.isProfileComplete,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
            };
        }
    };

    const googleLogin = async (token, role) => {
        try {
            const { data } = await axios.post('auth/google', { token, role });
            persist(data);
            return {
                success: true,
                role: data.role,
                isProfileComplete: data.isProfileComplete,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Google Login failed',
                details: error.response?.data?.details
            };
        }
    };

    const updateUser = (updatedData) => {
        const current = onPartner ? partnerUser : customerUser;
        if (!current) return;
        const newUser = { ...current, ...updatedData };
        const key = storageKeyForRole(newUser.role);
        localStorage.setItem(key, JSON.stringify(newUser));
        if (key === PARTNER_KEY) setPartnerUser(newUser);
        else setCustomerUser(newUser);
    };

    // Only clear the session matching the current route — leaves the other side logged in
    const logout = () => {
        if (onPartner) {
            localStorage.removeItem(PARTNER_KEY);
            setPartnerUser(null);
        } else {
            localStorage.removeItem(USER_KEY);
            setCustomerUser(null);
        }
        window.location.replace('https://caraw-inn.vercel.app/');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, updateUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
