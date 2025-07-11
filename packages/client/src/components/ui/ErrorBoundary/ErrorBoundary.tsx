import React, { Component, ReactNode } from 'react';
import { cn } from '../../../utils/cn';
import { AlertTriangle, RefreshCw, Home, Bug, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    onRetry?: () => void;
    enableErrorDetails?: boolean;
    enableReporting?: boolean;
    variant?: 'default' | 'minimal' | 'detailed';
    size?: 'sm' | 'md' | 'lg';
    showHomeButton?: boolean;
    showRetryButton?: boolean;
    showReportButton?: boolean;
    resetOnPropsChange?: boolean;
    isolate?: boolean;
    className?: string;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
    showDetails: boolean;
    copied: boolean;
    retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
    private resetTimeoutId?: number;

    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            showDetails: false,
            copied: false,
            retryCount: 0
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);

        this.setState({ errorInfo });

        // Call custom error handler
        this.props.onError?.(error, errorInfo);

        // Report error if enabled
        if (this.props.enableReporting) {
            this.reportError(error, errorInfo);
        }
    }

    override componentDidUpdate(prevProps: Props) {
        const { resetOnPropsChange, children } = this.props;
        const { hasError } = this.state;

        if (hasError && resetOnPropsChange && prevProps.children !== children) {
            this.resetError();
        }
    }

    override componentWillUnmount() {
        if (this.resetTimeoutId) {
            clearTimeout(this.resetTimeoutId);
        }
    }

    private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
        // In a real app, you would send this to your error reporting service
        console.error('Reporting error:', { error, errorInfo });

        // Example: Send to analytics or error tracking service
        // analytics.reportError(error, errorInfo);
    };

    private resetError = () => {
        this.setState({
            hasError: false,
            showDetails: false,
            copied: false,
            retryCount: 0
        });
    };

    private handleRetry = () => {
        const { onRetry } = this.props;
        const { retryCount } = this.state;

        this.setState({ retryCount: retryCount + 1 });

        if (onRetry) {
            onRetry();
        } else {
            this.resetError();
        }
    };

    private handleRefresh = () => {
        window.location.reload();
    };

    private handleNavigateHome = () => {
        window.location.href = '/';
    };

    private toggleDetails = () => {
        this.setState(prevState => ({ showDetails: !prevState.showDetails }));
    };

    private copyError = async () => {
        const { error, errorInfo } = this.state;

        if (!error) return;

        const errorText = `Error: ${error.message}
Stack: ${error.stack}
Component Stack: ${errorInfo?.componentStack}`;

        try {
            await navigator.clipboard.writeText(errorText);
            this.setState({ copied: true });

            // Reset copied state after 2 seconds
            setTimeout(() => {
                this.setState({ copied: false });
            }, 2000);
        } catch (err) {
            console.error('Failed to copy error:', err);
        }
    };

    private renderErrorDetails = () => {
        const { error, errorInfo, showDetails } = this.state;

        if (!error || !showDetails) return null;

        return (
            <div className="mt-6 p-4 bg-surface-50 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-surface-900 dark:text-surface-50">
                        Error Details
                    </h4>
                    <button
                        onClick={this.copyError}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-50 transition-colors"
                    >
                        {this.state.copied ? (
                            <>
                                <Check className="w-3 h-3 mr-1" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                            </>
                        )}
                    </button>
                </div>

                <div className="space-y-3">
                    <div>
                        <p className="text-xs font-medium text-surface-700 dark:text-surface-300 mb-1">
                            Error Message:
                        </p>
                        <p className="text-xs text-error-600 dark:text-error-400 font-mono bg-error-50 dark:bg-error-950 p-2 rounded">
                            {error.message}
                        </p>
                    </div>

                    {error.stack && (
                        <div>
                            <p className="text-xs font-medium text-surface-700 dark:text-surface-300 mb-1">
                                Stack Trace:
                            </p>
                            <pre className="text-xs text-surface-600 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 p-2 rounded overflow-x-auto max-h-32">
                                {error.stack}
                            </pre>
                        </div>
                    )}

                    {errorInfo?.componentStack && (
                        <div>
                            <p className="text-xs font-medium text-surface-700 dark:text-surface-300 mb-1">
                                Component Stack:
                            </p>
                            <pre className="text-xs text-surface-600 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 p-2 rounded overflow-x-auto max-h-32">
                                {errorInfo.componentStack}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    private renderActions = () => {
        const {
            showHomeButton = true,
            showRetryButton = true,
            showReportButton = false,
            enableErrorDetails = true
        } = this.props;
        const { retryCount } = this.state;

        return (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {showRetryButton && (
                    <button
                        onClick={this.handleRetry}
                        disabled={retryCount >= 3}
                        className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {retryCount >= 3 ? 'Max retries reached' : 'Try Again'}
                    </button>
                )}

                <button
                    onClick={this.handleRefresh}
                    className="inline-flex items-center px-4 py-2 bg-surface-200 text-surface-900 hover:bg-surface-300 dark:bg-surface-700 dark:text-surface-50 dark:hover:bg-surface-600 rounded-md focus:outline-none focus:ring-2 focus:ring-surface-500 transition-colors"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Page
                </button>

                {showHomeButton && (
                    <button
                        onClick={this.handleNavigateHome}
                        className="inline-flex items-center px-4 py-2 bg-surface-200 text-surface-900 hover:bg-surface-300 dark:bg-surface-700 dark:text-surface-50 dark:hover:bg-surface-600 rounded-md focus:outline-none focus:ring-2 focus:ring-surface-500 transition-colors"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Go Home
                    </button>
                )}

                {showReportButton && (
                    <button
                        onClick={() => this.reportError(this.state.error!, this.state.errorInfo!)}
                        className="inline-flex items-center px-4 py-2 bg-warning-600 text-white hover:bg-warning-700 rounded-md focus:outline-none focus:ring-2 focus:ring-warning-500 transition-colors"
                    >
                        <Bug className="w-4 h-4 mr-2" />
                        Report Issue
                    </button>
                )}

                {enableErrorDetails && (
                    <button
                        onClick={this.toggleDetails}
                        className="inline-flex items-center px-4 py-2 bg-surface-200 text-surface-900 hover:bg-surface-300 dark:bg-surface-700 dark:text-surface-50 dark:hover:bg-surface-600 rounded-md focus:outline-none focus:ring-2 focus:ring-surface-500 transition-colors"
                    >
                        {this.state.showDetails ? (
                            <>
                                <ChevronUp className="w-4 h-4 mr-2" />
                                Hide Details
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4 mr-2" />
                                Show Details
                            </>
                        )}
                    </button>
                )}
            </div>
        );
    };

    private renderError = () => {
        const {
            variant = 'default',
            size = 'md',
            isolate = false,
            className
        } = this.props;
        const { error, retryCount } = this.state;

        const containerClasses = cn(
            'flex items-center justify-center p-4 animate-in fade-in duration-500',
            isolate ? 'min-h-64' : 'min-h-screen',
            'bg-surface-50 dark:bg-surface-950',
            className
        );

        const cardClasses = cn(
            'w-full bg-white dark:bg-surface-900 shadow-lg rounded-lg border border-surface-200 dark:border-surface-700',
            size === 'sm' && 'max-w-sm p-4',
            size === 'md' && 'max-w-md p-6',
            size === 'lg' && 'max-w-lg p-8'
        );

        const iconClasses = cn(
            'mx-auto mb-4 text-error-500',
            size === 'sm' && 'w-8 h-8',
            size === 'md' && 'w-12 h-12',
            size === 'lg' && 'w-16 h-16'
        );

        if (variant === 'minimal') {
            return (
                <div className={containerClasses}>
                    <div className={cardClasses}>
                        <div className="text-center">
                            <AlertTriangle className={iconClasses} />
                            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50 mb-2">
                                Oops! Something went wrong
                            </h2>
                            <div className="flex justify-center">
                                <button
                                    onClick={this.handleRetry}
                                    disabled={retryCount >= 3}
                                    className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    {retryCount >= 3 ? 'Refresh page' : 'Try again'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className={containerClasses}>
                <div className={cardClasses}>
                    <div className="text-center">
                        <AlertTriangle className={iconClasses} />

                        <h2 className={cn(
                            'font-bold text-surface-900 dark:text-surface-50 mb-4 font-display',
                            size === 'sm' && 'text-lg',
                            size === 'md' && 'text-xl',
                            size === 'lg' && 'text-2xl'
                        )}>
                            {variant === 'detailed' ? 'Application Error' : 'Something went wrong'}
                        </h2>

                        <div className="mb-6 space-y-2">
                            <p className="text-surface-600 dark:text-surface-400">
                                {variant === 'detailed'
                                    ? 'An unexpected error occurred while loading this page. This could be due to a temporary issue or a bug in the application.'
                                    : 'We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.'
                                }
                            </p>

                            {variant === 'detailed' && error && (
                                <div className="mt-4 p-3 bg-error-50 dark:bg-error-950 rounded-lg border border-error-200 dark:border-error-800">
                                    <p className="text-sm text-error-700 dark:text-error-300 font-mono">
                                        {error.message}
                                    </p>
                                </div>
                            )}

                            {retryCount > 0 && (
                                <p className="text-sm text-warning-600 dark:text-warning-400">
                                    Retry attempts: {retryCount}/3
                                </p>
                            )}
                        </div>

                        {this.renderActions()}
                        {this.renderErrorDetails()}
                    </div>
                </div>
            </div>
        );
    };

    override render() {
        const { hasError } = this.state;
        const { fallback, children } = this.props;

        if (hasError) {
            return fallback || this.renderError();
        }

        return children;
    }
}

// Functional component wrapper for easier use with hooks
export interface ErrorBoundaryWrapperProps extends Omit<Props, 'onError'> {
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = (props) => {
    return <ErrorBoundary {...props} />;
};
// Higher-order component for automatic error boundary wrapping
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Partial<Props>
) {
    const WrappedComponent: React.FC<P> = (props) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

    return WrappedComponent;
}

// Hook for error boundary context (for functional components)
export const useErrorBoundary = () => {
    const [error, setError] = React.useState<Error | null>(null);

    const resetError = React.useCallback(() => {
        setError(null);
    }, []);

    const captureError = React.useCallback((error: Error) => {
        setError(error);
    }, []);

    React.useEffect(() => {
        if (error) {
            throw error;
        }
    }, [error]);

    return {
        captureError,
        resetError,
    };
};



ErrorBoundaryWrapper.displayName = 'ErrorBoundaryWrapper'; 
