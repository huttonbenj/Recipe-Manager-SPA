import React, { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@recipe-manager/shared';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        // Get theme from localStorage or default to 'system'
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        return (savedTheme as Theme) || 'system';
    });

    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            // Check for saved theme or system preference
            const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
            if (savedTheme === 'dark') return true;
            if (savedTheme === 'light') return false;

            // Check system preference
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    // Update the theme when it changes
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    };

    // Effect to handle theme changes and system preference changes
    useEffect(() => {
        const root = window.document.documentElement;

        // Remove previous theme class
        root.classList.remove('light', 'dark');

        // Determine if dark mode should be active
        let isDark = false;

        if (theme === 'system') {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            // Listen for system preference changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => {
                setIsDarkMode(e.matches);
                root.classList.toggle('dark', e.matches);
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
            isDark = theme === 'dark';
        }

        // Apply theme class
        root.classList.add(isDark ? 'dark' : 'light');
        setIsDarkMode(isDark);

        // Return empty cleanup function for non-system theme paths
        return () => { };
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
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