/**
 * Reusable Checkbox component
 * Supports different sizes, states, and validation
 * Fully compatible with theme system
 */

import React from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/utils'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    size?: 'sm' | 'md' | 'lg'
    error?: boolean
    helperText?: string
    label?: string
    description?: string
    indeterminate?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({
        className,
        size = 'md',
        error,
        helperText,
        label,
        description,
        indeterminate = false,
        checked,
        id,
        ...props
    }, ref) => {
        const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

        return (
            <div className="w-full">
                <div className="flex items-start">
                    {/* Checkbox Container */}
                    <div className="flex items-center h-5">
                        <div className="relative">
                            <input
                                id={checkboxId}
                                type="checkbox"
                                className={cn(
                                    // Base styles
                                    'rounded border-secondary-300 dark:border-secondary-600 transition-colors duration-200 cursor-pointer',
                                    'focus:ring-primary-500 focus:ring-2 focus:ring-offset-2',
                                    'focus:ring-offset-white dark:focus:ring-offset-secondary-900',
                                    'disabled:cursor-not-allowed disabled:opacity-50',

                                    // Size variants
                                    {
                                        'h-4 w-4': size === 'sm',
                                        'h-5 w-5': size === 'md',
                                        'h-6 w-6': size === 'lg',
                                    },

                                    // State styles
                                    {
                                        'text-primary-600 border-primary-600': checked || indeterminate,
                                        'border-accent-300 focus:ring-accent-500': error,
                                    },

                                    // Hide default checkbox appearance
                                    'appearance-none',

                                    className
                                )}
                                checked={checked}
                                ref={ref}
                                {...props}
                            />

                            {/* Custom checkbox visual */}
                            <div className={cn(
                                'absolute inset-0 flex items-center justify-center pointer-events-none',
                                'rounded transition-colors duration-200',
                                {
                                    'bg-primary-600 border-primary-600': checked || indeterminate,
                                    'bg-white dark:bg-secondary-800 border-secondary-300 dark:border-secondary-600': !checked && !indeterminate,
                                    'border-accent-300': error,
                                },
                                'border',
                                {
                                    'h-4 w-4': size === 'sm',
                                    'h-5 w-5': size === 'md',
                                    'h-6 w-6': size === 'lg',
                                }
                            )}>
                                {checked && !indeterminate && (
                                    <Check className={cn(
                                        'text-white',
                                        {
                                            'h-3 w-3': size === 'sm',
                                            'h-4 w-4': size === 'md',
                                            'h-5 w-5': size === 'lg',
                                        }
                                    )} />
                                )}
                                {indeterminate && (
                                    <Minus className={cn(
                                        'text-white',
                                        {
                                            'h-3 w-3': size === 'sm',
                                            'h-4 w-4': size === 'md',
                                            'h-5 w-5': size === 'lg',
                                        }
                                    )} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Label and Description */}
                    {(label || description) && (
                        <div className="ml-3 text-sm">
                            {label && (
                                <label
                                    htmlFor={checkboxId}
                                    className={cn(
                                        'font-medium cursor-pointer',
                                        error ? 'text-accent-600' : 'text-secondary-900 dark:text-secondary-100',
                                        {
                                            'text-sm': size === 'sm',
                                            'text-base': size === 'md',
                                            'text-lg': size === 'lg',
                                        }
                                    )}
                                >
                                    {label}
                                </label>
                            )}
                            {description && (
                                <p className={cn(
                                    'text-secondary-500 dark:text-secondary-400',
                                    {
                                        'text-xs': size === 'sm',
                                        'text-sm': size === 'md',
                                        'text-base': size === 'lg',
                                    }
                                )}>
                                    {description}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Helper Text */}
                {helperText && (
                    <p className={cn(
                        'mt-1 text-sm',
                        error ? 'text-accent-600' : 'text-secondary-500 dark:text-secondary-400'
                    )}>
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox 