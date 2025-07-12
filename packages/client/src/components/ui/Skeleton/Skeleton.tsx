import React from 'react';
import { cn } from '../../../utils/cn';

export interface SkeletonProps {
    className?: string;
    variant?: 'default' | 'text' | 'avatar' | 'button' | 'card' | 'image';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    rounded?: 'sm' | 'md' | 'lg' | 'full';
    width?: string;
    height?: string;
    animate?: boolean;
    pulse?: boolean;
    shimmer?: boolean;
    lines?: number; // For text variant
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className,
    variant = 'default',
    size = 'md',
    rounded = 'md',
    width,
    height,
    animate = true,
    pulse = false,
    shimmer = false,
    lines = 1,
    ...props
}) => {
    const baseStyles = "bg-surface-200 dark:bg-surface-800 relative overflow-hidden";

    const variants = {
        default: "",
        text: "block",
        avatar: "flex-shrink-0",
        button: "flex-shrink-0",
        card: "block",
        image: "block"
    };

    const sizes = {
        sm: {
            default: "h-4",
            text: "h-3",
            avatar: "h-8 w-8",
            button: "h-8 w-16",
            card: "h-32",
            image: "h-24"
        },
        md: {
            default: "h-6",
            text: "h-4",
            avatar: "h-10 w-10",
            button: "h-10 w-20",
            card: "h-48",
            image: "h-32"
        },
        lg: {
            default: "h-8",
            text: "h-5",
            avatar: "h-12 w-12",
            button: "h-12 w-24",
            card: "h-64",
            image: "h-48"
        },
        xl: {
            default: "h-10",
            text: "h-6",
            avatar: "h-16 w-16",
            button: "h-14 w-28",
            card: "h-80",
            image: "h-64"
        }
    };

    const roundedStyles = {
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full"
    };

    const animationClasses = cn(
        animate && "animate-pulse",
        shimmer && "animate-skeleton-shimmer",
        pulse && "animate-pulse-glow"
    );

    const skeletonClasses = cn(
        baseStyles,
        variants[variant],
        sizes[size][variant],
        roundedStyles[rounded],
        animationClasses,
        className
    );

    const style = {
        width: width,
        height: height,
        ...(variant === 'text' && lines > 1 && { marginBottom: '0.5rem' })
    };

    // For text variant with multiple lines
    if (variant === 'text' && lines > 1) {
        return (
            <div className="space-y-2">
                {Array.from({ length: lines }, (_, i) => (
                    <div
                        key={i}
                        className={cn(
                            skeletonClasses,
                            i === lines - 1 && "w-3/4" // Last line is shorter
                        )}
                        style={style}
                        {...props}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={skeletonClasses}
            style={style}
            {...props}
        >
            {shimmer && (
                <div className="absolute inset-0 animate-skeleton-shimmer bg-gradient-to-r from-transparent via-white/3 to-transparent dark:via-white/2" />
            )}
        </div>
    );
};

// Preset skeleton components for common use cases
export const SkeletonText: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
    <Skeleton variant="text" {...props} />
);

export const SkeletonAvatar: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
    <Skeleton variant="avatar" rounded="full" {...props} />
);

export const SkeletonButton: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
    <Skeleton variant="button" rounded="md" {...props} />
);

export const SkeletonCard: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
    <Skeleton variant="card" rounded="lg" {...props} />
);

export const SkeletonImage: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
    <Skeleton variant="image" rounded="lg" {...props} />
);

// Complex skeleton presets
export const RecipeCardSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-surface-900 rounded-xl p-4 border border-surface-200 dark:border-surface-800">
        <SkeletonImage className="w-full h-48 mb-4" />
        <SkeletonText lines={2} className="mb-2" />
        <div className="flex items-center gap-2 mb-2">
            <SkeletonText className="w-16 h-4" />
            <SkeletonText className="w-12 h-4" />
        </div>
        <div className="flex items-center justify-between">
            <SkeletonText className="w-20 h-4" />
            <SkeletonButton size="sm" />
        </div>
    </div>
);

export const RecipeListItemSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-surface-900 rounded-lg p-4 border border-surface-200 dark:border-surface-800">
        <div className="flex items-center gap-4">
            <SkeletonImage className="w-20 h-20 rounded-lg" />
            <div className="flex-1">
                <SkeletonText lines={2} className="mb-2" />
                <div className="flex items-center gap-4">
                    <SkeletonText className="w-16 h-3" />
                    <SkeletonText className="w-12 h-3" />
                    <SkeletonText className="w-20 h-3" />
                </div>
            </div>
        </div>
    </div>
);

export const UserProfileSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-surface-900 rounded-xl p-6 border border-surface-200 dark:border-surface-800">
        <div className="flex items-center gap-4 mb-6">
            <SkeletonAvatar size="xl" />
            <div>
                <SkeletonText className="w-32 h-6 mb-2" />
                <SkeletonText className="w-48 h-4" />
            </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="text-center">
                    <SkeletonText className="w-12 h-8 mx-auto mb-1" />
                    <SkeletonText className="w-16 h-4 mx-auto" />
                </div>
            ))}
        </div>
    </div>
);

export const DashboardSkeleton: React.FC = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-surface-900 rounded-xl p-6 border border-surface-200 dark:border-surface-800">
            <div className="flex items-center gap-4">
                <SkeletonAvatar size="lg" />
                <div>
                    <SkeletonText className="w-48 h-6 mb-2" />
                    <SkeletonText className="w-32 h-4" />
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="bg-white dark:bg-surface-900 rounded-xl p-4 border border-surface-200 dark:border-surface-800">
                    <div className="flex items-center gap-3">
                        <SkeletonAvatar size="md" />
                        <div>
                            <SkeletonText className="w-12 h-6 mb-1" />
                            <SkeletonText className="w-16 h-4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
                <RecipeCardSkeleton key={i} />
            ))}
        </div>
    </div>
); 