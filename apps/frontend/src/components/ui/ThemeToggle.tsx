import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, Monitor } from 'lucide-react';

/**
 * Props for ThemeToggle component
 */
interface ThemeToggleProps {
    className?: string;
    size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
    variant?: 'button' | 'icon' | 'minimal';
    onClick?: () => void;
}

/**
 * Theme toggle component for switching between light/dark/system modes
 * Enhanced with smooth transitions and animations
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    className = '',
    size = 'md',
    variant = 'icon',
    onClick,
}) => {
    const { theme, toggleDisplayMode } = useTheme();

    // Size classes
    const sizeClasses = {
        xxs: 'w-5 h-5 text-[10px]',
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
    } as const;

    // Get icon based on current mode
    const getIcon = () => {
        switch (theme.displayMode) {
            case 'light':
                return <Sun className="w-full h-full" />;
            case 'dark':
                return <Moon className="w-full h-full" />;
            case 'system':
                return <Monitor className="w-full h-full" />;
        }
    };

    // Get tooltip text
    const getTooltipText = () => {
        switch (theme.displayMode) {
            case 'light':
                return 'Switch to dark mode';
            case 'dark':
                return 'Switch to system mode';
            case 'system':
                return 'Switch to light mode';
        }
    };

    // Handle click with custom callback
    const handleClick = () => {
        toggleDisplayMode();
        if (onClick) onClick();
    };

    // Button variant
    if (variant === 'button') {
        return (
            <button
                onClick={handleClick}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg
                    bg-secondary-100 hover:bg-secondary-200
                    dark:bg-secondary-800 dark:hover:bg-secondary-700
                    text-secondary-900 dark:text-secondary-100
                    transition-all duration-200 shadow-sm
                    ${className}
                `}
                title={getTooltipText()}
                aria-label={`Current theme: ${theme.displayMode}. ${getTooltipText()}`}
            >
                <span className={`flex-shrink-0 ${sizeClasses[size]} p-1`}>
                    {getIcon()}
                </span>
                <span className="capitalize font-medium">
                    {theme.displayMode}
                </span>
            </button>
        );
    }

    // Minimal variant (just the icon with no background)
    if (variant === 'minimal') {
        return (
            <button
                onClick={handleClick}
                className={`
                    flex items-center justify-center rounded-lg
                    text-secondary-700 hover:text-secondary-900
                    dark:text-secondary-300 dark:hover:text-secondary-100
                    transition-all duration-200 hover:scale-110
                    ${sizeClasses[size]}
                    ${className}
                `}
                title={getTooltipText()}
                aria-label={`Current theme: ${theme.displayMode}. ${getTooltipText()}`}
            >
                {getIcon()}
            </button>
        );
    }

    // Default icon variant
    return (
        <button
            onClick={handleClick}
            className={`
                flex items-center justify-center rounded-lg
                bg-secondary-100 hover:bg-secondary-200
                dark:bg-secondary-800 dark:hover:bg-secondary-700
                text-secondary-700 hover:text-secondary-900
                dark:text-secondary-300 dark:hover:text-secondary-100
                transition-all duration-200 hover:scale-105
                shadow-sm
                ${sizeClasses[size]}
                ${className}
            `}
            title={getTooltipText()}
            aria-label={`Current theme: ${theme.displayMode}. ${getTooltipText()}`}
        >
            {getIcon()}
        </button>
    );
}; 