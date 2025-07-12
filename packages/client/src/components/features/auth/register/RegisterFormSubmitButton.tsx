import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeColors } from '../../../../utils/theme';
import { cn } from '../../../../utils/cn';

interface RegisterFormSubmitButtonProps {
    isLoading: boolean;
}

export const RegisterFormSubmitButton = ({ isLoading }: RegisterFormSubmitButtonProps) => {
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);

    return (
        <button
            type="submit"
            disabled={isLoading}
            className={cn(
                "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            style={{
                backgroundColor: themeColors.primary,
                '--tw-ring-color': themeColors.primary
            } as React.CSSProperties}
            onMouseEnter={(e) => {
                if (!isLoading) {
                    e.currentTarget.style.backgroundColor = `${themeColors.primary}dd`;
                }
            }}
            onMouseLeave={(e) => {
                if (!isLoading) {
                    e.currentTarget.style.backgroundColor = themeColors.primary;
                }
            }}
        >
            {isLoading ? (
                <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Creating account...
                </>
            ) : (
                'Create account'
            )}
        </button>
    );
}; 