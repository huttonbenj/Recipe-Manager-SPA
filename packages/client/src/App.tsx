import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/Layout';

// Pages
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Dashboard } from './components/Dashboard';
import { RecipeList } from './components/RecipeList';
import { RecipeDetail } from './components/RecipeDetail';
import { RecipeForm } from './components/RecipeForm';
import { UserProfile } from './components/UserProfile';
// Error Boundary
import { ErrorBoundary } from './components/ErrorBoundary';

// Styles
import './App.css';

// Query Client Setup
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
        mutations: {
            retry: false,
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
                                        duration: 4000,
                                        style: {
                                            background: '#363636',
                                            color: '#fff',
                                        },
                                        success: {
                                            duration: 3000,
                                            iconTheme: {
                                                primary: '#10b981',
                                                secondary: '#ffffff',
                                            },
                                        },
                                        error: {
                                            duration: 5000,
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