import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    variant?: 'default' | 'elevated' | 'glass' | 'interactive' | 'gradient';
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    rounded?: 'sm' | 'md' | 'lg' | 'xl';
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    hover?: boolean;
    loading?: boolean;
    bordered?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({
        className,
        variant = 'default',
        padding = 'md',
        rounded = 'lg',
        shadow = 'sm',
        hover = false,
        loading = false,
        bordered = true,
        ...props
    }, ref) => {
        const baseStyles = "transition-all duration-300";

        const variants = {
            default: "border bg-white dark:bg-surface-900",
            elevated: "border bg-white dark:bg-surface-900 shadow-elevated hover:shadow-elevated-lg hover:-translate-y-1",
            glass: "backdrop-blur-sm bg-white/80 dark:bg-surface-900/80 border-white/20 dark:border-surface-700/30 shadow-glass hover:shadow-glass-lg",
            interactive: "border bg-white dark:bg-surface-900 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]",
            gradient: "bg-gradient-to-br from-white to-surface-50 dark:from-surface-900 dark:to-surface-950 border-surface-200 dark:border-surface-800",
        };

        const paddingStyles = {
            none: "",
            sm: "p-4",
            md: "p-6",
            lg: "p-8",
            xl: "p-10",
        };

        const roundedStyles = {
            sm: "rounded-sm",
            md: "rounded-md",
            lg: "rounded-lg",
            xl: "rounded-xl",
        };

        const shadowStyles = {
            none: "",
            sm: "shadow-sm",
            md: "shadow-md",
            lg: "shadow-lg",
            xl: "shadow-xl",
        };

        const borderStyles = bordered ? "border-surface-200 dark:border-surface-800" : "border-transparent";

        return (
            <div
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    paddingStyles[padding],
                    roundedStyles[rounded],
                    shadowStyles[shadow],
                    borderStyles,
                    hover && "hover:shadow-md hover:-translate-y-1",
                    loading && "loading animate-pulse",
                    className
                )}
                {...props}
            />
        );
    }
);

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    bordered?: boolean;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, padding = 'md', bordered = false, ...props }, ref) => {
        const paddingStyles = {
            none: "",
            sm: "p-4",
            md: "p-6",
            lg: "p-8",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "flex flex-col space-y-1.5",
                    paddingStyles[padding],
                    bordered && "border-b border-surface-200 dark:border-surface-800",
                    className
                )}
                {...props}
            />
        );
    }
);

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    gradient?: boolean;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, as = 'h3', size = 'md', gradient = false, ...props }, ref) => {
        const Component = as;

        const sizeStyles = {
            sm: "text-lg font-semibold",
            md: "text-xl font-semibold",
            lg: "text-2xl font-semibold",
            xl: "text-3xl font-bold",
        };

        return (
            <Component
                ref={ref}
                className={cn(
                    "font-display leading-tight tracking-tight text-surface-900 dark:text-surface-50",
                    sizeStyles[size],
                    gradient && "gradient-text-brand",
                    className
                )}
                {...props}
            />
        );
    }
);

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    muted?: boolean;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className, size = 'md', muted = true, ...props }, ref) => {
        const sizeStyles = {
            sm: "text-xs",
            md: "text-sm",
            lg: "text-base",
        };

        return (
            <p
                ref={ref}
                className={cn(
                    "leading-relaxed",
                    sizeStyles[size],
                    muted ? "text-surface-600 dark:text-surface-400" : "text-surface-900 dark:text-surface-50",
                    className
                )}
                {...props}
            />
        );
    }
);

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, padding = 'md', spacing = 'md', ...props }, ref) => {
        const paddingStyles = {
            none: "",
            sm: "p-4 pt-0",
            md: "p-6 pt-0",
            lg: "p-8 pt-0",
        };

        const spacingStyles = {
            none: "",
            sm: "space-y-2",
            md: "space-y-4",
            lg: "space-y-6",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    paddingStyles[padding],
                    spacingStyles[spacing],
                    className
                )}
                {...props}
            />
        );
    }
);

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    bordered?: boolean;
    justify?: 'start' | 'center' | 'end' | 'between';
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, padding = 'md', bordered = false, justify = 'start', ...props }, ref) => {
        const paddingStyles = {
            none: "",
            sm: "p-4 pt-0",
            md: "p-6 pt-0",
            lg: "p-8 pt-0",
        };

        const justifyStyles = {
            start: "justify-start",
            center: "justify-center",
            end: "justify-end",
            between: "justify-between",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "flex items-center",
                    paddingStyles[padding],
                    justifyStyles[justify],
                    bordered && "border-t border-surface-200 dark:border-surface-800 mt-4 pt-4",
                    className
                )}
                {...props}
            />
        );
    }
);

// New component for card actions
export interface CardActionsProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    spacing?: 'sm' | 'md' | 'lg';
    align?: 'start' | 'center' | 'end';
}

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
    ({ className, spacing = 'md', align = 'end', ...props }, ref) => {
        const spacingStyles = {
            sm: "gap-2",
            md: "gap-3",
            lg: "gap-4",
        };

        const alignStyles = {
            start: "justify-start",
            center: "justify-center",
            end: "justify-end",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "flex items-center",
                    spacingStyles[spacing],
                    alignStyles[align],
                    className
                )}
                {...props}
            />
        );
    }
);

// New component for card image
export interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    src: string;
    alt: string;
    aspectRatio?: 'square' | 'video' | 'wide' | 'tall';
    objectFit?: 'cover' | 'contain' | 'fill';
    loading?: 'lazy' | 'eager';
}

export const CardImage = forwardRef<HTMLDivElement, CardImageProps>(
    ({
        className,
        src,
        alt,
        aspectRatio = 'video',
        objectFit = 'cover',
        loading = 'lazy',
        ...props
    }, ref) => {
        const aspectRatioStyles = {
            square: "aspect-square",
            video: "aspect-video",
            wide: "aspect-[3/1]",
            tall: "aspect-[3/4]",
        };

        const objectFitStyles = {
            cover: "object-cover",
            contain: "object-contain",
            fill: "object-fill",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "relative overflow-hidden",
                    aspectRatioStyles[aspectRatio],
                    className
                )}
                {...props}
            >
                <img
                    src={src}
                    alt={alt}
                    loading={loading}
                    className={cn(
                        "h-full w-full transition-all duration-300",
                        objectFitStyles[objectFit],
                        "hover:scale-105"
                    )}
                />
            </div>
        );
    }
);

// Add display names for better debugging
Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';
CardActions.displayName = 'CardActions';
CardImage.displayName = 'CardImage'; 