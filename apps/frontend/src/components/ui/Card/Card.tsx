/**
 * Card component for content containers
 * Provides flexible card layouts with variants, padding options, and interactive states
 */

import React from 'react'
import { cn } from '@/utils'

export interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'bordered' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  clickable?: boolean
  onClick?: () => void
  as?: 'div' | 'article' | 'section'
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  onClick,
  as: Component = 'div',
  ...props
}) => {
  const cardClasses = cn(
    // Base styles
    'bg-white rounded-lg transition-all duration-200',
    // Variant styles
    {
      'shadow-sm': variant === 'default',
      'border border-gray-200 shadow-sm': variant === 'bordered',
      'shadow-md': variant === 'elevated',
      'border-2 border-gray-300': variant === 'outlined',
    },
    // Padding styles
    {
      'p-0': padding === 'none',
      'p-3': padding === 'sm',
      'p-4': padding === 'md',
      'p-6': padding === 'lg',
      'p-8': padding === 'xl',
    },
    // Interactive states
    {
      'hover:shadow-lg hover:-translate-y-0.5': hover && !clickable,
      'cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0': clickable,
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2': clickable,
    },
    className
  )

  const handleClick = () => {
    if (clickable && onClick) {
      onClick()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (clickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <Component
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      aria-pressed={clickable ? 'false' : undefined}
      {...props}
    >
      {children}
    </Component>
  )
}

// Sub-components for better composition
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('mb-4', className)}>
    {children}
  </div>
)

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('', className)}>
    {children}
  </div>
)

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('mt-4 pt-4 border-t border-gray-100', className)}>
    {children}
  </div>
)

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string; as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }> = ({
  children,
  className,
  as: Component = 'h3',
}) => (
  <Component className={cn('text-lg font-semibold text-gray-900', className)}>
    {children}
  </Component>
)

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <p className={cn('text-sm text-gray-600', className)}>
    {children}
  </p>
)

export default Card