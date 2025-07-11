import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check, ChevronDown } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/cn';

interface ThemeToggleProps {
    className?: string;
    variant?: 'button' | 'switch' | 'dropdown' | 'compact';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    showSystemIndicator?: boolean;
    animation?: 'rotate' | 'fade' | 'slide' | 'scale';
    rounded?: 'sm' | 'md' | 'lg' | 'full';
    position?: 'left' | 'right' | 'top' | 'bottom';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    className,
    variant = 'button',
    size = 'md',
    showLabel = false,
    showSystemIndicator = true,
    animation = 'rotate',
    rounded = 'md',
    position = 'bottom',
}) => {
    const { theme, setTheme, isDarkMode } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTheme = () => {
        if (variant === 'dropdown') {
            setIsOpen(!isOpen);
            return;
        }

        setIsAnimating(true);
        if (theme === 'light') {
            setTheme('dark');
        } else if (theme === 'dark') {
            setTheme('system');
        } else {
            setTheme('light');
        }

        setTimeout(() => setIsAnimating(false), 300);
    };

    const selectTheme = (newTheme: 'light' | 'dark' | 'system') => {
        setIsAnimating(true);
        setTheme(newTheme);
        setIsOpen(false);
        setTimeout(() => setIsAnimating(false), 300);
    };

    const getThemeLabel = () => {
        switch (theme) {
            case 'light':
                return 'Light';
            case 'dark':
                return 'Dark';
            case 'system':
                return 'System';
            default:
                return isDarkMode ? 'Dark' : 'Light';
        }
    };

    const getThemeIcon = () => {
        if (theme === 'system') {
            return <Monitor className="h-full w-full" />;
        }
        return isDarkMode ? <Moon className="h-full w-full" /> : <Sun className="h-full w-full" />;
    };

    const sizeStyles = {
        sm: 'h-8 w-8',
        md: 'h-9 w-9',
        lg: 'h-10 w-10',
    };

    const textSizeStyles = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    const iconSizeStyles = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    const roundedStyles = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };

    const animationStyles = {
        rotate: 'transition-all duration-300 ease-in-out',
        fade: 'transition-all duration-200 ease-in-out',
        slide: 'transition-all duration-300 ease-out',
        scale: 'transition-all duration-200 ease-out',
    };

    const positionStyles = {
        left: 'right-0 origin-top-right',
        right: 'left-0 origin-top-left',
        top: 'top-full mt-2',
        bottom: 'bottom-full mb-2',
    };

    // Button variant
    if (variant === 'button') {
        return (
            <button
                onClick={toggleTheme}
                className={cn(
                    "relative flex items-center justify-center border border-surface-200 bg-white text-sm font-medium ring-offset-white transition-all hover:bg-surface-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    "dark:border-surface-800 dark:bg-surface-900 dark:hover:bg-surface-800 dark:ring-offset-surface-950",
                    sizeStyles[size],
                    roundedStyles[rounded],
                    animationStyles[animation],
                    showLabel && "px-3 w-auto",
                    isAnimating && "scale-95",
                    className
                )}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
                type="button"
            >
                <div className={cn(
                    "relative flex items-center justify-center",
                    iconSizeStyles[size],
                    animation === 'rotate' && "transition-transform duration-300",
                    animation === 'fade' && "transition-opacity duration-200",
                    animation === 'scale' && "transition-transform duration-200",
                )}>
                    {animation === 'rotate' && (
                        <>
                            <Sun className={cn(
                                "absolute transition-all duration-300",
                                isDarkMode ? "rotate-90 scale-0" : "rotate-0 scale-100"
                            )} />
                            <Moon className={cn(
                                "absolute transition-all duration-300",
                                isDarkMode ? "rotate-0 scale-100" : "-rotate-90 scale-0"
                            )} />
                            {theme === 'system' && (
                                <Monitor className={cn(
                                    "absolute transition-all duration-300",
                                    theme === 'system' ? "rotate-0 scale-100" : "rotate-90 scale-0"
                                )} />
                            )}
                        </>
                    )}
                    {animation !== 'rotate' && getThemeIcon()}
                </div>

                {showLabel && (
                    <span className={cn("ml-2 font-medium", textSizeStyles[size])}>
                        {getThemeLabel()}
                    </span>
                )}

                {showSystemIndicator && theme === 'system' && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
                )}
            </button>
        );
    }

    // Switch variant
    if (variant === 'switch') {
        return (
            <div className={cn("flex items-center space-x-3", className)}>
                <label htmlFor="theme-switch" className={cn(
                    "relative inline-flex cursor-pointer items-center",
                    sizeStyles[size]
                )}>
                    <input
                        id="theme-switch"
                        type="checkbox"
                        className="sr-only"
                        checked={isDarkMode}
                        onChange={toggleTheme}
                    />
                    <div className={cn(
                        "relative h-6 w-11 rounded-full bg-surface-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:bg-surface-700",
                        isDarkMode && "bg-brand-500 dark:bg-brand-600",
                        roundedStyles[rounded]
                    )}>
                        <div className={cn(
                            "absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out",
                            isDarkMode && "translate-x-5"
                        )}>
                            <div className="flex h-full w-full items-center justify-center">
                                {isDarkMode ? (
                                    <Moon className="h-2.5 w-2.5 text-surface-600" />
                                ) : (
                                    <Sun className="h-2.5 w-2.5 text-surface-600" />
                                )}
                            </div>
                        </div>
                    </div>
                </label>

                {showLabel && (
                    <span className={cn("font-medium text-surface-900 dark:text-surface-50", textSizeStyles[size])}>
                        {getThemeLabel()}
                    </span>
                )}

                {showSystemIndicator && theme === 'system' && (
                    <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
                )}
            </div>
        );
    }

    // Compact variant
    if (variant === 'compact') {
        return (
            <button
                onClick={toggleTheme}
                className={cn(
                    "relative flex items-center justify-center text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-50 transition-colors",
                    iconSizeStyles[size],
                    animationStyles[animation],
                    isAnimating && "scale-95",
                    className
                )}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
                type="button"
            >
                {getThemeIcon()}
                {showSystemIndicator && theme === 'system' && (
                    <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
                )}
            </button>
        );
    }

    // Dropdown variant
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleTheme}
                className={cn(
                    "relative flex items-center justify-center border border-surface-200 bg-white text-sm font-medium ring-offset-white transition-all hover:bg-surface-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    "dark:border-surface-800 dark:bg-surface-900 dark:hover:bg-surface-800 dark:ring-offset-surface-950",
                    sizeStyles[size],
                    roundedStyles[rounded],
                    showLabel && "px-3 w-auto",
                    className
                )}
                aria-label="Toggle theme"
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <div className={cn("relative flex items-center justify-center", iconSizeStyles[size])}>
                    {getThemeIcon()}
                </div>

                {showLabel && (
                    <span className={cn("ml-2 font-medium", textSizeStyles[size])}>
                        {getThemeLabel()}
                    </span>
                )}

                <ChevronDown className={cn(
                    "ml-1 h-3 w-3 transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />

                {showSystemIndicator && theme === 'system' && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className={cn(
                    "absolute z-50 mt-1 w-32 origin-top-right rounded-md bg-white dark:bg-surface-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
                    "border border-surface-200 dark:border-surface-700",
                    "animate-in slide-in-from-top-2 duration-200",
                    positionStyles[position]
                )}>
                    {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'system', label: 'System', icon: Monitor },
                    ].map((option) => {
                        const Icon = option.icon;
                        return (
                            <button
                                key={option.value}
                                onClick={() => selectTheme(option.value as 'light' | 'dark' | 'system')}
                                className={cn(
                                    "flex w-full items-center px-3 py-2 text-sm text-surface-900 dark:text-surface-50 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors",
                                    theme === option.value && "bg-surface-50 dark:bg-surface-800"
                                )}
                            >
                                <Icon className="mr-2 h-4 w-4" />
                                <span className="flex-1">{option.label}</span>
                                {theme === option.value && (
                                    <Check className="h-4 w-4 text-brand-500" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

ThemeToggle.displayName = 'ThemeToggle'; 