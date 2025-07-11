import React from 'react';
import { cn } from '../../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const badgeVariants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
};

const badgeSizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
};

export const Badge: React.FC<BadgeProps> = ({
    variant = 'default',
    size = 'sm',
    className,
    children,
    ...props
}) => {
    const classes = cn(
        'inline-flex items-center font-medium rounded-full',
        badgeVariants[variant],
        badgeSizes[size],
        className
    );

    return (
        <span className={classes} {...props}>
            {children}
        </span>
    );
}; 