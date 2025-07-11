import React from 'react';
import { cn } from '../../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'outlined' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const cardVariants = {
    default: 'bg-white shadow-md',
    outlined: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg',
};

const cardPadding = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
    variant = 'default',
    padding = 'md',
    className,
    children,
    ...props
}) => {
    const classes = cn(
        'rounded-lg',
        cardVariants[variant],
        cardPadding[padding],
        className
    );

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
    className,
    children,
    ...props
}) => {
    const classes = cn('border-b border-gray-200 pb-3 mb-4', className);

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({
    className,
    children,
    ...props
}) => {
    const classes = cn('', className);

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({
    className,
    children,
    ...props
}) => {
    const classes = cn('border-t border-gray-200 pt-3 mt-4', className);

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
}; 