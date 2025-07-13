/**
 * Reusable Textarea component
 * Supports different sizes, states, and validation
 * Fully compatible with theme system
 */

import React from 'react'
import { cn } from '@/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    size?: 'sm' | 'md' | 'lg'
    error?: boolean
    helperText?: string
    label?: string
    required?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({
        className,
        size = 'md',
        error,
        helperText,
        label,
        required,
        id,
        ...props
    }, ref) => {
        const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`

        return (
            <div className="w-full">
                {/* Label */}
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
                    >
                        {label}
                        {required && <span className="text-accent-500 ml-1">*</span>}
                    </label>
                )}

                {/* Textarea */}
                <textarea
                    id={textareaId}
                    className={cn(
                        // Base styles
                        'block w-full rounded-md border-secondary-300 dark:border-secondary-600 shadow-sm transition-colors duration-200',
                        'focus:border-primary-500 focus:ring-primary-500 focus:ring-1',
                        'disabled:bg-secondary-50 dark:disabled:bg-secondary-800 disabled:text-secondary-500 dark:disabled:text-secondary-400 disabled:cursor-not-allowed',
                        'placeholder:text-secondary-400 dark:placeholder:text-secondary-500',
                        'bg-white dark:bg-secondary-800 dark:text-secondary-100',

                        // Size variants
                        {
                            'px-3 py-2 text-sm': size === 'sm',
                            'px-4 py-3 text-base': size === 'md',
                            'px-5 py-4 text-lg': size === 'lg',
                        },

                        // Error state
                        {
                            'border-accent-300 focus:border-accent-500 focus:ring-accent-500': error,
                        },

                        className
                    )}
                    ref={ref}
                    {...props}
                />

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

Textarea.displayName = 'Textarea'

export default Textarea 