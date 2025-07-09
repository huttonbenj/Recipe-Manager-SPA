import React, { useEffect, useState, ReactNode } from 'react';
import { User, LoginCredentials, RegisterCredentials, AuthContextType } from '../types/auth';
import { apiClient, ApiError } from '../services/api';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on app start
    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem('accessToken');

            if (accessToken) {
                try {
                    // Set token in API client
                    apiClient.setAccessToken(accessToken);

                    // Verify token by fetching user profile
                    const response = await apiClient.get<{ user: User }>('/api/auth/me');
                    setUser(response.user);
                } catch (error) {
                    // Token is invalid, clear it
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    apiClient.setAccessToken(null);
                }
            }

            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (credentials: LoginCredentials): Promise<void> => {
        setLoading(true);
        try {
            const response = await apiClient.login(credentials);
            setUser(response.user);
        } catch (error) {
            if (error instanceof ApiError) {
                throw new Error(error.message);
            }
            throw new Error('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const register = async (credentials: RegisterCredentials): Promise<void> => {
        setLoading(true);
        try {
            const response = await apiClient.register(credentials);
            setUser(response.user);
        } catch (error) {
            if (error instanceof ApiError) {
                // Create a custom error object that includes the details
                const customError = new Error(error.message) as Error & { details?: any };
                customError.details = error.data?.details;
                throw customError;
            }
            throw new Error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const logout = (): void => {
        apiClient.logout();
        setUser(null);
    };

    const isAuthenticated = !!user;

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 