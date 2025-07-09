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

                    // TODO: Verify token by fetching user profile
                    // For now, we'll implement this when we have the user profile endpoint
                    // const userProfile = await apiClient.get<User>('/api/users/me');
                    // setUser(userProfile);

                    // Temporary: Just check if the token works with a health check
                    await apiClient.healthCheck();

                    // If health check passes, assume token is valid
                    // In a real app, you'd decode the JWT or call a profile endpoint
                    setUser({
                        id: 'temp-user-id',
                        email: 'user@example.com',
                        name: 'Current User'
                    });
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
                throw new Error(error.message);
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