/**
 * Reusable Badge component
 * Perfect for tags, categories, and status indicators
 */

import React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
    size?: 'sm' | 'md' | 'lg'
    removable?: boolean
    onRemove?: () => void
    children: React.ReactNode
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
        return (
            <span
                className={cn(
                    // Base styles
                    'inline-flex items-center font-medium rounded-full transition-colors duration-200',

                    // Size variants
                    {
                        'px-2 py-1 text-xs': size === 'sm',
                        'px-3 py-1 text-sm': size === 'md',
                        'px-4 py-2 text-base': size === 'lg',
                    },

                    // Color variants
                    {
                        'bg-primary-100 text-primary-800 border border-primary-200': variant === 'primary',
                        'bg-gray-100 text-gray-800 border border-gray-200': variant === 'secondary',
                        'bg-green-100 text-green-800 border border-green-200': variant === 'success',
                        'bg-yellow-100 text-yellow-800 border border-yellow-200': variant === 'warning',
                        'bg-red-100 text-red-800 border border-red-200': variant === 'danger',
                        'bg-blue-100 text-blue-800 border border-blue-200': variant === 'info',
                    },

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
                            e.stopPropagation()
                            onRemove()
                        }}
                        className={cn(
                            'ml-1 inline-flex items-center justify-center rounded-full transition-colors duration-200',
                            'hover:bg-black/10 focus:outline-none focus:bg-black/10',

                            // Size variants for remove button
                            {
                                'h-3 w-3': size === 'sm',
                                'h-4 w-4': size === 'md',
                                'h-5 w-5': size === 'lg',
                            }
                        )}
                    >
                        <X className={cn(
                            {
                                'h-2 w-2': size === 'sm',
                                'h-3 w-3': size === 'md',
                                'h-4 w-4': size === 'lg',
                            }
                        )} />
                        <span className="sr-only">Remove</span>
                    </button>
                )}
            </span>
        )
    }
)

Badge.displayName = 'Badge'

export default Badge 