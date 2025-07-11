import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { Loader2 } from 'lucide-react';

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
        const baseStyles = "inline-flex items-center justify-center font-medium ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-surface-950 relative overflow-hidden";

        const variants = {
            primary: "bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-700 dark:hover:bg-brand-600",
            secondary: "bg-surface-200 text-surface-900 hover:bg-surface-300 dark:bg-surface-800 dark:text-surface-50 dark:hover:bg-surface-700",
            outline: "border border-surface-300 bg-transparent text-surface-900 hover:bg-surface-100 dark:border-surface-700 dark:text-surface-50 dark:hover:bg-surface-800",
            ghost: "text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-50",
            danger: "bg-error-600 text-white hover:bg-error-700 dark:bg-error-700 dark:hover:bg-error-600",
            gradient: "bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-700 hover:to-brand-600 shadow-brand-500/25",
            glass: "bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 text-surface-900 dark:text-surface-50 hover:bg-white/20 dark:hover:bg-white/10 hover:shadow-glass",
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

        const animationStyles = {
            none: "",
            scale: "hover:scale-[1.02] active:scale-[0.98]",
            lift: "hover:-translate-y-1 hover:shadow-lg",
            glow: "hover:shadow-lg hover:shadow-brand-500/25",
        };

        const iconSize = size === 'xs' ? 'h-3 w-3' :
            size === 'sm' ? 'h-4 w-4' :
                size === 'md' ? 'h-4 w-4' :
                    size === 'lg' ? 'h-5 w-5' : 'h-6 w-6';

        const loadingSpinnerSize = size === 'xs' ? 'h-3 w-3' :
            size === 'sm' ? 'h-4 w-4' :
                size === 'md' ? 'h-4 w-4' :
                    size === 'lg' ? 'h-5 w-5' : 'h-6 w-6';

        return (
            <button
                className={cn(
                    baseStyles,
                    variants[variant],
                    iconOnly ? iconSizes[size] : sizes[size],
                    roundedStyles[rounded],
                    shadowStyles[shadow],
                    animationStyles[animation],
                    fullWidth && "w-full",
                    isLoading && "loading",
                    className
                )}
                ref={ref}
                disabled={disabled || isLoading}
                aria-label={iconOnly ? (typeof children === 'string' ? children : 'Button') : undefined}
                {...props}
            >
                {isLoading && (
                    <>
                        <Loader2 className={cn(loadingSpinnerSize, "animate-spin", children && "mr-2")} />
                        {loadingText && <span className="sr-only">{loadingText}</span>}
                    </>
                )}
                {!isLoading && leftIcon && (
                    <span className={cn(iconSize, children && "mr-2")}>{leftIcon}</span>
                )}
                {!iconOnly && children && (
                    <span className={isLoading ? "opacity-0" : ""}>{children}</span>
                )}
                {iconOnly && !isLoading && children}
                {!isLoading && rightIcon && (
                    <span className={cn(iconSize, children && "ml-2")}>{rightIcon}</span>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button'; 