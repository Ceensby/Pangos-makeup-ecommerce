import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => {
        // Get token from localStorage
        const savedToken = localStorage.getItem('token');
        // CRITICAL: Set axios header IMMEDIATELY if token exists
        if (savedToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }
        return savedToken;
    });
    const [loading, setLoading] = useState(true);

    // Configure axios to include JWT token in all requests
    useEffect(() => {
        if (token) {
            // Ensure Authorization header is set
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Fetch current user info
            fetchCurrentUser();
        } else {
            // Remove Authorization header if no token
            delete axios.defaults.headers.common['Authorization'];
            setLoading(false);
        }
    }, [token]);

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/auth/me');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user', error);
            // Token might be invalid, clear it
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password
            });

            const { token: newToken, username: userName } = response.data;

            // Store token
            localStorage.setItem('token', newToken);
            setToken(newToken);

            // Set axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            // Fetch full user data
            await fetchCurrentUser();

            return { success: true };
        } catch (error) {
            console.error('Login failed', error);
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    };

    const signup = async (username, password, email) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/signup', {
                username,
                password,
                email
            });

            const { token: newToken } = response.data;

            // Store token
            localStorage.setItem('token', newToken);
            setToken(newToken);

            // Set axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            // Fetch full user data
            await fetchCurrentUser();

            return { success: true };
        } catch (error) {
            console.error('Signup failed', error);
            return { success: false, error: error.response?.data?.error || 'Signup failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!token && !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
