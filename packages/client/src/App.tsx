import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { CLIENT_CONFIG, QUERY_CONFIG } from '@recipe-manager/shared';
import { AuthProvider } from './contexts/AuthProvider';
import { ProtectedRoute } from './components/features/auth/ProtectedRoute';
import { Layout } from './components/Layout';

// Pages
import { LoginForm } from './components/features/auth/LoginForm';
import { RegisterForm } from './components/features/auth/RegisterForm';
import { Dashboard } from './components/Dashboard';
import { RecipeList } from './components/RecipeList';
import { RecipeDetail } from './components/RecipeDetail';
import { RecipeForm } from './components/RecipeForm';
import { UserProfile } from './components/UserProfile';
// Error Boundary
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Styles
import './App.css';

// Query Client Setup
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: QUERY_CONFIG.RETRY.DEFAULT,
            refetchOnWindowFocus: false,
            staleTime: QUERY_CONFIG.STALE_TIME.DEFAULT,
        },
        mutations: {
            retry: QUERY_CONFIG.RETRY.MUTATIONS,
        },
    },
});

function App() {
    return (
        <ErrorBoundary>
            <HelmetProvider>
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <AuthProvider>
                            <div className="min-h-screen bg-gray-50">
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

                                {/* Toast Notifications */}
                                <Toaster
                                    position="top-right"
                                    toastOptions={{
                                        duration: CLIENT_CONFIG.TOAST_DURATION.DEFAULT,
                                        style: {
                                            background: '#363636',
                                            color: '#fff',
                                        },
                                        success: {
                                            duration: CLIENT_CONFIG.TOAST_DURATION.SUCCESS,
                                            iconTheme: {
                                                primary: '#10b981',
                                                secondary: '#ffffff',
                                            },
                                        },
                                        error: {
                                            duration: CLIENT_CONFIG.TOAST_DURATION.ERROR,
                                            iconTheme: {
                                                primary: '#ef4444',
                                                secondary: '#ffffff',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </AuthProvider>
                    </Router>

                    {/* React Query DevTools */}
                    {(import.meta as any).env?.MODE === 'development' && (
                        <ReactQueryDevtools initialIsOpen={false} />
                    )}
                </QueryClientProvider>
            </HelmetProvider>
        </ErrorBoundary>
    );
}

export default App; 