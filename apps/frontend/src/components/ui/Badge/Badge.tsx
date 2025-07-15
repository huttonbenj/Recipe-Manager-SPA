/**
 * Reusable Badge component
 * Perfect for tags, categories, and status indicators
 */

import React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    removable?: boolean;
    onRemove?: () => void;
    children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({
        className,
        variant = 'primary',
        size = 'md',
        removable = false,
        onRemove,
        children,
        ...props
    }, ref) => {
        // Base classes
        const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 hover:scale-[1.05] hover:shadow-lg backdrop-blur-sm';

        // Size variants
        const sizeClasses = {
            sm: 'px-2 py-0.5 text-xs',
            md: 'px-2.5 py-0.5 text-sm',
            lg: 'px-3 py-1 text-base'
        };

        // Color variants
        const variantClasses = {
            primary: 'badge-primary',
            secondary: 'badge-secondary',
            success: 'badge-success',
            warning: 'badge-warning',
            danger: 'badge-danger',
            info: 'badge-primary',
            outline: 'border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 bg-white/60 dark:bg-white/5 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-white/10 hover:border-secondary-300 dark:hover:border-secondary-500'
        };

        return (
            <span
                className={cn(
                    baseClasses,
                    sizeClasses[size],
                    variantClasses[variant],
                    className
                )}
                ref={ref}
                {...props}
            >
                {children}

                {/* Remove button */}
                {removable && onRemove && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        className={cn(
                            'ml-1 inline-flex items-center justify-center rounded-full transition-colors',
                            'hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-offset-1',
                            {
                                'h-3.5 w-3.5': size === 'sm',
                                'h-4 w-4': size === 'md',
                                'h-5 w-5': size === 'lg',
                            }
                        )}
                        aria-label="Remove"
                    >
                        <X className={cn(
                            {
                                'h-2 w-2': size === 'sm',
                                'h-3 w-3': size === 'md',
                                'h-4 w-4': size === 'lg',
                            }
                        )} />
                    </button>
                )}
            </span>
        );
    }
);

Badge.displayName = 'Badge';

export default Badge; 