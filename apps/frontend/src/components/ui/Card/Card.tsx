/**
 * Card component for content containers
 * Provides flexible card layouts with variants, padding options, and interactive states
 */

import React from 'react'
import { cn } from '@/utils'

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  as?: 'div' | 'article' | 'section' | 'li';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
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
  radius = 'lg',
  id,
  ...props
}) => {
  // Base classes
  const baseClasses = 'transition-all duration-300 ease-in-out overflow-hidden';

  // Variant classes
  const variantClasses = {
    default: 'bg-white dark:bg-secondary-800 shadow-sm',
    bordered: 'bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 shadow-sm',
    elevated: 'bg-white dark:bg-secondary-800 shadow-md',
    outlined: 'bg-transparent border-2 border-secondary-300 dark:border-secondary-600',
    glass: 'glass-effect shadow-sm'
  };

  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  // Radius classes
  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  // Interactive state classes
  const interactiveClasses = {
    hover: hover && !clickable ? 'hover:shadow-lg hover:translate-y-[-2px]' : '',
    clickable: clickable ? 'cursor-pointer hover:shadow-lg hover:translate-y-[-2px] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2' : ''
  };

  const cardClasses = cn(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    radiusClasses[radius],
    interactiveClasses.hover,
    interactiveClasses.clickable,
    className
  );

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (clickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Component
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      aria-pressed={clickable ? 'false' : undefined}
      id={id}
      {...props}
    >
      {children}
    </Component>
  );
};

// Sub-components for better composition
export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
  withBorder?: boolean;
}> = ({
  children,
  className,
  withBorder = false,
}) => (
    <div className={cn(
      'mb-4',
      withBorder && 'pb-4 border-b border-secondary-200 dark:border-secondary-700',
      className
    )}>
      {children}
    </div>
  );

export const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({
  children,
  className,
}) => (
    <div className={cn('', className)}>
      {children}
    </div>
  );

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
  withBorder?: boolean;
}> = ({
  children,
  className,
  withBorder = true,
}) => (
    <div className={cn(
      'mt-4 pt-4',
      withBorder && 'border-t border-secondary-200 dark:border-secondary-700',
      className
    )}>
      {children}
    </div>
  );

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}> = ({
  children,
  className,
  as: Component = 'h3',
}) => (
    <Component className={cn('text-lg font-semibold text-secondary-900 dark:text-secondary-100', className)}>
      {children}
    </Component>
  );

export const CardDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({
  children,
  className,
}) => (
    <p className={cn('text-sm text-secondary-600 dark:text-secondary-400', className)}>
      {children}
    </p>
  );

export default Card;