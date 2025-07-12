import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
import { UnprotectedRoute } from '../features/auth/UnprotectedRoute';
import { Layout } from './Layout';

// Pages
import { LoginForm } from '../features/auth/login';
import { RegisterForm } from '../features/auth/register';
import { LandingPage } from '../features/landing/LandingPage';
import { Dashboard } from '../features/dashboard';
import { RecipeList } from '../features/recipes/RecipeList';
import { RecipeDetail } from '../features/recipes/RecipeDetail';
import { RecipeForm } from '../features/recipes/RecipeForm';
import { UserProfile } from '../features/user-profile';

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
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/recipes"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <RecipeList />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/recipes/new"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <RecipeForm />
                        </Layout>
                    </ProtectedRoute>
                }
            />

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

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <UserProfile />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}; 