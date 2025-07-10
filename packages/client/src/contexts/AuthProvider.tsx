import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext, AuthContextType } from './AuthContext';
import { apiClient, User } from '../services/api';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            // Check if we have a stored token
            if (apiClient.isAuthenticated()) {
                const storedUser = apiClient.getStoredUser();
                if (storedUser) {
                    setUser(storedUser);

                    // Verify token validity by fetching current user
                    try {
                        const currentUser = await apiClient.getCurrentUser();
                        setUser(currentUser);
                    } catch (error) {
                        // Token is invalid, clear storage
                        apiClient.clearAuth();
                        setUser(null);
                    }
                }
            }
        } catch (error) {
            console.error('Auth initialization failed:', error);
            apiClient.clearAuth();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await apiClient.login({ email, password });
            setUser(response.user);
            toast.success('Successfully logged in!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Login failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, name: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await apiClient.register({ email, name, password });
            setUser(response.user);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Registration failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await apiClient.logout();
            setUser(null);
            toast.success('Successfully logged out');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Clear local state even if API call fails
            setUser(null);
            apiClient.clearAuth();
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (userData: { name?: string; email?: string }) => {
        try {
            setIsLoading(true);
            const updatedUser = await apiClient.updateProfile(userData);
            setUser(updatedUser);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update profile');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string) => {
        try {
            setIsLoading(true);
            await apiClient.changePassword({ currentPassword, newPassword });
            toast.success('Password changed successfully!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to change password');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const refreshUser = async () => {
        try {
            if (apiClient.isAuthenticated()) {
                const currentUser = await apiClient.getCurrentUser();
                setUser(currentUser);
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
            // If refresh fails, user might be logged out
            setUser(null);
            apiClient.clearAuth();
            navigate('/login');
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 