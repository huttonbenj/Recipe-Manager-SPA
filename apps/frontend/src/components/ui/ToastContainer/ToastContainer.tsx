/**
 * Toast container component
 * Manages the display and positioning of multiple toast notifications
 * Fully compatible with theme system
 */

import React from 'react'
import { createPortal } from 'react-dom'
import { useToast } from '@/context/ToastContext'
import Toast from '../Toast/Toast'

export type ToastPosition =
    | 'top-right'
    | 'top-left'
    | 'top-center'
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center'

interface ToastContainerProps {
    position?: ToastPosition
    maxToasts?: number
}

/**
 * Position class mapping
 */
const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
    position = 'top-right',
    maxToasts = 5,
}) => {
    const { toasts, removeToast } = useToast()

    // Limit the number of toasts displayed
    const visibleToasts = toasts.slice(-maxToasts)

    // Don't render if no toasts
    if (visibleToasts.length === 0) {
        return null
    }

    const containerContent = (
        <div
            className={`fixed z-50 flex flex-col space-y-4 pointer-events-none ${positionClasses[position]}`}
            style={{ zIndex: 9999 }}
            aria-live="polite"
            aria-atomic="true"
        >
            {visibleToasts.map((toast) => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    onRemove={removeToast}
                />
            ))}
        </div>
    )

    // Render toasts in a portal to ensure they appear on top
    return createPortal(
        containerContent,
        document.body
    )
}

export default ToastContainer 