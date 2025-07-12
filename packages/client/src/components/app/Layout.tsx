import React from 'react';
import { Navigation } from '../features/navigation';
import { Footer } from './Footer';
import { PageTransitionScale } from '../ui/PageTransition';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import { cn } from '../../utils/cn';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className="flex min-h-screen flex-col bg-surface-50 text-surface-900 dark:bg-surface-950 dark:text-surface-50 transition-colors duration-300">
            <Navigation />

            {isHomePage && (
                <div className="relative overflow-hidden">
                    {/* Hero Background with gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-accent-500/10 dark:from-brand-500/20 dark:to-accent-500/20 z-0"></div>

                    {/* Decorative elements */}
                    <div className="absolute top-20 right-[10%] w-72 h-72 bg-brand-300/20 dark:bg-brand-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-[5%] w-64 h-64 bg-accent-300/20 dark:bg-accent-600/10 rounded-full blur-3xl"></div>

                    {/* Theme toggle positioned absolutely for easy access */}
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                        <ThemeToggle variant="dropdown" />
                        <ThemeToggle variant="color" />
                    </div>
                </div>
            )}

            <main className={cn(
                "flex-grow",
                isHomePage && "relative z-10"
            )}>
                <PageTransitionScale>
                    <div className={cn(
                        "container mx-auto px-4 py-8 sm:px-6 lg:px-8",
                        isHomePage && "pt-0"
                    )}>
                        {children}
                    </div>
                </PageTransitionScale>
            </main>

            <Footer />
        </div>
    );
}; 