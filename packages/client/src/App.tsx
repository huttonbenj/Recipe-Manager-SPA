import { AuthProvider } from './contexts/AuthProvider';
import { AuthPage } from './components/auth/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './components/Dashboard';

function App() {
    // Simple routing without React Router for now - will implement proper routing next
    const currentPath = window.location.pathname;

    const renderContent = () => {
        if (currentPath === '/auth') {
            return <AuthPage />;
        }

        // Default to dashboard (protected)
        return (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        );
    };

    return (
        <AuthProvider>
            {renderContent()}
        </AuthProvider>
    );
}

export default App; 