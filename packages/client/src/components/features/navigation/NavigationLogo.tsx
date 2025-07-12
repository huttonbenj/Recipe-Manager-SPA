import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeColors } from '../../../utils/theme';

export const NavigationLogo: React.FC = () => {
    const { theme } = useTheme();
    const themeColors = getThemeColors(theme.color);

    return (
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md"
                style={{
                    background: `linear-gradient(to bottom right, ${themeColors.primary}, ${themeColors.secondary})`
                }}
            >
                <ChefHat className="h-5 w-5" />
            </div>
            <div className="hidden md:block">
                <span className="font-display text-xl font-semibold text-surface-900 dark:text-surface-50">
                    Recipe<span style={{ color: themeColors.primary }}>Manager</span>
                </span>
            </div>
        </Link>
    );
}; 