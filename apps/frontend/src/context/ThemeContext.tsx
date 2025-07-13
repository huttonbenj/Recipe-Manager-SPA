import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

/**
 * Available color themes for the application
 */
export type ColorTheme = 'default' | 'emerald' | 'blue' | 'purple' | 'rose' | 'orange';

/**
 * Available display modes
 */
export type DisplayMode = 'light' | 'dark' | 'system';

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
    colorTheme: ColorTheme;
    displayMode: DisplayMode;
    isDark: boolean;
}

/**
 * Theme context value interface
 */
interface ThemeContextValue {
    theme: ThemeConfig;
    setColorTheme: (theme: ColorTheme) => void;
    setDisplayMode: (mode: DisplayMode) => void;
    toggleDisplayMode: () => void;
}

/**
 * Color theme definitions with CSS custom properties
 */
const COLOR_THEMES: Record<ColorTheme, Record<string, string>> = {
    default: {
        '--color-primary-50': '#f0f9ff',
        '--color-primary-100': '#e0f2fe',
        '--color-primary-200': '#bae6fd',
        '--color-primary-300': '#7dd3fc',
        '--color-primary-400': '#38bdf8',
        '--color-primary-500': '#0ea5e9',
        '--color-primary-600': '#0284c7',
        '--color-primary-700': '#0369a1',
        '--color-primary-800': '#075985',
        '--color-primary-900': '#0c4a6e',
        '--color-secondary-50': '#f8fafc',
        '--color-secondary-100': '#f1f5f9',
        '--color-secondary-200': '#e2e8f0',
        '--color-secondary-300': '#cbd5e1',
        '--color-secondary-400': '#94a3b8',
        '--color-secondary-500': '#64748b',
        '--color-secondary-600': '#475569',
        '--color-secondary-700': '#334155',
        '--color-secondary-800': '#1e293b',
        '--color-secondary-900': '#0f172a',
        '--color-accent-50': '#fef2f2',
        '--color-accent-100': '#fee2e2',
        '--color-accent-200': '#fecaca',
        '--color-accent-300': '#fca5a5',
        '--color-accent-400': '#f87171',
        '--color-accent-500': '#ef4444',
        '--color-accent-600': '#dc2626',
        '--color-accent-700': '#b91c1c',
        '--color-accent-800': '#991b1b',
        '--color-accent-900': '#7f1d1d',
    },
    emerald: {
        '--color-primary-50': '#ecfdf5',
        '--color-primary-100': '#d1fae5',
        '--color-primary-200': '#a7f3d0',
        '--color-primary-300': '#6ee7b7',
        '--color-primary-400': '#34d399',
        '--color-primary-500': '#10b981',
        '--color-primary-600': '#059669',
        '--color-primary-700': '#047857',
        '--color-primary-800': '#065f46',
        '--color-primary-900': '#064e3b',
        '--color-secondary-50': '#f8fafc',
        '--color-secondary-100': '#f1f5f9',
        '--color-secondary-200': '#e2e8f0',
        '--color-secondary-300': '#cbd5e1',
        '--color-secondary-400': '#94a3b8',
        '--color-secondary-500': '#64748b',
        '--color-secondary-600': '#475569',
        '--color-secondary-700': '#334155',
        '--color-secondary-800': '#1e293b',
        '--color-secondary-900': '#0f172a',
        '--color-accent-50': '#fffbeb',
        '--color-accent-100': '#fef3c7',
        '--color-accent-200': '#fde68a',
        '--color-accent-300': '#fcd34d',
        '--color-accent-400': '#fbbf24',
        '--color-accent-500': '#f59e0b',
        '--color-accent-600': '#d97706',
        '--color-accent-700': '#b45309',
        '--color-accent-800': '#92400e',
        '--color-accent-900': '#78350f',
    },
    blue: {
        '--color-primary-50': '#eff6ff',
        '--color-primary-100': '#dbeafe',
        '--color-primary-200': '#bfdbfe',
        '--color-primary-300': '#93c5fd',
        '--color-primary-400': '#60a5fa',
        '--color-primary-500': '#3b82f6',
        '--color-primary-600': '#2563eb',
        '--color-primary-700': '#1d4ed8',
        '--color-primary-800': '#1e40af',
        '--color-primary-900': '#1e3a8a',
        '--color-secondary-50': '#f8fafc',
        '--color-secondary-100': '#f1f5f9',
        '--color-secondary-200': '#e2e8f0',
        '--color-secondary-300': '#cbd5e1',
        '--color-secondary-400': '#94a3b8',
        '--color-secondary-500': '#64748b',
        '--color-secondary-600': '#475569',
        '--color-secondary-700': '#334155',
        '--color-secondary-800': '#1e293b',
        '--color-secondary-900': '#0f172a',
        '--color-accent-50': '#fdf4ff',
        '--color-accent-100': '#fae8ff',
        '--color-accent-200': '#f5d0fe',
        '--color-accent-300': '#f0abfc',
        '--color-accent-400': '#e879f9',
        '--color-accent-500': '#d946ef',
        '--color-accent-600': '#c026d3',
        '--color-accent-700': '#a21caf',
        '--color-accent-800': '#86198f',
        '--color-accent-900': '#701a75',
    },
    purple: {
        '--color-primary-50': '#faf5ff',
        '--color-primary-100': '#f3e8ff',
        '--color-primary-200': '#e9d5ff',
        '--color-primary-300': '#d8b4fe',
        '--color-primary-400': '#c084fc',
        '--color-primary-500': '#a855f7',
        '--color-primary-600': '#9333ea',
        '--color-primary-700': '#7c3aed',
        '--color-primary-800': '#6b21a8',
        '--color-primary-900': '#581c87',
        '--color-secondary-50': '#f8fafc',
        '--color-secondary-100': '#f1f5f9',
        '--color-secondary-200': '#e2e8f0',
        '--color-secondary-300': '#cbd5e1',
        '--color-secondary-400': '#94a3b8',
        '--color-secondary-500': '#64748b',
        '--color-secondary-600': '#475569',
        '--color-secondary-700': '#334155',
        '--color-secondary-800': '#1e293b',
        '--color-secondary-900': '#0f172a',
        '--color-accent-50': '#fff7ed',
        '--color-accent-100': '#ffedd5',
        '--color-accent-200': '#fed7aa',
        '--color-accent-300': '#fdba74',
        '--color-accent-400': '#fb923c',
        '--color-accent-500': '#f97316',
        '--color-accent-600': '#ea580c',
        '--color-accent-700': '#c2410c',
        '--color-accent-800': '#9a3412',
        '--color-accent-900': '#7c2d12',
    },
    rose: {
        '--color-primary-50': '#fff1f2',
        '--color-primary-100': '#ffe4e6',
        '--color-primary-200': '#fecdd3',
        '--color-primary-300': '#fda4af',
        '--color-primary-400': '#fb7185',
        '--color-primary-500': '#f43f5e',
        '--color-primary-600': '#e11d48',
        '--color-primary-700': '#be123c',
        '--color-primary-800': '#9f1239',
        '--color-primary-900': '#881337',
        '--color-secondary-50': '#f8fafc',
        '--color-secondary-100': '#f1f5f9',
        '--color-secondary-200': '#e2e8f0',
        '--color-secondary-300': '#cbd5e1',
        '--color-secondary-400': '#94a3b8',
        '--color-secondary-500': '#64748b',
        '--color-secondary-600': '#475569',
        '--color-secondary-700': '#334155',
        '--color-secondary-800': '#1e293b',
        '--color-secondary-900': '#0f172a',
        '--color-accent-50': '#f0fdf4',
        '--color-accent-100': '#dcfce7',
        '--color-accent-200': '#bbf7d0',
        '--color-accent-300': '#86efac',
        '--color-accent-400': '#4ade80',
        '--color-accent-500': '#22c55e',
        '--color-accent-600': '#16a34a',
        '--color-accent-700': '#15803d',
        '--color-accent-800': '#166534',
        '--color-accent-900': '#14532d',
    },
    orange: {
        '--color-primary-50': '#fff7ed',
        '--color-primary-100': '#ffedd5',
        '--color-primary-200': '#fed7aa',
        '--color-primary-300': '#fdba74',
        '--color-primary-400': '#fb923c',
        '--color-primary-500': '#f97316',
        '--color-primary-600': '#ea580c',
        '--color-primary-700': '#c2410c',
        '--color-primary-800': '#9a3412',
        '--color-primary-900': '#7c2d12',
        '--color-secondary-50': '#f8fafc',
        '--color-secondary-100': '#f1f5f9',
        '--color-secondary-200': '#e2e8f0',
        '--color-secondary-300': '#cbd5e1',
        '--color-secondary-400': '#94a3b8',
        '--color-secondary-500': '#64748b',
        '--color-secondary-600': '#475569',
        '--color-secondary-700': '#334155',
        '--color-secondary-800': '#1e293b',
        '--color-secondary-900': '#0f172a',
        '--color-accent-50': '#fefce8',
        '--color-accent-100': '#fef9c3',
        '--color-accent-200': '#fef08a',
        '--color-accent-300': '#fde047',
        '--color-accent-400': '#facc15',
        '--color-accent-500': '#eab308',
        '--color-accent-600': '#ca8a04',
        '--color-accent-700': '#a16207',
        '--color-accent-800': '#854d0e',
        '--color-accent-900': '#713f12',
    },
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Custom hook to use theme context
 */
export const useTheme = (): ThemeContextValue => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

/**
 * Theme provider component that manages application theme state
 * Handles light/dark mode switching and color theme selection
 * Persists theme preferences to localStorage
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    // Initialize theme state from localStorage or default
    const [theme, setTheme] = useState<ThemeConfig>(() => {
        const savedTheme = localStorage.getItem('theme');
        const savedColorTheme = localStorage.getItem('colorTheme') as ColorTheme || 'default';

        // Check for saved theme or use system preference
        if (savedTheme) {
            return {
                displayMode: savedTheme as DisplayMode,
                colorTheme: savedColorTheme,
                isDark: savedTheme === 'dark' ||
                    (savedTheme === 'system' &&
                        window.matchMedia('(prefers-color-scheme: dark)').matches)
            };
        }

        // Default to system preference
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return {
            displayMode: 'system',
            colorTheme: savedColorTheme,
            isDark: isDarkMode
        };
    });

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            if (theme.displayMode === 'system') {
                setTheme(prev => ({
                    ...prev,
                    isDark: e.matches
                }));
            }
        };

        // Add event listener
        mediaQuery.addEventListener('change', handleChange);

        // Cleanup
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme.displayMode]);

    // Apply theme changes to DOM
    useEffect(() => {
        // Add/remove dark class
        if (theme.isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Save preferences to localStorage
        localStorage.setItem('theme', theme.displayMode);
        localStorage.setItem('colorTheme', theme.colorTheme);

        // Apply color theme CSS variables
        const root = document.documentElement;

        // Add theme-switching class to disable transitions temporarily
        root.classList.add('theme-switching');

        // Apply the color theme variables
        Object.entries(COLOR_THEMES[theme.colorTheme]).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Re-enable transitions after a short delay
        setTimeout(() => {
            root.classList.remove('theme-switching');
        }, 100);
    }, [theme.isDark, theme.colorTheme, theme.displayMode]);

    /**
     * Set the color theme
     */
    const setColorTheme = (colorTheme: ColorTheme) => {
        setTheme(prev => ({ ...prev, colorTheme }));
    };

    /**
     * Set the display mode (light/dark/system)
     */
    const setDisplayMode = (displayMode: DisplayMode) => {
        const isDark = displayMode === 'dark' ||
            (displayMode === 'system' &&
                window.matchMedia('(prefers-color-scheme: dark)').matches);

        setTheme({ ...theme, displayMode, isDark });
    };

    /**
     * Toggle between light, dark, and system modes
     */
    const toggleDisplayMode = () => {
        const modes: DisplayMode[] = ['light', 'dark', 'system'];
        const currentIndex = modes.indexOf(theme.displayMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        const nextMode = modes[nextIndex];

        setDisplayMode(nextMode);
    };

    return (
        <ThemeContext.Provider value={{ theme, setColorTheme, setDisplayMode, toggleDisplayMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext; 