import React from 'react';
import { Navigation } from '../features/navigation';
import { Footer } from './Footer';
import { PageTransitionScale } from '../ui/PageTransition';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex min-h-screen flex-col bg-surface-50 text-surface-900 dark:bg-surface-950 dark:text-surface-50 transition-colors duration-200">
            <Navigation />

            <main className="flex-grow">
                <PageTransitionScale>
                    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </PageTransitionScale>
            </main>

            <Footer />
        </div>
    );
}; 