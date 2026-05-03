import { createContext, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../utils/api';

const AuthContext = createContext();

const PARTNER_KEY = 'uc_partner';
const USER_KEY = 'uc_user';

const isPartnerRoute = (pathname) =>
    pathname.startsWith('/dealer') ||
    pathname.startsWith('/partner') ||
    pathname.startsWith('/admin');

export const AuthProvider = ({ children }) => {
    const location = useLocation();
    const [partnerUser, setPartnerUser] = useState(() => {
        try { const r = localStorage.getItem(PARTNER_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
    });
    const [customerUser, setCustomerUser] = useState(() => {
        try { const r = localStorage.getItem(USER_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
    });
    const [loading] = useState(false);

    const onPartner = isPartnerRoute(location.pathname);

    // On partner routes show partner session, on customer routes show customer session.
    // Fall back to whichever session exists if the preferred one is missing.
    const user = onPartner
        ? (partnerUser || customerUser)
        : (customerUser || null);

    const persist = (data, intendedRole) => {
        // intendedRole = what the user was trying to log in as (dealer/user)
        // Store under partner key if they intended dealer OR their DB role is dealer/admin
        const isDealer = intendedRole === 'dealer' || data.role === 'dealer' || data.role === 'admin';
        if (isDealer) {
            localStorage.setItem(PARTNER_KEY, JSON.stringify(data));
            setPartnerUser(data);
        } else {
            localStorage.setItem(USER_KEY, JSON.stringify(data));
            setCustomerUser(data);
        }
    };

    const login = async (email, password, role) => {
        try {
            const { data } = await axios.post('auth/login', { email, password });
            persist(data, role);
            return { success: true, role: data.role, isProfileComplete: data.isProfileComplete };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password, role = 'user') => {
        try {
            const { data } = await axios.post('auth/register', { name, email, password, role });
            persist(data, role);
            return { success: true, role: data.role, isProfileComplete: data.isProfileComplete };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const googleLogin = async (token, role) => {
        try {
            const { data } = await axios.post('auth/google', { token, role });
            persist(data, role);
            return { success: true, role: data.role, isProfileComplete: data.isProfileComplete };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Google Login failed',
                details: error.response?.data?.details
            };
        }
    };

    const updateUser = (updatedData) => {
        if (onPartner && partnerUser) {
            const updated = { ...partnerUser, ...updatedData };
            localStorage.setItem(PARTNER_KEY, JSON.stringify(updated));
            setPartnerUser(updated);
        } else if (customerUser) {
            const updated = { ...customerUser, ...updatedData };
            localStorage.setItem(USER_KEY, JSON.stringify(updated));
            setCustomerUser(updated);
        }
    };

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
