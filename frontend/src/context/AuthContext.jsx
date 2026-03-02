import { createContext, useState, useEffect, useContext } from 'react';
import axios from '../utils/api'; // uses axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);
    // Optional role allows partner logins to explicitly indicate dealer intent
    const login = async (email, password, role) => {
        try {
            const { data } = await axios.post('auth/login', { email, password, role });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
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
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
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
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
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
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem('userInfo', JSON.stringify(newUser));
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        window.location.replace('https://caraw-inn.vercel.app/');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, updateUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
