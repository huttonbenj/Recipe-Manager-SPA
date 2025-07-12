import React from 'react';
import { Navigation } from '../features/navigation';
import { Footer } from './Footer';
import { PageTransitionScale } from '../ui/PageTransition';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import { cn } from '../../utils/cn';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeColors } from '../../utils/theme';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);

    return (
        <div className="flex min-h-screen flex-col bg-surface-50 text-surface-900 dark:bg-surface-950 dark:text-surface-50 transition-colors duration-300">
            <Navigation />

            {isHomePage && (
                <div className="relative overflow-hidden">
                    {/* Hero Background with gradient overlay */}
                    <div className={cn(
                        "absolute inset-0 z-0",
                        `bg-gradient-to-br from-${themeColors.primary}/10 to-${themeColors.secondary}/10 dark:from-${themeColors.primary}/20 dark:to-${themeColors.secondary}/20`
                    )}></div>

                    {/* Decorative elements */}
                    <div className={cn(
                        "absolute top-20 right-[10%] w-72 h-72 rounded-full blur-3xl",
                        `bg-${themeColors.primary}-300/20 dark:bg-${themeColors.primary}-600/10`
                    )}></div>
                    <div className={cn(
                        "absolute bottom-10 left-[5%] w-64 h-64 rounded-full blur-3xl",
                        `bg-${themeColors.secondary}-300/20 dark:bg-${themeColors.secondary}-600/10`
                    )}></div>

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