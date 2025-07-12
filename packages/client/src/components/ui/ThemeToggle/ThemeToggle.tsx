import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check, ChevronDown, Palette } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { cn } from '../../../utils/cn';

interface ThemeToggleProps {
    className?: string;
    variant?: 'button' | 'switch' | 'dropdown' | 'compact' | 'color';
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
    const { theme, setThemeMode, setThemeColor, isDarkMode } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [isColorOpen, setIsColorOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const colorDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
            if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target as Node)) {
                setIsColorOpen(false);
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
        if (theme.mode === 'light') {
            setThemeMode('dark');
        } else if (theme.mode === 'dark') {
            setThemeMode('system');
        } else {
            setThemeMode('light');
        }

        setTimeout(() => setIsAnimating(false), 300);
    };

    const selectThemeMode = (newMode: 'light' | 'dark' | 'system') => {
        setIsAnimating(true);
        setThemeMode(newMode);
        setIsOpen(false);
        setTimeout(() => setIsAnimating(false), 300);
    };

    const toggleColorTheme = () => {
        if (variant === 'color') {
            setIsColorOpen(!isColorOpen);
            return;
        }
    };

    const selectThemeColor = (newColor: 'default' | 'royal') => {
        setIsAnimating(true);
        setThemeColor(newColor);
        setIsColorOpen(false);
        setTimeout(() => setIsAnimating(false), 300);
    };

    const getThemeLabel = () => {
        switch (theme.mode) {
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

    const getColorThemeLabel = () => {
        switch (theme.color) {
            case 'default':
                return 'Teal';
            case 'royal':
                return 'Royal Purple';
            default:
                return 'Teal';
        }
    };

    const getThemeIcon = () => {
        if (theme.mode === 'system') {
            return <Monitor className="h-full w-full" />;
        }
        return isDarkMode ? <Moon className="h-full w-full" /> : <Sun className="h-full w-full" />;
    };

    const getColorThemeIcon = () => {
        return <Palette className="h-full w-full" />;
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

    // Color theme toggle
    if (variant === 'color') {
        return (
            <div className="relative" ref={colorDropdownRef}>
                <button
                    onClick={toggleColorTheme}
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
                    aria-label="Change color theme"
                    type="button"
                >
                    <div className={cn(
                        "relative flex items-center justify-center",
                        iconSizeStyles[size],
                    )}>
                        {getColorThemeIcon()}
                    </div>

                    {showLabel && (
                        <span className={cn("ml-2 font-medium", textSizeStyles[size])}>
                            {getColorThemeLabel()}
                        </span>
                    )}

                    <ChevronDown className={cn("ml-1 h-3 w-3 transition-transform", isColorOpen && "rotate-180")} />
                </button>

                {isColorOpen && (
                    <div className={cn(
                        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-surface-200 bg-white p-1 text-surface-950 shadow-md animate-in fade-in-80 dark:border-surface-800 dark:bg-surface-950 dark:text-surface-50",
                        positionStyles[position]
                    )}>
                        <button
                            onClick={() => selectThemeColor('default')}
                            className={cn(
                                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-surface-100 dark:hover:bg-surface-800",
                                theme.color === 'default' && "bg-surface-100 dark:bg-surface-800"
                            )}
                        >
                            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                <span className="h-full w-full rounded-full bg-gradient-to-br from-brand-500 to-accent-500" />
                            </span>
                            <span>Teal & Orange</span>
                            {theme.color === 'default' && (
                                <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                    <Check className="h-4 w-4" />
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => selectThemeColor('royal')}
                            className={cn(
                                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-surface-100 dark:hover:bg-surface-800",
                                theme.color === 'royal' && "bg-surface-100 dark:bg-surface-800"
                            )}
                        >
                            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                <span className="h-full w-full rounded-full bg-gradient-to-br from-brand-500 to-accent-500" />
                            </span>
                            <span>Royal Purple & Gold</span>
                            {theme.color === 'royal' && (
                                <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                    <Check className="h-4 w-4" />
                                </span>
                            )}
                        </button>
                    </div>
                )}
            </div>
        );
    }

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
                aria-label={`Switch to ${theme.mode === 'light' ? 'dark' : theme.mode === 'dark' ? 'system' : 'light'} mode`}
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
                            {theme.mode === 'system' && (
                                <Monitor className={cn(
                                    "absolute transition-all duration-300",
                                    theme.mode === 'system' ? "rotate-0 scale-100" : "rotate-90 scale-0"
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

                {showSystemIndicator && theme.mode === 'system' && (
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

                {showSystemIndicator && theme.mode === 'system' && (
                    <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
                )}
            </div>
        );
    }

    // Dropdown variant
    if (variant === 'dropdown') {
        return (
            <div className="relative" ref={dropdownRef}>
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
                    aria-label="Change theme"
                    type="button"
                >
                    <div className={cn(
                        "relative flex items-center justify-center",
                        iconSizeStyles[size],
                    )}>
                        {getThemeIcon()}
                    </div>

                    {showLabel && (
                        <span className={cn("ml-2 font-medium", textSizeStyles[size])}>
                            {getThemeLabel()}
                        </span>
                    )}

                    <ChevronDown className={cn("ml-1 h-3 w-3 transition-transform", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                    <div className={cn(
                        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-surface-200 bg-white p-1 text-surface-950 shadow-md animate-in fade-in-80 dark:border-surface-800 dark:bg-surface-950 dark:text-surface-50",
                        positionStyles[position]
                    )}>
                        <button
                            onClick={() => selectThemeMode('light')}
                            className={cn(
                                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-surface-100 dark:hover:bg-surface-800",
                                theme.mode === 'light' && "bg-surface-100 dark:bg-surface-800"
                            )}
                        >
                            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                <Sun className="h-4 w-4" />
                            </span>
                            <span>Light</span>
                            {theme.mode === 'light' && (
                                <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                    <Check className="h-4 w-4" />
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => selectThemeMode('dark')}
                            className={cn(
                                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-surface-100 dark:hover:bg-surface-800",
                                theme.mode === 'dark' && "bg-surface-100 dark:bg-surface-800"
                            )}
                        >
                            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                <Moon className="h-4 w-4" />
                            </span>
                            <span>Dark</span>
                            {theme.mode === 'dark' && (
                                <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                    <Check className="h-4 w-4" />
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => selectThemeMode('system')}
                            className={cn(
                                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-surface-100 dark:hover:bg-surface-800",
                                theme.mode === 'system' && "bg-surface-100 dark:bg-surface-800"
                            )}
                        >
                            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                <Monitor className="h-4 w-4" />
                            </span>
                            <span>System</span>
                            {theme.mode === 'system' && (
                                <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                    <Check className="h-4 w-4" />
                                </span>
                            )}
                        </button>
                    </div>
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
                aria-label={`Switch to ${theme.mode === 'light' ? 'dark' : theme.mode === 'dark' ? 'system' : 'light'} mode`}
                type="button"
            >
                {getThemeIcon()}
            </button>
        );
    }

    return null;
};

ThemeToggle.displayName = 'ThemeToggle'; 