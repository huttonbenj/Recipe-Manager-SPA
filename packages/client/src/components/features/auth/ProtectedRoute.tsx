import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeColors } from '../../../utils/theme';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);
    const location = useLocation();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
                <div className="text-center">
                    <div
                        className="animate-spin rounded-full h-32 w-32 border-b-2 mx-auto"
                        style={{ borderColor: themeColors.primary }}
                    ></div>
                    <p className="mt-4 text-surface-600 dark:text-surface-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}; 