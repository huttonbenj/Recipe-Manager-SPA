import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/cn';
import { getThemeTextColor } from '../../../utils/theme';

interface ThemeTextProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary';
    hover?: boolean;
}

export const ThemeText: React.FC<ThemeTextProps> = ({
    children,
    className,
    variant = 'primary',
    hover = false
}) => {
    const { theme } = useTheme();

    const getColorClasses = () => {
        // Get the base text color for the current theme and variant
        const baseColor = getThemeTextColor(theme.color, variant);

        // Add hover classes if needed
        if (!hover) return baseColor;

        // Get the appropriate hover classes based on theme and variant
        const colors = {
            default: {
                primary: 'hover:text-emerald-600 dark:hover:text-emerald-300',
                secondary: 'hover:text-orange-600 dark:hover:text-orange-300'
            },
            royal: {
                primary: 'hover:text-purple-700 dark:hover:text-purple-300',
                secondary: 'hover:text-amber-600 dark:hover:text-amber-300'
            },
            ocean: {
                primary: 'hover:text-blue-700 dark:hover:text-blue-300',
                secondary: 'hover:text-cyan-600 dark:hover:text-cyan-300'
            },
            forest: {
                primary: 'hover:text-green-700 dark:hover:text-green-300',
                secondary: 'hover:text-lime-600 dark:hover:text-lime-300'
            },
            sunset: {
                primary: 'hover:text-orange-700 dark:hover:text-orange-300',
                secondary: 'hover:text-pink-600 dark:hover:text-pink-300'
            }
        };

        return `${baseColor} ${colors[theme.color][variant]}`;
    };

    return (
        <span className={cn(getColorClasses(), className)}>
            {children}
        </span>
    );
}; 