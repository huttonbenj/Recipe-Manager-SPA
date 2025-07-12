import React from 'react';
import { cn } from '../../../utils/cn';
import {
    Search,
    PlusCircle,
    ChefHat,
    BookOpen,
    Heart,
    Bookmark,
    AlertCircle,
    WifiOff,
    FileX,
    Users,
    MessageCircle,
    Calendar,
    Clock
} from 'lucide-react';
import { Button } from '../Button';
import { Link } from 'react-router-dom';

export interface EmptyStateProps {
    variant?: 'default' | 'no-results' | 'no-data' | 'error' | 'offline' | 'loading';
    title: string;
    description?: string;
    icon?: React.ComponentType<{ className?: string }>;
    illustration?: 'search' | 'recipes' | 'favorites' | 'bookmarks' | 'users' | 'comments' | 'calendar' | 'general';
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
        variant?: 'primary' | 'secondary' | 'outline';
    };
    secondaryAction?: {
        label: string;
        href?: string;
        onClick?: () => void;
        variant?: 'primary' | 'secondary' | 'outline';
    };
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const illustrations = {
    search: (className?: string) => (
        <div className={cn('relative', className)}>
            <div className="relative w-24 h-24 mx-auto">
                <Search className="w-12 h-12 text-surface-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute inset-0 rounded-full border-2 border-surface-300 dark:border-surface-600 animate-pulse" />
            </div>
        </div>
    ),
    recipes: (className?: string) => (
        <div className={cn('relative', className)}>
            <div className="relative w-24 h-24 mx-auto">
                <ChefHat className="w-12 h-12 text-surface-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
                    <PlusCircle className="w-3 h-3 text-white" />
                </div>
            </div>
        </div>
    ),
    favorites: (className?: string) => (
        <div className={cn('relative', className)}>
            <div className="relative w-24 h-24 mx-auto">
                <Heart className="w-12 h-12 text-surface-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            </div>
        </div>
    ),
    bookmarks: (className?: string) => (
        <div className={cn('relative', className)}>
            <div className="relative w-24 h-24 mx-auto">
                <Bookmark className="w-12 h-12 text-surface-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <BookOpen className="w-3 h-3 text-white" />
                </div>
            </div>
        </div>
    ),
    users: (className?: string) => (
        <div className={cn('relative', className)}>
            <div className="relative w-24 h-24 mx-auto">
                <Users className="w-12 h-12 text-surface-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <PlusCircle className="w-3 h-3 text-white" />
                </div>
            </div>
        </div>
    ),
    comments: (className?: string) => (
        <div className={cn('relative', className)}>
            <div className="relative w-24 h-24 mx-auto">
                <MessageCircle className="w-12 h-12 text-surface-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
            </div>
        </div>
    ),
    calendar: (className?: string) => (
        <div className={cn('relative', className)}>
            <div className="relative w-24 h-24 mx-auto">
                <Calendar className="w-12 h-12 text-surface-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                    <Clock className="w-3 h-3 text-white" />
                </div>
            </div>
        </div>
    ),
    general: (className?: string) => (
        <div className={cn('relative', className)}>
            <div className="relative w-24 h-24 mx-auto">
                <FileX className="w-12 h-12 text-surface-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute inset-0 rounded-full border-2 border-surface-300 dark:border-surface-600 animate-pulse" />
            </div>
        </div>
    ),
};

export const EmptyState: React.FC<EmptyStateProps> = ({
    variant = 'default',
    title,
    description,
    icon: Icon,
    illustration = 'general',
    action,
    secondaryAction,
    size = 'md',
    className
}) => {
    const sizeClasses = {
        sm: 'py-8 px-4',
        md: 'py-12 px-6',
        lg: 'py-16 px-8'
    };

    const titleSizes = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl'
    };

    const descriptionSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    const iconSizes = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32'
    };

    const variantStyles = {
        default: 'text-surface-600 dark:text-surface-400',
        'no-results': 'text-surface-600 dark:text-surface-400',
        'no-data': 'text-surface-600 dark:text-surface-400',
        error: 'text-red-600 dark:text-red-400',
        offline: 'text-orange-600 dark:text-orange-400',
        loading: 'text-blue-600 dark:text-blue-400'
    };

    const getDefaultIcon = () => {
        switch (variant) {
            case 'error':
                return AlertCircle;
            case 'offline':
                return WifiOff;
            case 'no-results':
                return Search;
            case 'no-data':
                return FileX;
            default:
                return FileX;
        }
    };

    const DefaultIcon = Icon || getDefaultIcon();
    const IllustrationComponent = illustrations[illustration];

    return (
        <div className={cn(
            'flex flex-col items-center justify-center text-center',
            sizeClasses[size],
            className
        )}>
            {/* Icon or Illustration */}
            <div className="mb-6">
                {Icon ? (
                    <div className={cn(
                        'mx-auto rounded-full bg-surface-100 dark:bg-surface-800 p-4',
                        iconSizes[size]
                    )}>
                        <DefaultIcon className={cn(
                            'mx-auto',
                            variantStyles[variant],
                            size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16'
                        )} />
                    </div>
                ) : (
                    IllustrationComponent("mb-2")
                )}
            </div>

            {/* Title */}
            <h3 className={cn(
                'font-semibold text-surface-900 dark:text-surface-50 mb-2',
                titleSizes[size]
            )}>
                {title}
            </h3>

            {/* Description */}
            {description && (
                <p className={cn(
                    'text-surface-600 dark:text-surface-400 mb-6 max-w-sm',
                    descriptionSizes[size]
                )}>
                    {description}
                </p>
            )}

            {/* Actions */}
            {(action || secondaryAction) && (
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                    {action && (
                        action.href ? (
                            <Link to={action.href}>
                                <Button
                                    variant={action.variant || 'primary'}
                                    size={size === 'sm' ? 'sm' : 'md'}
                                    className="w-full sm:w-auto"
                                >
                                    {action.label}
                                </Button>
                            </Link>
                        ) : (
                            <Button
                                variant={action.variant || 'primary'}
                                size={size === 'sm' ? 'sm' : 'md'}
                                onClick={action.onClick}
                                className="w-full sm:w-auto"
                            >
                                {action.label}
                            </Button>
                        )
                    )}

                    {secondaryAction && (
                        secondaryAction.href ? (
                            <Link to={secondaryAction.href}>
                                <Button
                                    variant={secondaryAction.variant || 'outline'}
                                    size={size === 'sm' ? 'sm' : 'md'}
                                    className="w-full sm:w-auto"
                                >
                                    {secondaryAction.label}
                                </Button>
                            </Link>
                        ) : (
                            <Button
                                variant={secondaryAction.variant || 'outline'}
                                size={size === 'sm' ? 'sm' : 'md'}
                                onClick={secondaryAction.onClick}
                                className="w-full sm:w-auto"
                            >
                                {secondaryAction.label}
                            </Button>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

// Preset empty state components
export const NoRecipesFound: React.FC<Omit<EmptyStateProps, 'variant' | 'illustration'>> = (props) => (
    <EmptyState
        variant="no-results"
        illustration="recipes"
        {...props}
    />
);

export const NoSearchResults: React.FC<Omit<EmptyStateProps, 'variant' | 'illustration'>> = (props) => (
    <EmptyState
        variant="no-results"
        illustration="search"
        {...props}
    />
);

export const NoFavorites: React.FC<Omit<EmptyStateProps, 'variant' | 'illustration'>> = (props) => (
    <EmptyState
        variant="no-data"
        illustration="favorites"
        {...props}
    />
);

export const NoBookmarks: React.FC<Omit<EmptyStateProps, 'variant' | 'illustration'>> = (props) => (
    <EmptyState
        variant="no-data"
        illustration="bookmarks"
        {...props}
    />
);

export const ErrorState: React.FC<Omit<EmptyStateProps, 'variant'>> = (props) => (
    <EmptyState
        variant="error"
        {...props}
    />
);

export const OfflineState: React.FC<Omit<EmptyStateProps, 'variant'>> = (props) => (
    <EmptyState
        variant="offline"
        {...props}
    />
); 