/**
 * Input component with validation states and variants
 * Supports different sizes, error states, icons, and accessibility features
 */

import React, { forwardRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/utils'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isPassword?: boolean
  showPasswordToggle?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    error,
    helperText,
    variant = 'default',
    size = 'md',
    leftIcon,
    rightIcon,
    isPassword = false,
    showPasswordToggle = false,
    type = 'text',
    disabled,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [currentType, setCurrentType] = React.useState(type)

    React.useEffect(() => {
      if (isPassword || showPasswordToggle) {
        setCurrentType(showPassword ? 'text' : 'password')
      } else {
        setCurrentType(type)
      }
    }, [showPassword, isPassword, showPasswordToggle, type])

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    const inputClasses = cn(
      // Base styles
      'w-full border transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
      // Variant styles
      {
        'bg-white border-gray-300 focus:border-primary-500 focus:ring-primary-200': variant === 'default',
        'bg-gray-50 border-gray-200 focus:bg-white focus:border-primary-500 focus:ring-primary-200': variant === 'filled',
        'bg-transparent border-2 border-gray-300 focus:border-primary-500 focus:ring-primary-200': variant === 'outlined',
      },
      // Size styles
      {
        'px-3 py-1.5 text-sm rounded-md': size === 'sm',
        'px-4 py-2 text-base rounded-lg': size === 'md',
        'px-5 py-3 text-lg rounded-lg': size === 'lg',
      },
      // Error state
      {
        'border-red-500 focus:border-red-500 focus:ring-red-200': error,
      },
      // Icon padding
      {
        'pl-10': leftIcon && size === 'sm',
        'pl-12': leftIcon && size === 'md',
        'pl-14': leftIcon && size === 'lg',
        'pr-10': (rightIcon || showPasswordToggle) && size === 'sm',
        'pr-12': (rightIcon || showPasswordToggle) && size === 'md',
        'pr-14': (rightIcon || showPasswordToggle) && size === 'lg',
      },
      className
    )

    const containerClasses = cn('relative')

    const labelClasses = cn(
      'block text-sm font-medium mb-1.5',
      {
        'text-gray-700': !error,
        'text-red-700': error,
      }
    )

    const iconClasses = cn(
      'absolute top-1/2 transform -translate-y-1/2 text-gray-400',
      {
        'w-4 h-4': size === 'sm',
        'w-5 h-5': size === 'md',
        'w-6 h-6': size === 'lg',
      }
    )

    const leftIconClasses = cn(iconClasses, {
      'left-3': size === 'sm',
      'left-4': size === 'md',
      'left-5': size === 'lg',
    })

    const rightIconClasses = cn(iconClasses, {
      'right-3': size === 'sm',
      'right-4': size === 'md',
      'right-5': size === 'lg',
    })

    return (
      <div className="w-full">
        {label && (
          <label className={labelClasses}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className={containerClasses}>
          {leftIcon && (
            <div className={leftIconClasses}>
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={currentType}
            className={inputClasses}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            {...props}
          />

          {(rightIcon || showPasswordToggle) && (
            <div className={rightIconClasses}>
              {showPasswordToggle ? (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-full h-full" /> : <Eye className="w-full h-full" />}
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>

        {error && (
          <p id={`${props.id}-error`} className="mt-1.5 text-sm text-red-600">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${props.id}-helper`} className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input