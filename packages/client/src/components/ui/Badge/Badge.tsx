import React, { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeColors, getThemeBadgeClasses } from '../../../utils/theme';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'accent' | 'success' | 'warning' | 'error' | 'gradient' | 'glass';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    shape?: 'rounded' | 'pill' | 'square';
    shadow?: 'none' | 'sm' | 'md' | 'lg';
    animation?: 'none' | 'pulse' | 'bounce' | 'glow';
    interactive?: boolean;
    dot?: boolean;
    icon?: React.ReactNode;
    onClose?: () => void;
    closable?: boolean;
    loading?: boolean;
    className?: string;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
    ({
        className,
        variant = 'primary',
        size = 'md',
        shape = 'rounded',
        shadow = 'none',
        animation = 'none',
        interactive = false,
        dot = false,
        icon,
        onClose,
        closable = false,
        loading = false,
        children,
        ...props
    }, ref) => {
        const { theme } = useTheme();
        const themeColors = getThemeColors(theme.color);

        const baseStyles = "inline-flex items-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-surface-950";

        // Dynamic theme-based variants
        const getVariantStyles = () => {
            switch (variant) {
                case 'primary':
                    return `bg-${themeColors.primary}-100 text-${themeColors.primary}-900 dark:bg-${themeColors.primary}-900/30 dark:text-${themeColors.primary}-200 hover:bg-${themeColors.primary}-200 dark:hover:bg-${themeColors.primary}-800/40`;
                case 'secondary':
                    return `bg-${themeColors.secondary}-100 text-${themeColors.secondary}-900 dark:bg-${themeColors.secondary}-900/30 dark:text-${themeColors.secondary}-200 hover:bg-${themeColors.secondary}-200 dark:hover:bg-${themeColors.secondary}-800/40`;
                case 'outline':
                    return `border border-${themeColors.primary}-200 text-${themeColors.primary}-700 dark:border-${themeColors.primary}-700 dark:text-${themeColors.primary}-300 hover:bg-${themeColors.primary}-50 dark:hover:bg-${themeColors.primary}-900/20`;
                case 'accent':
                    return `bg-${themeColors.secondary}-100 text-${themeColors.secondary}-900 dark:bg-${themeColors.secondary}-900/30 dark:text-${themeColors.secondary}-200 hover:bg-${themeColors.secondary}-200 dark:hover:bg-${themeColors.secondary}-800/40`;
                case 'success':
                    return "bg-success-100 text-success-900 dark:bg-success-900/30 dark:text-success-200 hover:bg-success-200 dark:hover:bg-success-800/40";
                case 'warning':
                    return "bg-warning-100 text-warning-900 dark:bg-warning-900/30 dark:text-warning-200 hover:bg-warning-200 dark:hover:bg-warning-800/40";
                case 'error':
                    return "bg-error-100 text-error-900 dark:bg-error-900/30 dark:text-error-200 hover:bg-error-200 dark:hover:bg-error-800/40";
                case 'gradient':
                    return `${themeColors.gradient} text-white hover:shadow-lg hover:shadow-${themeColors.primary}/25`;
                case 'glass':
                    return "border border-white/20 dark:border-surface-700/30 bg-white/10 dark:bg-surface-900/10 backdrop-blur-sm text-surface-900 dark:text-surface-50 hover:bg-white/20 dark:hover:bg-surface-900/20";
                default:
                    return getThemeBadgeClasses(theme.color, 'primary');
            }
        };

        const sizes = {
            xs: "px-1.5 py-0.5 text-xs",
            sm: "px-2 py-0.5 text-xs",
            md: "px-2.5 py-0.5 text-sm",
            lg: "px-3 py-1 text-base",
            xl: "px-4 py-1.5 text-lg",
        };

        const dotSizes = {
            xs: "w-1.5 h-1.5",
            sm: "w-2 h-2",
            md: "w-2.5 h-2.5",
            lg: "w-3 h-3",
            xl: "w-3.5 h-3.5",
        };

        const iconSizes = {
            xs: "w-3 h-3",
            sm: "w-3.5 h-3.5",
            md: "w-4 h-4",
            lg: "w-4 h-4",
            xl: "w-5 h-5",
        };

        const shapes = {
            rounded: "rounded-full",
            pill: "rounded-full",
            square: "rounded-md",
        };

        const shadowStyles = {
            none: "",
            sm: "shadow-sm",
            md: "shadow-md",
            lg: "shadow-lg",
        };

        const animationStyles = {
            none: "",
            pulse: "animate-pulse-soft",
            bounce: "animate-bounce-subtle",
            glow: "animate-glow",
        };

        const handleClose = (e: React.MouseEvent) => {
            e.stopPropagation();
            onClose?.();
        };

        return (
            <div
                ref={ref}
                className={cn(
                    baseStyles,
                    getVariantStyles(),
                    sizes[size],
                    shapes[shape],
                    shadowStyles[shadow],
                    animationStyles[animation],
                    interactive && "cursor-pointer hover:scale-105",
                    loading && "animate-pulse",
                    className
                )}
                role={interactive ? "button" : undefined}
                tabIndex={interactive ? 0 : undefined}
                {...props}
            >
                {dot && (
                    <span
                        className={cn(
                            "rounded-full bg-current mr-1.5",
                            dotSizes[size]
                        )}
                    />
                )}
                {icon && (
                    <span className={cn(
                        iconSizes[size],
                        children && "mr-1"
                    )}>
                        {icon}
                    </span>
                )}
                {children && (
                    <span className="truncate">{children}</span>
                )}
                {closable && (
                    <button
                        onClick={handleClose}
                        className={cn(
                            "ml-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors",
                            iconSizes[size]
                        )}
                        aria-label="Remove badge"
                    >
                        <X className="w-full h-full" />
                    </button>
                )}
            </div>
        );
    }
);

// Status Badge component for specific status indicators
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
    status: 'online' | 'offline' | 'away' | 'busy' | 'idle';
    showText?: boolean;
}

export const StatusBadge = forwardRef<HTMLDivElement, StatusBadgeProps>(
    ({ status, showText = true, ...props }, ref) => {
        const statusConfig = {
            online: { variant: 'success' as const, text: 'Online', color: 'bg-success-500' },
            offline: { variant: 'secondary' as const, text: 'Offline', color: 'bg-surface-500' },
            away: { variant: 'warning' as const, text: 'Away', color: 'bg-warning-500' },
            busy: { variant: 'error' as const, text: 'Busy', color: 'bg-error-500' },
            idle: { variant: 'accent' as const, text: 'Idle', color: 'bg-accent-500' },
        };

        const config = statusConfig[status];

        return (
            <Badge
                ref={ref}
                variant={config.variant}
                dot={!showText}
                {...props}
            >
                {showText && config.text}
            </Badge>
        );
    }
);

// Notification Badge component for counts
export interface NotificationBadgeProps extends Omit<BadgeProps, 'variant'> {
    count: number;
    max?: number;
    showZero?: boolean;
}

export const NotificationBadge = forwardRef<HTMLDivElement, NotificationBadgeProps>(
    ({ count, max = 99, showZero = false, ...props }, ref) => {
        if (count === 0 && !showZero) return null;

        const displayCount = count > max ? `${max}+` : count.toString();

        return (
            <Badge
                ref={ref}
                variant="error"
                size="sm"
                shape="pill"
                animation="pulse"
                {...props}
            >
                {displayCount}
            </Badge>
        );
    }
);

// Metric Badge component for displaying metrics
export interface MetricBadgeProps extends Omit<BadgeProps, 'variant'> {
    value: number | string;
    label: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: 'primary' | 'success' | 'warning' | 'error';
}

export const MetricBadge = forwardRef<HTMLDivElement, MetricBadgeProps>(
    ({ value, label, trend, color, ...props }, ref) => {
        const trendIcons = {
            up: '↗',
            down: '↘',
            neutral: '→',
        };

        const trendColors = {
            up: 'success',
            down: 'error',
            neutral: 'secondary',
        };

        const variant = color || (trend ? trendColors[trend] : 'primary');

        return (
            <Badge
                ref={ref}
                variant={variant as any}
                size="md"
                {...props}
            >
                <span className="font-semibold">{value}</span>
                <span className="mx-1 opacity-75">{label}</span>
                {trend && (
                    <span className="ml-1">{trendIcons[trend]}</span>
                )}
            </Badge>
        );
    }
);

// Add display names for better debugging
Badge.displayName = 'Badge';
StatusBadge.displayName = 'StatusBadge';
NotificationBadge.displayName = 'NotificationBadge';
MetricBadge.displayName = 'MetricBadge'; 