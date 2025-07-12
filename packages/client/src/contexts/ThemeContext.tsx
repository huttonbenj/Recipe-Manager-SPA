import React, { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@recipe-manager/shared';

type ThemeMode = 'light' | 'dark' | 'system';
type ThemeColor = 'default' | 'royal' | 'ocean' | 'forest' | 'sunset';

interface ThemeState {
    mode: ThemeMode;
    color: ThemeColor;
}

interface ThemeContextType {
    theme: ThemeState;
    setThemeMode: (mode: ThemeMode) => void;
    setThemeColor: (color: ThemeColor) => void;
    isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeState>(() => {
        // Get theme mode from localStorage or default to 'system'
        const savedMode = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
        // Get theme color from localStorage or default to 'default'
        const savedColor = localStorage.getItem(STORAGE_KEYS.THEME_COLOR);

        return {
            mode: (savedMode as ThemeMode) || 'system',
            color: (savedColor as ThemeColor) || 'default'
        };
    });

    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            // Check for saved theme or system preference
            const savedMode = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
            if (savedMode === 'dark') return true;
            if (savedMode === 'light') return false;

            // Check system preference
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    // Update the theme mode when it changes
    const setThemeMode = (newMode: ThemeMode) => {
        setThemeState(prev => ({ ...prev, mode: newMode }));
        localStorage.setItem(STORAGE_KEYS.THEME_MODE, newMode);
    };

    // Update the theme color when it changes
    const setThemeColor = (newColor: ThemeColor) => {
        setThemeState(prev => ({ ...prev, color: newColor }));
        localStorage.setItem(STORAGE_KEYS.THEME_COLOR, newColor);
    };

    // Effect to handle theme changes and system preference changes
    useEffect(() => {
        const root = window.document.documentElement;

        // Add transition class for smooth theme changes
        root.classList.add('transition-colors', 'duration-300');

        // Remove all theme classes first
        root.classList.remove('light', 'dark', 'theme-default', 'theme-royal', 'theme-ocean', 'theme-forest', 'theme-sunset');

        // Determine if dark mode should be active
        let isDark = false;

        if (theme.mode === 'system') {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            // Listen for system preference changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => {
                setIsDarkMode(e.matches);
                // Update classes when system preference changes
                root.classList.remove('light', 'dark');
                root.classList.add(e.matches ? 'dark' : 'light');
            };

            mediaQuery.addEventListener('change', handleChange);

            // Clean up listener when component unmounts or theme changes
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
            isDark = theme.mode === 'dark';
        }

        // Apply light/dark mode class
        root.classList.add(isDark ? 'dark' : 'light');

        // Apply color theme class
        root.classList.add(`theme-${theme.color}`);

        // Update dark mode state
        setIsDarkMode(isDark);

        // Log for debugging
        console.log('Theme applied:', {
            mode: theme.mode,
            color: theme.color,
            isDark,
            classes: root.classList.toString()
        });

        // Return empty cleanup function for non-system theme paths
        return () => { };
    }, [theme.mode, theme.color]);

    return (
        <ThemeContext.Provider value={{ theme, setThemeMode, setThemeColor, isDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Export theme color type for use in other components
export type { ThemeColor }; 