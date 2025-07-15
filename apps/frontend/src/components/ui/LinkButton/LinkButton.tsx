import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { cn } from '@/utils'
import { ButtonProps } from '@/components/ui/Button/Button'

type LinkButtonProps = LinkProps & Omit<ButtonProps, 'children' | 'disabled' | 'type'> & {
    children: React.ReactNode;
    disabled?: boolean;
}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
    ({
        className,
        variant = 'primary',
        size = 'md',
        isLoading,
        isFullWidth,
        leftIcon,
        rightIcon,
        children,
        disabled,
        ...props
    }, ref) => {
        // Base button classes
        const baseClasses = 'btn inline-flex items-center justify-center font-medium rounded-lg transition-all';

        // Variant classes
        const variantClasses = {
            primary: 'btn-primary',
            secondary: 'btn-secondary',
            danger: 'btn-danger',
            ghost: 'btn-ghost',
            outline: 'btn-outline',
            'outline-white': 'btn-outline-white',
            'ghost-white': 'btn-ghost-white',
            'danger-outline': 'btn-danger-outline',
            link: 'btn-link'
        };

        // Size classes
        const sizeClasses = {
            sm: 'btn-sm',
            md: 'btn-md',
            lg: 'btn-lg'
        };

        // Width classes
        const widthClasses = isFullWidth ? 'w-full' : '';

        // Disabled state
        const isDisabled = disabled || isLoading;

        return (
            <Link
                ref={ref}
                aria-disabled={isDisabled}
                className={cn(
                    baseClasses,
                    variantClasses[variant],
                    sizeClasses[size],
                    widthClasses,
                    isDisabled && 'opacity-60 cursor-not-allowed transform-none',
                    className
                )}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}

                {leftIcon && !isLoading && (
                    <span className="mr-2 -ml-1 flex-shrink-0">{leftIcon}</span>
                )}

                <span>{children}</span>

                {rightIcon && (
                    <span className="ml-2 -mr-1 flex-shrink-0">{rightIcon}</span>
                )}
            </Link>
        )
    }
)

LinkButton.displayName = 'LinkButton'

export default LinkButton 