import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTheme } from '../../hooks/useTheme';
import { ThemeProvider } from '../../context/ThemeContext';

/**
 * Test wrapper component that provides theme context
 */
const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider>
        {children}
    </ThemeProvider>
);

describe('useTheme', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();

        // Reset any applied classes
        document.documentElement.classList.remove('dark');
    });

    it('provides default theme configuration', () => {
        const { result } = renderHook(() => useTheme(), { wrapper });

        expect(result.current.theme).toEqual({
            colorTheme: 'default',
            displayMode: 'dark',
            isDark: true,
        });

        expect(typeof result.current.setColorTheme).toBe('function');
        expect(typeof result.current.setDisplayMode).toBe('function');
        expect(typeof result.current.toggleDisplayMode).toBe('function');
    });

    it('throws error when used outside ThemeProvider', () => {
        expect(() => {
            renderHook(() => useTheme());
        }).toThrow('useTheme must be used within a ThemeProvider');
    });

    it('allows changing color theme', () => {
        const { result } = renderHook(() => useTheme(), { wrapper });

        act(() => {
            result.current.setColorTheme('emerald');
        });

        expect(result.current.theme.colorTheme).toBe('emerald');
    });

    it('allows changing display mode', () => {
        const { result } = renderHook(() => useTheme(), { wrapper });

        act(() => {
            result.current.setDisplayMode('dark');
        });

        expect(result.current.theme.displayMode).toBe('dark');
        expect(result.current.theme.isDark).toBe(true);
    });

    it('toggles display mode correctly', () => {
        const { result } = renderHook(() => useTheme(), { wrapper });

        // Start with dark mode
        expect(result.current.theme.displayMode).toBe('dark');

        // First toggle: dark -> system
        act(() => {
            result.current.toggleDisplayMode();
        });
        expect(result.current.theme.displayMode).toBe('system');

        // Second toggle: system -> light
        act(() => {
            result.current.toggleDisplayMode();
        });
        expect(result.current.theme.displayMode).toBe('light');
        expect(result.current.theme.isDark).toBe(false);

        // Third toggle: light -> dark
        act(() => {
            result.current.toggleDisplayMode();
        });
        expect(result.current.theme.displayMode).toBe('dark');
        expect(result.current.theme.isDark).toBe(true);
    });

    it('persists theme preferences to localStorage', async () => {
        const { result } = renderHook(() => useTheme(), { wrapper });

        act(() => {
            result.current.setColorTheme('purple');
            result.current.setDisplayMode('dark');
        });

        // Wait for effects to flush
        await waitFor(() => {
            expect(result.current.theme.colorTheme).toBe('purple');
            expect(result.current.theme.displayMode).toBe('dark');
        });

        // Check localStorage persistence
        expect(localStorage.getItem('colorTheme')).toBe('purple');
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('loads theme preferences from localStorage', () => {
        // Set up localStorage before rendering
        localStorage.setItem('colorTheme', 'rose');
        localStorage.setItem('theme', 'light');

        const { result } = renderHook(() => useTheme(), { wrapper });

        expect(result.current.theme.colorTheme).toBe('rose');
        expect(result.current.theme.displayMode).toBe('light');
    });

    it('handles invalid localStorage values gracefully', () => {
        // Set invalid values in localStorage
        localStorage.setItem('colorTheme', 'invalid-theme');
        localStorage.setItem('theme', 'invalid-mode');

        const { result } = renderHook(() => useTheme(), { wrapper });

        // Should fall back to defaults
        expect(result.current.theme.colorTheme).toBe('default');
        expect(result.current.theme.displayMode).toBe('dark');
    });
}); 