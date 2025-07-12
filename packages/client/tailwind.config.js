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

        // Add accent color classes to safelist
        'bg-accent-50', 'bg-accent-100', 'bg-accent-200', 'bg-accent-300', 'bg-accent-400',
        'bg-accent-500', 'bg-accent-600', 'bg-accent-700', 'bg-accent-800', 'bg-accent-900', 'bg-accent-950',
        'text-accent-50', 'text-accent-100', 'text-accent-200', 'text-accent-300', 'text-accent-400',
        'text-accent-500', 'text-accent-600', 'text-accent-700', 'text-accent-800', 'text-accent-900', 'text-accent-950',
        'border-accent-50', 'border-accent-100', 'border-accent-200', 'border-accent-300', 'border-accent-400',
        'border-accent-500', 'border-accent-600', 'border-accent-700', 'border-accent-800', 'border-accent-900', 'border-accent-950',

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

        'dark:bg-accent-50', 'dark:bg-accent-100', 'dark:bg-accent-200', 'dark:bg-accent-300', 'dark:bg-accent-400',
        'dark:bg-accent-500', 'dark:bg-accent-600', 'dark:bg-accent-700', 'dark:bg-accent-800', 'dark:bg-accent-900', 'dark:bg-accent-950',
        'dark:text-accent-50', 'dark:text-accent-100', 'dark:text-accent-200', 'dark:text-accent-300', 'dark:text-accent-400',
        'dark:text-accent-500', 'dark:text-accent-600', 'dark:text-accent-700', 'dark:text-accent-800', 'dark:text-accent-900', 'dark:text-accent-950',
        'dark:border-accent-50', 'dark:border-accent-100', 'dark:border-accent-200', 'dark:border-accent-300', 'dark:border-accent-400',
        'dark:border-accent-500', 'dark:border-accent-600', 'dark:border-accent-700', 'dark:border-accent-800', 'dark:border-accent-900', 'dark:border-accent-950',

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
                // Brand colors - Use CSS custom properties
                brand: {
                    50: 'rgb(var(--color-brand-50))',
                    100: 'rgb(var(--color-brand-100))',
                    200: 'rgb(var(--color-brand-200))',
                    300: 'rgb(var(--color-brand-300))',
                    400: 'rgb(var(--color-brand-400))',
                    500: 'rgb(var(--color-brand-500))',
                    600: 'rgb(var(--color-brand-600))',
                    700: 'rgb(var(--color-brand-700))',
                    800: 'rgb(var(--color-brand-800))',
                    900: 'rgb(var(--color-brand-900))',
                    950: 'rgb(var(--color-brand-950))',
                },
                // Accent colors - Use CSS custom properties
                accent: {
                    50: 'rgb(var(--color-accent-50))',
                    100: 'rgb(var(--color-accent-100))',
                    200: 'rgb(var(--color-accent-200))',
                    300: 'rgb(var(--color-accent-300))',
                    400: 'rgb(var(--color-accent-400))',
                    500: 'rgb(var(--color-accent-500))',
                    600: 'rgb(var(--color-accent-600))',
                    700: 'rgb(var(--color-accent-700))',
                    800: 'rgb(var(--color-accent-800))',
                    900: 'rgb(var(--color-accent-900))',
                    950: 'rgb(var(--color-accent-950))',
                },
                // Surface colors - Use CSS custom properties
                surface: {
                    50: 'rgb(var(--color-surface-50))',
                    100: 'rgb(var(--color-surface-100))',
                    200: 'rgb(var(--color-surface-200))',
                    300: 'rgb(var(--color-surface-300))',
                    400: 'rgb(var(--color-surface-400))',
                    500: 'rgb(var(--color-surface-500))',
                    600: 'rgb(var(--color-surface-600))',
                    700: 'rgb(var(--color-surface-700))',
                    800: 'rgb(var(--color-surface-800))',
                    900: 'rgb(var(--color-surface-900))',
                    950: 'rgb(var(--color-surface-950))',
                },
                // Success colors - Use CSS custom properties
                success: {
                    50: 'rgb(var(--color-success-50))',
                    100: 'rgb(var(--color-success-100))',
                    200: 'rgb(var(--color-success-200))',
                    300: 'rgb(var(--color-success-300))',
                    400: 'rgb(var(--color-success-400))',
                    500: 'rgb(var(--color-success-500))',
                    600: 'rgb(var(--color-success-600))',
                    700: 'rgb(var(--color-success-700))',
                    800: 'rgb(var(--color-success-800))',
                    900: 'rgb(var(--color-success-900))',
                    950: 'rgb(var(--color-success-950))',
                },
                // Warning colors - Use CSS custom properties
                warning: {
                    50: 'rgb(var(--color-warning-50))',
                    100: 'rgb(var(--color-warning-100))',
                    200: 'rgb(var(--color-warning-200))',
                    300: 'rgb(var(--color-warning-300))',
                    400: 'rgb(var(--color-warning-400))',
                    500: 'rgb(var(--color-warning-500))',
                    600: 'rgb(var(--color-warning-600))',
                    700: 'rgb(var(--color-warning-700))',
                    800: 'rgb(var(--color-warning-800))',
                    900: 'rgb(var(--color-warning-900))',
                    950: 'rgb(var(--color-warning-950))',
                },
                // Error colors - Use CSS custom properties
                error: {
                    50: 'rgb(var(--color-error-50))',
                    100: 'rgb(var(--color-error-100))',
                    200: 'rgb(var(--color-error-200))',
                    300: 'rgb(var(--color-error-300))',
                    400: 'rgb(var(--color-error-400))',
                    500: 'rgb(var(--color-error-500))',
                    600: 'rgb(var(--color-error-600))',
                    700: 'rgb(var(--color-error-700))',
                    800: 'rgb(var(--color-error-800))',
                    900: 'rgb(var(--color-error-900))',
                    950: 'rgb(var(--color-error-950))',
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