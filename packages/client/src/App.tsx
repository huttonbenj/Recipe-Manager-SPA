import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './components/Dashboard';
import { RecipeList } from './components/RecipeList';
import { RecipeDetail } from './components/RecipeDetail';
import { RecipeForm } from './components/RecipeForm';
import { useAuth } from './hooks/useAuth';

function AppContent() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />}
            />
            <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterForm />}
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/recipes"
                element={
                    <ProtectedRoute>
                        <RecipeList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/recipes/new"
                element={
                    <ProtectedRoute>
                        <RecipeForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/recipes/:id"
                element={
                    <ProtectedRoute>
                        <RecipeDetail />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/recipes/:id/edit"
                element={
                    <ProtectedRoute>
                        <RecipeForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/"
                element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
            />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App; 