import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getThemeColors } from '../../../../utils/theme';

export const RegisterFormFooter = () => {
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);

    return (
        <div className="text-center">
            <p className="text-sm text-surface-600 dark:text-surface-400">
                Already have an account?{' '}
                <Link
                    to="/login"
                    className="font-medium transition-colors duration-200"
                    style={{ color: themeColors.primary }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = `${themeColors.primary}dd`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = themeColors.primary;
                    }}
                >
                    Sign in here
                </Link>
            </p>
        </div>
    );
}; 