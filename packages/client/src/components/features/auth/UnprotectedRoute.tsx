import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../hooks';

interface UnprotectedRouteProps {
    children: React.ReactElement;
}

export const UnprotectedRoute: React.FC<UnprotectedRouteProps> = ({ children }) => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}; 