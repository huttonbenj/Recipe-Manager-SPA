import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/cn';
import { getThemeGradient } from '../../../utils/theme';

interface ThemeGradientProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary' | 'full';
}

export const ThemeGradient: React.FC<ThemeGradientProps> = ({
    children,
    className,
    variant = 'full'
}) => {
    const { theme } = useTheme();

    // Use the utility function to get the appropriate gradient for the current theme
    const gradientClass = getThemeGradient(theme.color, variant);

    return (
        <div className={cn(gradientClass, className)}>
            {children}
        </div>
    );
}; 