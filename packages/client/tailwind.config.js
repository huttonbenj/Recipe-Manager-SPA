import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import aspectRatio from '@tailwindcss/aspect-ratio';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        // Add brand color classes to safelist
        'bg-brand-50', 'bg-brand-100', 'bg-brand-200', 'bg-brand-300', 'bg-brand-400',
        'bg-brand-500', 'bg-brand-600', 'bg-brand-700', 'bg-brand-800', 'bg-brand-900', 'bg-brand-950',
        'text-brand-50', 'text-brand-100', 'text-brand-200', 'text-brand-300', 'text-brand-400',
        'text-brand-500', 'text-brand-600', 'text-brand-700', 'text-brand-800', 'text-brand-900', 'text-brand-950',
        'border-brand-50', 'border-brand-100', 'border-brand-200', 'border-brand-300', 'border-brand-400',
        'border-brand-500', 'border-brand-600', 'border-brand-700', 'border-brand-800', 'border-brand-900', 'border-brand-950',

        // Add surface color classes to safelist
        'bg-surface-50', 'bg-surface-100', 'bg-surface-200', 'bg-surface-300', 'bg-surface-400',
        'bg-surface-500', 'bg-surface-600', 'bg-surface-700', 'bg-surface-800', 'bg-surface-900', 'bg-surface-950',
        'text-surface-50', 'text-surface-100', 'text-surface-200', 'text-surface-300', 'text-surface-400',
        'text-surface-500', 'text-surface-600', 'text-surface-700', 'text-surface-800', 'text-surface-900', 'text-surface-950',
        'border-surface-50', 'border-surface-100', 'border-surface-200', 'border-surface-300', 'border-surface-400',
        'border-surface-500', 'border-surface-600', 'border-surface-700', 'border-surface-800', 'border-surface-900', 'border-surface-950',

        // Add dark mode variants
        'dark:bg-brand-50', 'dark:bg-brand-100', 'dark:bg-brand-200', 'dark:bg-brand-300', 'dark:bg-brand-400',
        'dark:bg-brand-500', 'dark:bg-brand-600', 'dark:bg-brand-700', 'dark:bg-brand-800', 'dark:bg-brand-900', 'dark:bg-brand-950',
        'dark:text-brand-50', 'dark:text-brand-100', 'dark:text-brand-200', 'dark:text-brand-300', 'dark:text-brand-400',
        'dark:text-brand-500', 'dark:text-brand-600', 'dark:text-brand-700', 'dark:text-brand-800', 'dark:text-brand-900', 'dark:text-brand-950',
        'dark:border-brand-50', 'dark:border-brand-100', 'dark:border-brand-200', 'dark:border-brand-300', 'dark:border-brand-400',
        'dark:border-brand-500', 'dark:border-brand-600', 'dark:border-brand-700', 'dark:border-brand-800', 'dark:border-brand-900', 'dark:border-brand-950',

        'dark:bg-surface-50', 'dark:bg-surface-100', 'dark:bg-surface-200', 'dark:bg-surface-300', 'dark:bg-surface-400',
        'dark:bg-surface-500', 'dark:bg-surface-600', 'dark:bg-surface-700', 'dark:bg-surface-800', 'dark:bg-surface-900', 'dark:bg-surface-950',
        'dark:text-surface-50', 'dark:text-surface-100', 'dark:text-surface-200', 'dark:text-surface-300', 'dark:text-surface-400',
        'dark:text-surface-500', 'dark:text-surface-600', 'dark:text-surface-700', 'dark:text-surface-800', 'dark:text-surface-900', 'dark:text-surface-950',
        'dark:border-surface-50', 'dark:border-surface-100', 'dark:border-surface-200', 'dark:border-surface-300', 'dark:border-surface-400',
        'dark:border-surface-500', 'dark:border-surface-600', 'dark:border-surface-700', 'dark:border-surface-800', 'dark:border-surface-900', 'dark:border-surface-950',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
                display: ['Playfair Display', 'serif'],
            },
            colors: {
                // Brand colors - Mint/Teal
                brand: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                    950: '#022c22',
                },
                // Accent color - Warm Orange
                accent: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    950: '#431407',
                },
                // Surface colors - Zinc for better dark mode
                surface: {
                    50: '#fafafa',
                    100: '#f4f4f5',
                    200: '#e4e4e7',
                    300: '#d4d4d8',
                    400: '#a1a1aa',
                    500: '#71717a',
                    600: '#52525b',
                    700: '#3f3f46',
                    800: '#27272a',
                    900: '#18181b',
                    950: '#09090b',
                },
                // Success colors
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                },
                // Warning colors
                warning: {
                    50: '#fefce8',
                    100: '#fef9c3',
                    200: '#fef08a',
                    300: '#fde047',
                    400: '#facc15',
                    500: '#eab308',
                    600: '#ca8a04',
                    700: '#a16207',
                    800: '#854d0e',
                    900: '#713f12',
                    950: '#422006',
                },
                // Error colors
                error: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                    950: '#450a0a',
                },
            },
            borderRadius: {
                'xs': 'var(--radius-sm)',
                'sm': 'var(--radius-sm)',
                'md': 'var(--radius)',
                'lg': 'var(--radius-md)',
                'xl': 'var(--radius-lg)',
                '2xl': 'var(--radius-xl)',
                '3xl': 'var(--radius-2xl)',
                'full': 'var(--radius-full)',
            },
            boxShadow: {
                'sm': 'var(--shadow-sm)',
                DEFAULT: 'var(--shadow)',
                'md': 'var(--shadow-md)',
                'lg': 'var(--shadow-lg)',
                'xl': 'var(--shadow-xl)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'slide-down': 'slideDown 0.4s ease-out',
                'slide-in-right': 'slideInRight 0.4s ease-out',
                'slide-in-left': 'slideInLeft 0.4s ease-out',
                'bounce-soft': 'bounceSoft 2s infinite',
                'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideInLeft: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                bounceSoft: {
                    '0%, 100%': {
                        transform: 'translateY(-2%)',
                        animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
                    },
                    '50%': {
                        transform: 'translateY(0)',
                        animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
                    },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.85' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'gradient-diagonal': 'linear-gradient(to right bottom, var(--tw-gradient-stops))',
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: '65ch',
                        color: 'var(--tw-prose-body)',
                        lineHeight: '1.75',
                        h1: {
                            fontFamily: 'Playfair Display, serif',
                        },
                        h2: {
                            fontFamily: 'Playfair Display, serif',
                        },
                        h3: {
                            fontFamily: 'Playfair Display, serif',
                        },
                        h4: {
                            fontFamily: 'Playfair Display, serif',
                        },
                    },
                },
            },
        },
    },
    plugins: [
        forms,
        typography,
        aspectRatio,
    ],
} 