import React, { useEffect, useRef, useState, forwardRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../utils/cn';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
    position?: 'center' | 'top' | 'bottom';
    animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'slide-right' | 'slide-left';
    variant?: 'default' | 'glass' | 'elevated';
    closable?: boolean;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    showOverlay?: boolean;
    blurBackdrop?: boolean;
    className?: string;
    overlayClassName?: string;
    preventScroll?: boolean;
    autoFocus?: boolean;
    trapFocus?: boolean;
    role?: 'dialog' | 'alertdialog';
    ariaLabel?: string;
    ariaDescribedBy?: string;
    onOpenChange?: (open: boolean) => void;
    onAnimationEnd?: () => void;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    position = 'center',
    animation = 'fade',
    variant = 'default',
    closable = true,
    closeOnBackdrop = true,
    closeOnEscape = true,
    showOverlay = true,
    blurBackdrop = true,
    className,
    overlayClassName,
    preventScroll = true,
    autoFocus = true,
    trapFocus = true,
    role = 'dialog',
    ariaLabel,
    ariaDescribedBy,
    onOpenChange,
    onAnimationEnd,
}, _ref) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Handle escape key press
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && closeOnEscape && closable) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            if (preventScroll) {
                document.body.style.overflow = 'hidden';
            }
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            if (preventScroll) {
                document.body.style.overflow = 'unset';
            }
        };
    }, [isOpen, onClose, closable, closeOnEscape, preventScroll]);

    // Handle backdrop click
    const handleBackdropClick = useCallback((event: React.MouseEvent) => {
        if (event.target === event.currentTarget && closeOnBackdrop && closable) {
            onClose();
        }
    }, [closeOnBackdrop, closable, onClose]);

    // Focus management and focus trapping
    useEffect(() => {
        if (isOpen && modalRef.current) {
            const modal = modalRef.current;
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (autoFocus && firstElement) {
                firstElement.focus();
            }

            if (trapFocus) {
                const handleTabKey = (event: KeyboardEvent) => {
                    if (event.key === 'Tab') {
                        if (event.shiftKey) {
                            if (document.activeElement === firstElement) {
                                lastElement.focus();
                                event.preventDefault();
                            }
                        } else {
                            if (document.activeElement === lastElement) {
                                firstElement.focus();
                                event.preventDefault();
                            }
                        }
                    }
                };

                document.addEventListener('keydown', handleTabKey);
                return () => document.removeEventListener('keydown', handleTabKey);
            }
        }
        return () => { }; // Ensure all code paths return a cleanup function
    }, [isOpen, autoFocus, trapFocus]);

    // Animation management
    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsAnimating(false);
                onAnimationEnd?.();
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setIsAnimating(false);
                onAnimationEnd?.();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onAnimationEnd]);

    // Notify parent of open state changes
    useEffect(() => {
        onOpenChange?.(isOpen);
    }, [isOpen, onOpenChange]);

    if (!isVisible) return null;

    const sizeClasses = {
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        full: 'max-w-full min-h-screen',
    };

    const positionClasses = {
        center: 'items-center justify-center',
        top: 'items-start justify-center pt-16',
        bottom: 'items-end justify-center pb-16',
    };

    const animationClasses = {
        fade: {
            enter: 'opacity-0',
            enterActive: 'opacity-100 transition-opacity duration-300',
            exit: 'opacity-100',
            exitActive: 'opacity-0 transition-opacity duration-300',
        },
        'slide-up': {
            enter: 'opacity-0 translate-y-8',
            enterActive: 'opacity-100 translate-y-0 transition-all duration-300',
            exit: 'opacity-100 translate-y-0',
            exitActive: 'opacity-0 translate-y-8 transition-all duration-300',
        },
        'slide-down': {
            enter: 'opacity-0 -translate-y-8',
            enterActive: 'opacity-100 translate-y-0 transition-all duration-300',
            exit: 'opacity-100 translate-y-0',
            exitActive: 'opacity-0 -translate-y-8 transition-all duration-300',
        },
        scale: {
            enter: 'opacity-0 scale-95',
            enterActive: 'opacity-100 scale-100 transition-all duration-300',
            exit: 'opacity-100 scale-100',
            exitActive: 'opacity-0 scale-95 transition-all duration-300',
        },
        'slide-right': {
            enter: 'opacity-0 -translate-x-8',
            enterActive: 'opacity-100 translate-x-0 transition-all duration-300',
            exit: 'opacity-100 translate-x-0',
            exitActive: 'opacity-0 -translate-x-8 transition-all duration-300',
        },
        'slide-left': {
            enter: 'opacity-0 translate-x-8',
            enterActive: 'opacity-100 translate-x-0 transition-all duration-300',
            exit: 'opacity-100 translate-x-0',
            exitActive: 'opacity-0 translate-x-8 transition-all duration-300',
        },
    };

    const variantClasses = {
        default: 'bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700',
        glass: 'bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm border border-white/20 dark:border-surface-700/30',
        elevated: 'bg-white dark:bg-surface-900 shadow-2xl border border-surface-200 dark:border-surface-700',
    };

    const currentAnimation = animationClasses[animation];
    const animationClass = isOpen
        ? (isAnimating ? currentAnimation.enterActive : currentAnimation.enterActive)
        : (isAnimating ? currentAnimation.exitActive : currentAnimation.exit);

    const overlayAnimationClass = isOpen
        ? (isAnimating ? 'opacity-100 transition-opacity duration-300' : 'opacity-100')
        : (isAnimating ? 'opacity-0 transition-opacity duration-300' : 'opacity-0');

    return createPortal(
        <div
            className={cn(
                'fixed inset-0 z-50 flex p-4',
                positionClasses[position],
                showOverlay && 'bg-black/50 dark:bg-black/70',
                blurBackdrop && 'backdrop-blur-sm',
                overlayAnimationClass,
                overlayClassName
            )}
            onClick={handleBackdropClick}
            role="presentation"
        >
            <div
                ref={modalRef}
                className={cn(
                    'relative w-full rounded-lg shadow-xl transform',
                    sizeClasses[size],
                    variantClasses[variant],
                    animationClass,
                    size === 'full' && 'rounded-none',
                    className
                )}
                role={role}
                aria-modal="true"
                aria-label={ariaLabel || title}
                aria-describedby={ariaDescribedBy}
                tabIndex={-1}
            >
                {/* Header */}
                {(title || closable) && (
                    <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
                        {title && (
                            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 font-display">
                                {title}
                            </h2>
                        )}
                        {closable && (
                            <button
                                onClick={onClose}
                                className="p-2 text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 transition-colors rounded-md hover:bg-surface-100 dark:hover:bg-surface-800"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
});

// Modal Header Component
export interface ModalHeaderProps {
    children: React.ReactNode;
    className?: string;
    onClose?: () => void;
    closable?: boolean;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
    children,
    className,
    onClose,
    closable = true,
}) => (
    <div className={cn(
        'flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700',
        className
    )}>
        <div className="flex-1 min-w-0">
            {children}
        </div>
        {closable && onClose && (
            <button
                onClick={onClose}
                className="ml-4 p-2 text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 transition-colors rounded-md hover:bg-surface-100 dark:hover:bg-surface-800"
                aria-label="Close modal"
            >
                <X className="w-5 h-5" />
            </button>
        )}
    </div>
);

// Modal Body Component
export interface ModalBodyProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const ModalBody: React.FC<ModalBodyProps> = ({
    children,
    className,
    padding = 'md',
}) => {
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div className={cn(paddingClasses[padding], className)}>
            {children}
        </div>
    );
};

// Modal Footer Component
export interface ModalFooterProps {
    children: React.ReactNode;
    className?: string;
    justify?: 'start' | 'center' | 'end' | 'between';
    bordered?: boolean;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
    children,
    className,
    justify = 'end',
    bordered = true,
}) => {
    const justifyClasses = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
    };

    return (
        <div className={cn(
            'flex items-center gap-3 p-6',
            justifyClasses[justify],
            bordered && 'border-t border-surface-200 dark:border-surface-700',
            className
        )}>
            {children}
        </div>
    );
};

// Confirmation Modal Component
export interface ConfirmationModalProps extends Omit<ModalProps, 'children'> {
    type?: 'info' | 'success' | 'warning' | 'error';
    message: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    loading?: boolean;
    danger?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    type = 'info',
    message,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    loading = false,
    danger = false,
    ...modalProps
}) => {
    const icons = {
        info: <Info className="w-6 h-6 text-blue-500" />,
        success: <CheckCircle className="w-6 h-6 text-green-500" />,
        warning: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
        error: <AlertCircle className="w-6 h-6 text-red-500" />,
    };

    const colors = {
        info: 'text-blue-600 dark:text-blue-400',
        success: 'text-green-600 dark:text-green-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        error: 'text-red-600 dark:text-red-400',
    };

    return (
        <Modal
            {...modalProps}
            size="sm"
            role="alertdialog"
            className="max-w-md"
        >
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    {icons[type]}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className={cn(
                        'text-lg font-semibold font-display',
                        colors[type]
                    )}>
                        {message}
                    </h3>
                    {description && (
                        <p className="mt-2 text-sm text-surface-600 dark:text-surface-400">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <button
                    onClick={onCancel || modalProps.onClose}
                    className="px-4 py-2 text-sm font-medium text-surface-700 bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700 rounded-md transition-colors"
                    disabled={loading}
                >
                    {cancelText}
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={cn(
                        'px-4 py-2 text-sm font-medium text-white rounded-md transition-colors',
                        'flex items-center space-x-2',
                        danger || type === 'error'
                            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                            : 'bg-brand-600 hover:bg-brand-700 focus:ring-brand-500',
                        loading && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    {loading && (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    )}
                    <span>{confirmText}</span>
                </button>
            </div>
        </Modal>
    );
};

// Add display names for better debugging
Modal.displayName = 'Modal';
ModalHeader.displayName = 'ModalHeader';
ModalBody.displayName = 'ModalBody';
ModalFooter.displayName = 'ModalFooter';
ConfirmationModal.displayName = 'ConfirmationModal'; 