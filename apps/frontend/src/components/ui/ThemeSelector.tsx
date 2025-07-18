import React, { useState, useRef, useEffect } from 'react';
import { useTheme, type ColorTheme } from '../../hooks/useTheme';
import { Check, ChevronDown } from 'lucide-react';

/**
 * Props for ThemeSelector component
 */
interface ThemeSelectorProps {
    className?: string;
    compact?: boolean;
    variant?: 'dropdown' | 'grid';
}

/**
 * Color theme information for display
 */
const THEME_INFO: Record<ColorTheme, { name: string; colors: string[]; primaryColor: string }> = {
    default: {
        name: 'Ocean Blue',
        colors: ['#0ea5e9', '#64748b', '#ef4444'],
        primaryColor: '#0ea5e9',
    },
    emerald: {
        name: 'Emerald Forest',
        colors: ['#10b981', '#64748b', '#f59e0b'],
        primaryColor: '#10b981',
    },
    blue: {
        name: 'Royal Blue',
        colors: ['#3b82f6', '#64748b', '#d946ef'],
        primaryColor: '#3b82f6',
    },
    purple: {
        name: 'Purple Haze',
        colors: ['#a855f7', '#64748b', '#f97316'],
        primaryColor: '#a855f7',
    },
    rose: {
        name: 'Rose Garden',
        colors: ['#f43f5e', '#64748b', '#22c55e'],
        primaryColor: '#f43f5e',
    },
    orange: {
        name: 'Sunset Orange',
        colors: ['#f97316', '#64748b', '#eab308'],
        primaryColor: '#f97316',
    },
    sunset: {
        name: 'Amber Sunset',
        colors: ['#f59e0b', '#475569', '#0ea5e9'],
        primaryColor: '#f59e0b',
    },
    teal: {
        name: 'Deep Teal',
        colors: ['#14b8a6', '#475569', '#06b6d4'],
        primaryColor: '#14b8a6',
    },
    crimson: {
        name: 'Crimson Red',
        colors: ['#ef4444', '#475569', '#f43f5e'],
        primaryColor: '#ef4444',
    },
    violet: {
        name: 'Lush Violet',
        colors: ['#8b5cf6', '#475569', '#ec4899'],
        primaryColor: '#8b5cf6',
    },
    green: {
        name: 'Forest Green',
        colors: ['#22c55e', '#475569', '#16a34a'],
        primaryColor: '#22c55e',
    },
    pink: {
        name: 'Cotton Candy',
        colors: ['#ec4899', '#475569', '#f472b6'],
        primaryColor: '#ec4899',
    },
};

/**
 * Theme selector component for choosing color themes
 * Displays color swatches and theme names
 */
export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    className = '',
    compact = false,
    variant = 'dropdown',
}) => {
    const { theme, setColorTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentThemeInfo = THEME_INFO[theme.colorTheme];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Dropdown variant
    if (variant === 'dropdown' || compact) {
        return (
            <div className={`relative ${className}`} ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="
                        flex items-center gap-2 px-3 py-2 rounded-lg
                        bg-secondary-100/60 hover:bg-secondary-100/80
                        dark:bg-white/10 dark:hover:bg-white/20
                        backdrop-blur-md
                        text-secondary-900 dark:text-secondary-100
                        transition-all duration-200 shadow-sm
                    "
                    aria-label="Select color theme"
                    aria-expanded={isOpen}
                    aria-controls="theme-selector-dropdown"
                >
                    <div className="flex gap-1">
                        {currentThemeInfo.colors.map((color, index) => (
                            <div
                                key={index}
                                className="w-3 h-3 rounded-full border border-secondary-300 dark:border-secondary-600"
                                style={{ backgroundColor: color }}
                                aria-hidden="true"
                            />
                        ))}
                    </div>
                    {!compact && (
                        <span className="text-sm font-medium">
                            {currentThemeInfo.name}
                        </span>
                    )}
                    <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {isOpen && (
                    <div
                        id="theme-selector-dropdown"
                        className="
                            absolute top-full left-0 mt-2 z-50
                            bg-white dark:bg-secondary-800
                            border border-secondary-200 dark:border-secondary-700
                            rounded-lg shadow-lg
                            min-w-max
                            animate-fade-in
                        "
                        role="menu"
                    >
                        {Object.entries(THEME_INFO).map(([themeKey, info]) => (
                            <button
                                key={themeKey}
                                onClick={() => {
                                    setColorTheme(themeKey as ColorTheme);
                                    setIsOpen(false);
                                }}
                                className={`
                                    flex items-center gap-3 w-full px-4 py-3 text-left
                                    hover:bg-secondary-100 dark:hover:bg-secondary-700
                                    transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg
                                    ${theme.colorTheme === themeKey ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                                `}
                                role="menuitem"
                            >
                                <div className="flex gap-1">
                                    {info.colors.map((color, index) => (
                                        <div
                                            key={index}
                                            className="w-4 h-4 rounded-full border border-secondary-300 dark:border-secondary-600"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                                    {info.name}
                                </span>
                                {theme.colorTheme === themeKey && (
                                    <Check className="w-4 h-4 text-primary-500 ml-auto" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Grid variant
    return (
        <div className={`space-y-2 ${className}`}>
            <div className="grid grid-cols-4 gap-2">
                {Object.entries(THEME_INFO).map(([themeKey, info]) => (
                    <button
                        key={themeKey}
                        onClick={() => setColorTheme(themeKey as ColorTheme)}
                        className={`
                            group relative p-2 rounded-lg transition-all duration-200 min-h-[80px] flex flex-col justify-between backdrop-blur-sm
                            ${theme.colorTheme === themeKey
                                ? 'border-2 border-primary-500 bg-gradient-to-br from-secondary-100/90 to-secondary-50/90 dark:from-primary-500/20 dark:to-primary-500/10 shadow-lg scale-[1.02] dark:border-primary-400'
                                : 'border border-secondary-200/40 dark:border-transparent bg-secondary-200/50 dark:bg-white/5 hover:border-primary-300 dark:hover:border-primary-400 hover:bg-secondary-200/70 dark:hover:bg-white/10 hover:shadow-md hover:scale-[1.01]'
                            }
                        `}
                        style={{
                            boxShadow:
                                theme.colorTheme === themeKey
                                    ? '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                                    : '0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                        }}
                        aria-label={`Select ${info.name} theme`}
                        aria-pressed={theme.colorTheme === themeKey}
                    >
                        <div className="flex justify-center gap-1 mb-1">
                            {info.colors.map((color, index) => (
                                <div
                                    key={index}
                                    className={`w-4 h-4 rounded-full shadow-sm transition-all duration-200 border-2 ${theme.colorTheme === themeKey
                                        ? 'scale-105 shadow-md border-white dark:border-white/80'
                                        : 'border-white/60 dark:border-secondary-600 group-hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                        <div className="text-center">
                            <p
                                className={`text-xs font-medium leading-tight transition-colors ${theme.colorTheme === themeKey
                                    ? 'text-primary-600 dark:text-primary-300'
                                    : 'text-secondary-800 dark:text-secondary-300 group-hover:text-secondary-900 dark:group-hover:text-white'
                                    }`}
                                style={theme.colorTheme === themeKey ? { color: info.primaryColor } : {}}
                            >
                                {info.name}
                            </p>
                        </div>
                        {theme.colorTheme === themeKey && (
                            <div className="absolute top-1 right-1">
                                <div className="bg-primary-500 rounded-full p-0.5 shadow-sm">
                                    <Check className="w-2 h-2 text-white" />
                                </div>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ThemeSelector; 