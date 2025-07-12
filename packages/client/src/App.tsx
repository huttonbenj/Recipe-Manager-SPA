import { AppProviders, AppRoutes } from './components/app';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
    return (
        <AppProviders>
            <div className="min-h-screen bg-surface-50 text-surface-900 dark:bg-surface-950 dark:text-surface-50 antialiased transition-colors duration-200">
                <ScrollToTop />
                <AppRoutes />
            </div>
        </AppProviders>
    );
}

export default App; 