/**
 * Reusable Select component
 * Supports different sizes, states, and validation
 */

import React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils'

export interface SelectOption {
    value: string
    label: string
    disabled?: boolean
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    size?: 'sm' | 'md' | 'lg'
    error?: boolean
    helperText?: string
    label?: string
    required?: boolean
    options?: SelectOption[]
    placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({
        className,
        size = 'md',
        error,
        helperText,
        label,
        required,
        options = [],
        placeholder,
        children,
        id,
        ...props
    }, ref) => {
        const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

        return (
            <div className="w-full">
                {/* Label */}
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                {/* Select Container */}
                <div className="relative">
                    <select
                        id={selectId}
                        className={cn(
                            // Base styles
                            'block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200',
                            'focus:border-primary-500 focus:ring-primary-500 focus:ring-1',
                            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                            'bg-white appearance-none cursor-pointer',

                            // Size variants
                            {
                                'px-3 py-2 pr-8 text-sm': size === 'sm',
                                'px-4 py-3 pr-10 text-base': size === 'md',
                                'px-5 py-4 pr-12 text-lg': size === 'lg',
                            },

                            // Error state
                            {
                                'border-red-300 focus:border-red-500 focus:ring-red-500': error,
                            },

                            className
                        )}
                        ref={ref}
                        {...props}
                    >
                        {/* Placeholder option */}
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}

                        {/* Options from props */}
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </option>
                        ))}

                        {/* Children options (for manual option definition) */}
                        {children}
                    </select>

                    {/* Dropdown Icon */}
                    <div className={cn(
                        'absolute inset-y-0 right-0 flex items-center pointer-events-none',
                        {
                            'pr-2': size === 'sm',
                            'pr-3': size === 'md',
                            'pr-4': size === 'lg',
                        }
                    )}>
                        <ChevronDown className={cn(
                            'text-gray-400',
                            {
                                'h-4 w-4': size === 'sm',
                                'h-5 w-5': size === 'md',
                                'h-6 w-6': size === 'lg',
                            }
                        )} />
                    </div>
                </div>

                {/* Helper Text */}
                {helperText && (
                    <p className={cn(
                        'mt-1 text-sm',
                        error ? 'text-red-600' : 'text-gray-500'
                    )}>
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)

Select.displayName = 'Select'

export default Select 