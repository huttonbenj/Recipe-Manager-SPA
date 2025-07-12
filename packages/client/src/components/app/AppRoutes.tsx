import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
import { UnprotectedRoute } from '../features/auth/UnprotectedRoute';
import { Layout } from './Layout';

// Pages
import { LoginForm } from '../features/auth/login';
import { RegisterForm } from '../features/auth/register';
import { LandingPage } from '../features/landing/LandingPage';
import { ModernApp } from '../features/app/ModernApp';
import { RecipeDetail } from '../features/recipes/RecipeDetail';
import { RecipeForm } from '../features/recipes/RecipeForm';

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Unprotected Routes */}
            <Route
                path="/"
                element={
                    <UnprotectedRoute>
                        <LandingPage />
                    </UnprotectedRoute>
                }
            />
            <Route
                path="/login"
                element={
                    <UnprotectedRoute>
                        <LoginForm />
                    </UnprotectedRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <UnprotectedRoute>
                        <RegisterForm />
                    </UnprotectedRoute>
                }
            />

            {/* Protected Routes */}
            <Route
                path="/app"
                element={
                    <ProtectedRoute>
                        <ModernApp />
                    </ProtectedRoute>
                }
            />

            {/* Legacy redirects */}
            <Route path="/dashboard" element={<Navigate to="/app?tab=browse" replace />} />
            <Route path="/recipes" element={<Navigate to="/app?tab=browse" replace />} />
            <Route path="/recipes/new" element={<Navigate to="/app?tab=create" replace />} />
            <Route path="/profile" element={<Navigate to="/app?tab=profile" replace />} />

            {/* Recipe detail and edit still use separate pages for better UX */}
            <Route
                path="/recipes/:id"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <RecipeDetail />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/recipes/:id/edit"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <RecipeForm />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
    );
}; 