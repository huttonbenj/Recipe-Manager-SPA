/**
 * Toast notification component
 * Displays individual toast notifications with animations and actions
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
 * Toast color classes
 */
const toastStyles = {
    success: {
        container: 'bg-green-50 border-green-200 text-green-800',
        icon: 'text-green-400',
        button: 'text-green-500 hover:text-green-600',
    },
    error: {
        container: 'bg-red-50 border-red-200 text-red-800',
        icon: 'text-red-400',
        button: 'text-red-500 hover:text-red-600',
    },
    warning: {
        container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        icon: 'text-yellow-400',
        button: 'text-yellow-500 hover:text-yellow-600',
    },
    info: {
        container: 'bg-blue-50 border-blue-200 text-blue-800',
        icon: 'text-blue-400',
        button: 'text-blue-500 hover:text-blue-600',
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
                'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 ease-in-out',
                styles.container,
                {
                    'translate-y-0 opacity-100 scale-100': isVisible && !isLeaving,
                    'translate-y-2 opacity-0 scale-95': !isVisible || isLeaving,
                }
            )}
        >
            <div className="p-4">
                <div className="flex items-start">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        <Icon className={clsx('h-6 w-6', styles.icon)} />
                    </div>

                    {/* Content */}
                    <div className="ml-3 w-0 flex-1">
                        {toast.title && (
                            <p className="text-sm font-medium">
                                {toast.title}
                            </p>
                        )}
                        <p className={clsx('text-sm', toast.title && 'mt-1')}>
                            {toast.message}
                        </p>

                        {/* Action button */}
                        {toast.action && (
                            <div className="mt-3">
                                <button
                                    type="button"
                                    onClick={handleActionClick}
                                    className={clsx(
                                        'text-sm font-medium underline hover:no-underline focus:outline-none focus:underline',
                                        styles.button
                                    )}
                                >
                                    {toast.action.label}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Close button */}
                    {toast.dismissible && (
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                type="button"
                                onClick={handleRemove}
                                className={clsx(
                                    'inline-flex rounded-md p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                                    styles.button,
                                    'focus:ring-offset-white focus:ring-current'
                                )}
                            >
                                <span className="sr-only">Dismiss</span>
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Toast 