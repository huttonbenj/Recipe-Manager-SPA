import React from 'react';
import { useTheme } from '../../hooks/useTheme';

/**
 * Props for ThemeToggle component
 */
interface ThemeToggleProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'button' | 'icon';
}

/**
 * Theme toggle component for switching between light/dark/system modes
 * Cycles through: light -> dark -> system -> light
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    className = '',
    size = 'md',
    variant = 'icon',
}) => {
    const { theme, toggleDisplayMode } = useTheme();

    // Size classes
    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
    };

    // Get icon based on current mode
    const getIcon = () => {
        switch (theme.displayMode) {
            case 'light':
                return (
                    <svg
                        className="w-full h-full"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                );
            case 'dark':
                return (
                    <svg
                        className="w-full h-full"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                    </svg>
                );
            case 'system':
                return (
                    <svg
                        className="w-full h-full"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                );
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

    if (variant === 'button') {
        return (
            <button
                onClick={toggleDisplayMode}
                className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          bg-secondary-100 hover:bg-secondary-200
          dark:bg-secondary-800 dark:hover:bg-secondary-700
          text-secondary-900 dark:text-secondary-100
          transition-all duration-200
          ${className}
        `}
                title={getTooltipText()}
                aria-label={`Current theme: ${theme.displayMode}. ${getTooltipText()}`}
            >
                <span className={sizeClasses[size]}>
                    {getIcon()}
                </span>
                <span className="capitalize font-medium">
                    {theme.displayMode}
                </span>
            </button>
        );
    }

    return (
        <button
            onClick={toggleDisplayMode}
            className={`
        flex items-center justify-center rounded-lg
        bg-secondary-100 hover:bg-secondary-200
        dark:bg-secondary-800 dark:hover:bg-secondary-700
        text-secondary-700 hover:text-secondary-900
        dark:text-secondary-300 dark:hover:text-secondary-100
        transition-all duration-200
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