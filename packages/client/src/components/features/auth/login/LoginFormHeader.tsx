import { Link } from 'react-router-dom';
import { ChefHat, Sparkles } from 'lucide-react';
import { cn } from '../../../../utils/cn';

export const LoginFormHeader = () => {
    return (
        <div className="text-center space-y-6">
            {/* Modern logo with animation */}
            <div className="relative mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 blur-sm animate-pulse" />
                <div className="relative h-16 w-16 bg-gradient-to-br from-brand-600 to-accent-600 rounded-full flex items-center justify-center shadow-lg">
                    <ChefHat className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-br from-accent-500 to-brand-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                </div>
            </div>

            {/* Modern heading */}
            <div className="space-y-2">
                <h2 className={cn(
                    "text-3xl font-bold font-display text-surface-900 dark:text-surface-50",
                    "bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent"
                )}>
                    Welcome Back
                </h2>
                <p className="text-surface-600 dark:text-surface-400 text-lg">
                    Sign in to your culinary journey
                </p>
            </div>

            {/* Modern CTA */}
            <div className="flex items-center justify-center">
                <p className="text-surface-600 dark:text-surface-400">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className={cn(
                            "font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300",
                            "transition-all duration-200 hover:scale-105",
                            "relative group"
                        )}
                    >
                        Create one now
                        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-accent-500 group-hover:w-full transition-all duration-300" />
                    </Link>
                </p>
            </div>
        </div>
    );
}; 