import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
import { Layout } from './Layout';

// Pages
import { LoginForm } from '../features/auth/login';
import { RegisterForm } from '../features/auth/register';
import { Dashboard } from '../features/dashboard';
import { RecipeList } from '../features/recipes/RecipeList';
import { RecipeDetail } from '../features/recipes/RecipeDetail';
import { RecipeForm } from '../features/recipes/RecipeForm';
import { UserProfile } from '../features/user-profile';

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            {/* Protected Routes */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Navigate to="/dashboard" replace />
                        </Layout>
                    </ProtectedRoute>
                }
            />

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
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}; 