import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeColors } from '../../../../utils/theme';
import { cn } from '../../../../utils/cn';

interface LoginFormSubmitButtonProps {
    isLoading: boolean;
}

export const LoginFormSubmitButton = ({ isLoading }: LoginFormSubmitButtonProps) => {
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);

    return (
        <button
            type="submit"
            disabled={isLoading}
            className={cn(
                "group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white",
                "focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-white/50",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                "shadow-lg hover:shadow-xl"
            )}
            style={{
                background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})`
            } as React.CSSProperties}
            onMouseEnter={(e) => {
                if (!isLoading) {
                    e.currentTarget.style.background = `linear-gradient(to right, ${themeColors.primary}dd, ${themeColors.secondary}dd)`;
                }
            }}
            onMouseLeave={(e) => {
                if (!isLoading) {
                    e.currentTarget.style.background = `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})`;
                }
            }}
        >
            {isLoading ? (
                <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Signing in...
                </>
            ) : (
                'Sign in'
            )}
        </button>
    );
}; 