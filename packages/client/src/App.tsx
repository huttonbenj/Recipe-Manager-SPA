import { AppProviders, AppRoutes } from './components/app';

function App() {
    return (
        <AppProviders>
            <div className="min-h-screen bg-gray-50">
                <AppRoutes />
            </div>
        </AppProviders>
    );
}

export default App; 