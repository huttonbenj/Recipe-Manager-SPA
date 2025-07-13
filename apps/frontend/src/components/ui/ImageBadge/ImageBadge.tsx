import React from 'react'
import { cn } from '@/utils'

export interface ImageBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
    children: React.ReactNode;
}

const ImageBadge: React.FC<ImageBadgeProps> = ({
    className,
    variant = 'default',
    children,
    ...props
}) => {
    // Base classes for all image badges
    const baseClasses = 'inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium shadow-md backdrop-blur-sm border';

    // Color variants with more refined styling
    const variantClasses = {
        success: 'bg-emerald-600/85 text-white border-emerald-500/40',
        warning: 'bg-amber-600/85 text-white border-amber-500/40',
        danger: 'bg-rose-600/85 text-white border-rose-500/40',
        info: 'bg-blue-600/85 text-white border-blue-500/40',
        default: 'bg-gray-800/85 text-white border-gray-700/40',
    };

    return (
        <div
            className={cn(
                baseClasses,
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default ImageBadge; 