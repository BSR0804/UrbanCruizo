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
    // Per-tab session: prefer sessionStorage (tab-scoped) and fall back to localStorage (cross-tab resume).
    // This means logging out in one tab does NOT log out other tabs.
    const readSession = (key) => {
        try {
            const s = sessionStorage.getItem(key);
            if (s) return JSON.parse(s);
            const l = localStorage.getItem(key);
            if (l) {
                sessionStorage.setItem(key, l); // hydrate this tab from the cross-tab fallback
                return JSON.parse(l);
            }
        } catch { /* ignore */ }
        return null;
    };

    const [partnerUser, setPartnerUser] = useState(() => readSession(PARTNER_KEY));
    const [customerUser, setCustomerUser] = useState(() => readSession(USER_KEY));
    const [loading] = useState(false);

    const onPartner = isPartnerRoute(location.pathname);

    // On partner routes show partner session, on customer routes show customer session.
    // Fall back to whichever session exists if the preferred one is missing.
    const user = onPartner
        ? (partnerUser || customerUser)
        : (customerUser || null);

    const persist = (data, intendedRole) => {
        // The intended login type wins. If the user clicked "Customer Login" (intendedRole==='user'),
        // their session goes under uc_user — regardless of what role the DB record has.
        // This protects users whose DB role was corrupted by the old upgrade bug.
        let goPartner;
        if (intendedRole === 'user') goPartner = false;
        else if (intendedRole === 'dealer' || intendedRole === 'admin') goPartner = true;
        else goPartner = data.role === 'dealer' || data.role === 'admin';

        // Surface the intended role to the rest of the app so redirect logic works
        const sessionData = { ...data, role: intendedRole === 'user' ? 'user' : (intendedRole === 'dealer' ? 'dealer' : data.role) };

        const key = goPartner ? PARTNER_KEY : USER_KEY;
        const serialized = JSON.stringify(sessionData);
        sessionStorage.setItem(key, serialized);
        localStorage.setItem(key, serialized);
        if (goPartner) setPartnerUser(sessionData);
        else setCustomerUser(sessionData);
        return sessionData;
    };

    const login = async (email, password, role) => {
        try {
            const { data } = await axios.post('auth/login', { email, password });
            const session = persist(data, role);
            return { success: true, role: session.role, isProfileComplete: session.isProfileComplete };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password, role = 'user') => {
        try {
            const { data } = await axios.post('auth/register', { name, email, password, role });
            const session = persist(data, role);
            return { success: true, role: session.role, isProfileComplete: session.isProfileComplete };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const googleLogin = async (token, role) => {
        try {
            const { data } = await axios.post('auth/google', { token, role });
            const session = persist(data, role);
            return { success: true, role: session.role, isProfileComplete: session.isProfileComplete };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Google Login failed',
                details: error.response?.data?.details
            };
        }
    };

    const updateUser = (updatedData) => {
        const key = (onPartner && partnerUser) ? PARTNER_KEY : USER_KEY;
        const current = (onPartner && partnerUser) ? partnerUser : customerUser;
        if (!current) return;
        const updated = { ...current, ...updatedData };
        const serialized = JSON.stringify(updated);
        sessionStorage.setItem(key, serialized);
        localStorage.setItem(key, serialized);
        if (key === PARTNER_KEY) setPartnerUser(updated);
        else setCustomerUser(updated);
    };

    const logout = () => {
        // Only clear THIS tab's session; other tabs keep their own sessionStorage copy.
        // We also clear the localStorage fallback so brand-new tabs opened after this
        // logout don't auto-resume the session.
        const key = onPartner ? PARTNER_KEY : USER_KEY;
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
        if (onPartner) setPartnerUser(null);
        else setCustomerUser(null);
        window.location.replace('https://caraw-inn.vercel.app/');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, updateUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
