/**
 * Toast notification component
 * Displays individual toast notifications with animations and actions
 * Fully compatible with theme system
 */

import React, { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { clsx } from 'clsx'
import type { Toast as ToastType } from '@/types/toast'

interface ToastProps {
    toast: ToastType
    onRemove: (id: string) => void
}

/**
 * Toast icon mapping
 */
const toastIcons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
}

/**
 * Toast color classes with dark mode support - optimized for mobile consistency
 */
const toastStyles = {
    success: {
        container: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-100',
        icon: 'text-green-500 dark:text-green-400',
        button: 'text-green-600 dark:text-green-300 hover:text-green-700 dark:hover:text-green-200',
        close: 'text-green-600 dark:text-green-300 hover:text-green-700 dark:hover:text-green-200',
    },
    error: {
        container: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-100',
        icon: 'text-red-500 dark:text-red-400',
        button: 'text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200',
        close: 'text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200',
    },
    warning: {
        container: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-100',
        icon: 'text-amber-500 dark:text-amber-400',
        button: 'text-amber-600 dark:text-amber-300 hover:text-amber-700 dark:hover:text-amber-200',
        close: 'text-amber-600 dark:text-amber-300 hover:text-amber-700 dark:hover:text-amber-200',
    },
    info: {
        container: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-100',
        icon: 'text-blue-500 dark:text-blue-400',
        button: 'text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200',
        close: 'text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200',
    },
}

export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [isLeaving, setIsLeaving] = useState(false)

    const Icon = toastIcons[toast.type]
    const styles = toastStyles[toast.type]

    // Animation effects
    useEffect(() => {
        // Trigger enter animation
        const timer = setTimeout(() => setIsVisible(true), 50)
        return () => clearTimeout(timer)
    }, [])

    /**
     * Handle toast removal with exit animation
     */
    const handleRemove = () => {
        setIsLeaving(true)
        setTimeout(() => onRemove(toast.id), 300)
    }

    /**
     * Handle action button click
     */
    const handleActionClick = () => {
        if (toast.action?.onClick) {
            toast.action.onClick()
            handleRemove()
        }
    }

    return (
        <div
            className={clsx(
                'w-full rounded-lg border shadow-lg transition-all duration-300 md:max-w-2xl mx-3 sm:mx-0',
                styles.container,
                {
                    'translate-y-0 opacity-100 scale-100': isVisible && !isLeaving,
                    'translate-y-2 opacity-0 scale-95': !isVisible || isLeaving,
                }
            )}
        >
            <div className="px-3 py-3 sm:px-4 sm:py-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                        <Icon className={clsx('w-5 h-5 mt-0.5 flex-shrink-0', styles.icon)} />
                        <div className="min-w-0 flex-1">
                            {toast.title && (
                                <h4 className="text-sm font-medium leading-5 mb-1">
                                    {toast.title}
                                </h4>
                            )}
                            <p className="text-sm leading-5 break-words">
                                {toast.message}
                            </p>
                            {toast.action && (
                                <button
                                    onClick={handleActionClick}
                                    className={clsx(
                                        'text-sm font-medium underline mt-2 transition-colors',
                                        styles.button
                                    )}
                                >
                                    {toast.action.label}
                                </button>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleRemove}
                        className={clsx(
                            'flex-shrink-0 p-1 rounded-md transition-colors',
                            styles.close
                        )}
                        aria-label="Close notification"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Toast 