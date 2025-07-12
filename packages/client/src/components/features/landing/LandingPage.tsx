import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { PageTransitionScale } from '../../ui/PageTransition';

export const LandingPage: React.FC = () => {
    return (
        <PageTransitionScale>
            <div className="bg-surface-100 dark:bg-surface-900 min-h-screen">
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm shadow-sm">
                    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
                            Recipe Manager
                        </h1>
                        <nav className="space-x-4">
                            <Link to="/login">
                                <Button variant="ghost">Log In</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Sign Up</Button>
                            </Link>
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="container mx-auto px-6 pt-32 pb-16 text-center">
                    <h2 className="text-5xl font-extrabold text-surface-900 dark:text-surface-50 leading-tight">
                        Your Digital Cookbook, Reimagined
                    </h2>
                    <p className="mt-6 text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
                        Discover, create, and share your favorite recipes with a community of food lovers. All your culinary creations, perfectly organized in one place.
                    </p>
                    <div className="mt-10">
                        <Link to="/register">
                            <Button size="lg" className="px-10 py-4 text-lg">
                                Get Started for Free
                            </Button>
                        </Link>
                    </div>
                </main>

                {/* Features Section */}
                <section className="py-20 bg-surface-50 dark:bg-surface-800">
                    <div className="container mx-auto px-6">
                        <h3 className="text-4xl font-bold text-center mb-12 text-surface-900 dark:text-surface-50">
                            Why You'll Love Recipe Manager
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {/* Feature 1 */}
                            <div className="text-center">
                                <h4 className="text-2xl font-semibold mb-4 text-surface-900 dark:text-surface-100">Create & Organize</h4>
                                <p className="text-surface-600 dark:text-surface-300">
                                    Easily add your own recipes with detailed instructions, ingredients, and photos. Keep everything neatly organized and accessible.
                                </p>
                            </div>
                            {/* Feature 2 */}
                            <div className="text-center">
                                <h4 className="text-2xl font-semibold mb-4 text-surface-900 dark:text-surface-100">Discover & Explore</h4>
                                <p className="text-surface-600 dark:text-surface-300">
                                    Get inspired by a vast collection of community-created recipes. Find your next favorite meal with powerful search and filtering.
                                </p>
                            </div>
                            {/* Feature 3 */}
                            <div className="text-center">
                                <h4 className="text-2xl font-semibold mb-4 text-surface-900 dark:text-surface-100">Share & Connect</h4>
                                <p className="text-surface-600 dark:text-surface-300">
                                    Share your culinary masterpieces with friends, family, and the community. Get feedback and build your reputation as a chef.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PageTransitionScale>
    );
}; 