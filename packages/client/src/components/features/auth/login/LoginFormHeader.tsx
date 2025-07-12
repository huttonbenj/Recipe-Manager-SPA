import { Link } from 'react-router-dom';
import { ChefHat, Sparkles } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeColors } from '../../../../utils/theme';
import { cn } from '../../../../utils/cn';

export const LoginFormHeader = () => {
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);

    return (
        <div className="text-center space-y-6">
            {/* Modern logo with animation */}
            <div className="relative mx-auto">
                <div
                    className="absolute inset-0 rounded-full blur-sm animate-pulse"
                    style={{
                        background: `linear-gradient(to bottom right, ${themeColors.primary}, ${themeColors.secondary})`
                    }}
                />
                <div
                    className="relative h-16 w-16 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                        background: `linear-gradient(to bottom right, ${themeColors.primary}, ${themeColors.secondary})`
                    }}
                >
                    <ChefHat className="h-8 w-8 text-white" />
                </div>
                <div
                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center"
                    style={{
                        background: `linear-gradient(to bottom right, ${themeColors.secondary}, ${themeColors.primary})`
                    }}
                >
                    <Sparkles className="h-3 w-3 text-white" />
                </div>
            </div>

            {/* Modern heading */}
            <div className="space-y-2">
                <h2
                    className={cn(
                        "text-3xl font-bold font-display text-surface-900 dark:text-surface-50",
                        "bg-clip-text text-transparent"
                    )}
                    style={{
                        background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    Welcome Back
                </h2>
                <p className="text-surface-600 dark:text-surface-400 text-lg">
                    Sign in to your culinary journey
                </p>
            </div>

            {/* Modern CTA */}
            <div className="text-sm text-surface-600 dark:text-surface-400">
                Don't have an account?{' '}
                <Link
                    to="/register"
                    className={cn(
                        "relative group inline-block transition-colors duration-200"
                    )}
                    style={{ color: themeColors.primary }}
                >
                    Create one now
                    <span
                        className="absolute -bottom-0.5 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                        style={{
                            background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})`
                        }}
                    />
                </Link>
            </div>
        </div>
    );
}; 