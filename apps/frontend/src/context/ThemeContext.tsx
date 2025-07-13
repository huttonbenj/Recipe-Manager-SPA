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
    // Initialize theme from localStorage or defaults
    const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
        const saved = localStorage.getItem('color-theme');
        return (saved as ColorTheme) || 'default';
    });

    const [displayMode, setDisplayModeState] = useState<DisplayMode>(() => {
        const saved = localStorage.getItem('display-mode');
        return (saved as DisplayMode) || 'system';
    });

    // Determine if dark mode should be active
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (displayMode === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return displayMode === 'dark';
    });

    // Listen for system theme changes when in system mode
    useEffect(() => {
        if (displayMode !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDark(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [displayMode]);

    // Update isDark when displayMode changes
    useEffect(() => {
        if (displayMode === 'system') {
            setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
        } else {
            setIsDark(displayMode === 'dark');
        }
    }, [displayMode]);

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;

        // Apply color theme CSS custom properties
        const colors = COLOR_THEMES[colorTheme];
        Object.entries(colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Apply dark mode class
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [colorTheme, isDark]);

    // Save preferences to localStorage
    useEffect(() => {
        localStorage.setItem('color-theme', colorTheme);
    }, [colorTheme]);

    useEffect(() => {
        localStorage.setItem('display-mode', displayMode);
    }, [displayMode]);

    const setColorTheme = (theme: ColorTheme) => {
        setColorThemeState(theme);
    };

    const setDisplayMode = (mode: DisplayMode) => {
        setDisplayModeState(mode);
    };

    const toggleDisplayMode = () => {
        if (displayMode === 'light') {
            setDisplayMode('dark');
        } else if (displayMode === 'dark') {
            setDisplayMode('system');
        } else {
            setDisplayMode('light');
        }
    };

    const theme: ThemeConfig = {
        colorTheme,
        displayMode,
        isDark,
    };

    const value: ThemeContextValue = {
        theme,
        setColorTheme,
        setDisplayMode,
        toggleDisplayMode,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}; 