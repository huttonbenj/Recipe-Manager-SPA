import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeColors } from '../../../utils/theme';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient' | 'glass';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    rounded?: 'sm' | 'md' | 'lg' | 'full';
    shadow?: 'none' | 'sm' | 'md' | 'lg';
    animation?: 'none' | 'scale' | 'lift' | 'glow';
    iconOnly?: boolean;
    loadingText?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            rounded = 'md',
            shadow = 'none',
            animation = 'scale',
            iconOnly = false,
            loadingText,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const { theme } = useTheme();
        const themeColors = getThemeColors(theme.color);

        const baseStyles = "inline-flex items-center justify-center font-medium ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-surface-950 relative overflow-hidden";

        // Dynamic theme-based variants
        const getVariantStyles = () => {
            switch (variant) {
                case 'primary':
                    return `bg-${themeColors.primary} text-white hover:bg-${themeColors.primaryHover} dark:bg-${themeColors.primaryDark} dark:hover:bg-${themeColors.primaryDarkHover}`;
                case 'secondary':
                    return `bg-${themeColors.secondary} text-white hover:bg-${themeColors.secondaryHover} dark:bg-${themeColors.secondaryDark} dark:hover:bg-${themeColors.secondaryDarkHover}`;
                case 'outline':
                    return `border ${themeColors.border} bg-transparent ${themeColors.text} hover:bg-surface-100 dark:text-surface-50 dark:hover:bg-surface-800`;
                case 'ghost':
                    return `text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-50`;
                case 'danger':
                    return "bg-error-600 text-white hover:bg-error-700 dark:bg-error-700 dark:hover:bg-error-600";
                case 'gradient':
                    return `${themeColors.gradient} text-white hover:shadow-lg hover:shadow-${themeColors.primary}/25 ${themeColors.gradientDark}`;
                case 'glass':
                    return "bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 text-surface-900 dark:text-surface-50 hover:bg-white/20 dark:hover:bg-white/10 hover:shadow-glass";
                default:
                    return `bg-${themeColors.primary} text-white hover:bg-${themeColors.primaryHover} dark:bg-${themeColors.primaryDark} dark:hover:bg-${themeColors.primaryDarkHover}`;
            }
        };

        const sizes = {
            xs: "h-7 px-2 text-xs",
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2 text-sm",
            lg: "h-12 px-6 text-base",
            xl: "h-14 px-8 text-lg",
        };

        const iconSizes = {
            xs: "h-7 w-7 p-1",
            sm: "h-8 w-8 p-1.5",
            md: "h-10 w-10 p-2",
            lg: "h-12 w-12 p-2.5",
            xl: "h-14 w-14 p-3",
        };

        const roundedStyles = {
            sm: "rounded-sm",
            md: "rounded-md",
            lg: "rounded-lg",
            full: "rounded-full",
        };

        const shadowStyles = {
            none: "",
            sm: "shadow-sm",
            md: "shadow-md",
            lg: "shadow-lg",
        };

        // Dynamic theme-based animations
        const getAnimationStyles = () => {
            switch (animation) {
                case 'none':
                    return "";
                case 'scale':
                    return "hover:scale-[1.02] active:scale-[0.98]";
                case 'lift':
                    return "hover:-translate-y-1 hover:shadow-lg";
                case 'glow':
                    return `hover:shadow-lg hover:shadow-${themeColors.primary}/25 dark:hover:shadow-${themeColors.primaryDark}/25`;
                default:
                    return "hover:scale-[1.02] active:scale-[0.98]";
            }
        };

        const iconSize = size === 'xs' ? 'h-3 w-3' :
            size === 'sm' ? 'h-4 w-4' :
                size === 'md' ? 'h-4 w-4' :
                    size === 'lg' ? 'h-5 w-5' : 'h-6 w-6';

        const loadingSpinnerSize = size === 'xs' ? 'h-3 w-3' :
            size === 'sm' ? 'h-4 w-4' :
                size === 'md' ? 'h-4 w-4' :
                    size === 'lg' ? 'h-5 w-5' : 'h-6 w-6';

        // Dynamic focus ring based on theme with fallback
        const focusRingStyles = `focus-visible:${themeColors?.focusRing || 'focus:ring-emerald-500'}`;

        return (
            <button
                className={cn(
                    baseStyles,
                    getVariantStyles(),
                    iconOnly ? iconSizes[size] : sizes[size],
                    roundedStyles[rounded],
                    shadowStyles[shadow],
                    getAnimationStyles(),
                    focusRingStyles,
                    fullWidth && "w-full",
                    isLoading && "loading",
                    className
                )}
                ref={ref}
                disabled={disabled || isLoading}
                aria-label={iconOnly ? (typeof children === 'string' ? children : 'Button') : undefined}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Loader2 className={cn(loadingSpinnerSize, "animate-spin")} />
                        {loadingText ? (
                            <span className="ml-2">{loadingText}</span>
                        ) : (
                            <span className="ml-2 opacity-0">{children}</span>
                        )}
                    </>
                ) : (
                    <>
                        {leftIcon && <span className={cn(iconSize, "mr-2")}>{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className={cn(iconSize, "ml-2")}>{rightIcon}</span>}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button'; 