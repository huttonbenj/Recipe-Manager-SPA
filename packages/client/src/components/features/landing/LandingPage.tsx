import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { PageTransitionScale } from '../../ui/PageTransition';
import { ChefHat, Utensils, Users, Heart, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { ThemeToggle } from '../../ui/ThemeToggle';
import { cn } from '../../../utils/cn';

export const LandingPage: React.FC = () => {
    const { theme } = useTheme();

    return (
        <PageTransitionScale>
            <div className="min-h-screen">
                {/* Header */}
                <header className="relative z-10 py-20 md:py-32 overflow-hidden">
                    <div className="container mx-auto px-6 text-center relative z-10">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 blur-sm animate-pulse"></div>
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-accent-600 text-white shadow-lg">
                                    <ChefHat className="h-8 w-8" />
                                </div>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-accent-600 dark:from-brand-400 dark:to-accent-400">
                            Recipe Manager
                        </h1>

                        <h2 className="text-3xl md:text-5xl font-bold text-surface-900 dark:text-surface-50 leading-tight max-w-4xl mx-auto">
                            Your Digital Cookbook, <span className="relative">Reimagined
                                <span className="absolute bottom-0 left-0 w-full h-2 bg-accent-400/30 dark:bg-accent-500/30 -z-10"></span>
                            </span>
                        </h2>

                        <p className="mt-8 text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
                            Discover, create, and share your favorite recipes with a community of food lovers.
                            All your culinary creations, perfectly organized in one place.
                        </p>

                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register">
                                <Button
                                    variant="gradient"
                                    size="lg"
                                    className="px-8 py-6 text-lg group"
                                    rightIcon={<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
                                >
                                    Get Started for Free
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 py-6 text-lg"
                                >
                                    Sign In
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-16 flex flex-wrap justify-center gap-8">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-brand-500" />
                                <span className="text-surface-600 dark:text-surface-300">10K+ Users</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Utensils className="h-5 w-5 text-brand-500" />
                                <span className="text-surface-600 dark:text-surface-300">50K+ Recipes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-accent-500" />
                                <span className="text-surface-600 dark:text-surface-300">4.9/5 Rating</span>
                            </div>
                        </div>

                        <div className="mt-16">
                            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                                <span className="text-surface-600 dark:text-surface-300">Try our themes:</span>
                                <div className="flex items-center gap-2">
                                    <ThemeToggle variant="dropdown" />
                                    <ThemeToggle variant="color" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Features Section */}
                <section className="py-24 relative">
                    {/* Background decorations */}
                    <div className="absolute inset-0 bg-surface-100/50 dark:bg-surface-800/50 -z-10"></div>
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-300 dark:via-surface-600 to-transparent"></div>
                    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-300 dark:via-surface-600 to-transparent"></div>

                    <div className="container mx-auto px-6">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Sparkles className={cn(
                                "h-6 w-6",
                                theme.color === 'royal' ? "text-royal-brand-500" : "text-brand-500"
                            )} />
                            <h3 className={cn(
                                "text-lg font-semibold uppercase tracking-wider",
                                theme.color === 'royal' ? "text-royal-brand-500" : "text-brand-500"
                            )}>
                                Features
                            </h3>
                        </div>

                        <h3 className="text-4xl font-bold text-center mb-16 text-surface-900 dark:text-surface-50">
                            Why You'll Love <span className={cn(
                                "bg-clip-text text-transparent bg-gradient-to-r",
                                theme.color === 'royal'
                                    ? "from-royal-brand-500 to-royal-accent-500"
                                    : "from-brand-500 to-accent-500"
                            )}>Culinary Canvas</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                            {/* Feature 1 */}
                            <div className={cn(
                                "rounded-xl p-6 transition-all",
                                "bg-white/50 dark:bg-surface-900/50",
                                "border border-surface-200 dark:border-surface-700",
                                "hover:shadow-md hover:-translate-y-1"
                            )}>
                                <div className={cn(
                                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto",
                                    "bg-gradient-to-br",
                                    theme.color === 'royal'
                                        ? "from-royal-brand-500 to-royal-brand-600"
                                        : "from-brand-500 to-brand-600"
                                )}>
                                    <ChefHat className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-xl font-semibold mb-4 text-surface-900 dark:text-surface-100 text-center">Create & Organize</h4>
                                <p className="text-surface-600 dark:text-surface-300 text-center">
                                    Easily add your own recipes with detailed instructions, ingredients, and photos. Keep everything neatly organized and accessible.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className={cn(
                                "rounded-xl p-6 transition-all",
                                "bg-white/50 dark:bg-surface-900/50",
                                "border border-surface-200 dark:border-surface-700",
                                "hover:shadow-md hover:-translate-y-1"
                            )}>
                                <div className={cn(
                                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto",
                                    "bg-gradient-to-br",
                                    theme.color === 'royal'
                                        ? "from-royal-accent-500 to-royal-accent-600"
                                        : "from-accent-500 to-accent-600"
                                )}>
                                    <Utensils className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-xl font-semibold mb-4 text-surface-900 dark:text-surface-100 text-center">Discover & Explore</h4>
                                <p className="text-surface-600 dark:text-surface-300 text-center">
                                    Get inspired by a vast collection of community-created recipes. Find your next favorite meal with powerful search and filtering.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className={cn(
                                "rounded-xl p-6 transition-all",
                                "bg-white/50 dark:bg-surface-900/50",
                                "border border-surface-200 dark:border-surface-700",
                                "hover:shadow-md hover:-translate-y-1"
                            )}>
                                <div className={cn(
                                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto",
                                    "bg-gradient-to-br",
                                    theme.color === 'royal'
                                        ? "from-royal-brand-600 to-royal-accent-500"
                                        : "from-brand-600 to-accent-500"
                                )}>
                                    <Heart className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-xl font-semibold mb-4 text-surface-900 dark:text-surface-100 text-center">Share & Connect</h4>
                                <p className="text-surface-600 dark:text-surface-300 text-center">
                                    Share your culinary masterpieces with friends, family, and the community. Get feedback and build your reputation as a chef.
                                </p>
                            </div>
                        </div>

                        <div className="mt-16 text-center">
                            <Link to="/register">
                                <Button
                                    variant={theme.color === 'royal' ? 'primary' : 'gradient'}
                                    size="lg"
                                    className={cn(
                                        "px-8 py-3",
                                        theme.color === 'royal' && "bg-royal-brand-500 hover:bg-royal-brand-600"
                                    )}
                                >
                                    Start Cooking Today
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </PageTransitionScale>
    );
}; 