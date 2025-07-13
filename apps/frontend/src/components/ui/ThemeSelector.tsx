import React, { useState } from 'react';
import { useTheme, type ColorTheme } from '../../hooks/useTheme';

/**
 * Props for ThemeSelector component
 */
interface ThemeSelectorProps {
    className?: string;
    compact?: boolean;
}

/**
 * Color theme information for display
 */
const THEME_INFO: Record<ColorTheme, { name: string; colors: string[] }> = {
    default: {
        name: 'Ocean Blue',
        colors: ['#0ea5e9', '#64748b', '#ef4444'],
    },
    emerald: {
        name: 'Emerald Forest',
        colors: ['#10b981', '#64748b', '#f59e0b'],
    },
    blue: {
        name: 'Royal Blue',
        colors: ['#3b82f6', '#64748b', '#d946ef'],
    },
    purple: {
        name: 'Purple Haze',
        colors: ['#a855f7', '#64748b', '#f97316'],
    },
    rose: {
        name: 'Rose Garden',
        colors: ['#f43f5e', '#64748b', '#22c55e'],
    },
    orange: {
        name: 'Sunset Orange',
        colors: ['#f97316', '#64748b', '#eab308'],
    },
};

/**
 * Theme selector component for choosing color themes
 * Displays color swatches and theme names
 */
export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    className = '',
    compact = false,
}) => {
    const { theme, setColorTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const currentThemeInfo = THEME_INFO[theme.colorTheme];

    if (compact) {
        return (
            <div className={`relative ${className}`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="
            flex items-center gap-2 px-3 py-2 rounded-lg
            bg-secondary-100 hover:bg-secondary-200
            dark:bg-secondary-800 dark:hover:bg-secondary-700
            text-secondary-900 dark:text-secondary-100
            transition-all duration-200
          "
                    aria-label="Select color theme"
                >
                    <div className="flex gap-1">
                        {currentThemeInfo.colors.map((color, index) => (
                            <div
                                key={index}
                                className="w-3 h-3 rounded-full border border-secondary-300 dark:border-secondary-600"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                    <svg
                        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="
            absolute top-full left-0 mt-2 z-50
            bg-white dark:bg-secondary-800
            border border-secondary-200 dark:border-secondary-700
            rounded-lg shadow-lg
            min-w-max
          ">
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
                                    <svg className="w-4 h-4 text-primary-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {isOpen && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                Color Theme
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(THEME_INFO).map(([themeKey, info]) => (
                    <button
                        key={themeKey}
                        onClick={() => setColorTheme(themeKey as ColorTheme)}
                        className={`
              group relative p-4 rounded-xl border-2 transition-all duration-200
              ${theme.colorTheme === themeKey
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600 bg-white dark:bg-secondary-800'
                            }
            `}
                    >
                        <div className="space-y-3">
                            <div className="flex justify-center gap-1">
                                {info.colors.map((color, index) => (
                                    <div
                                        key={index}
                                        className="w-6 h-6 rounded-full border border-secondary-300 dark:border-secondary-600"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                                    {info.name}
                                </p>
                            </div>
                        </div>
                        {theme.colorTheme === themeKey && (
                            <div className="absolute top-2 right-2">
                                <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}; 