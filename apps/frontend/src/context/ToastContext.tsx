/**
 * Toast notification context provider
 * Manages toast notifications across the application
 */

import React, { createContext, useContext, useState, useCallback } from 'react'
import type { Toast, ToastContextType } from '@/types/toast'

// Create context
const ToastContext = createContext<ToastContextType | null>(null)

interface ToastProviderProps {
    children: React.ReactNode
}

/**
 * Toast provider component
 */
export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([])

    /**
     * Generate unique ID for toast
     */
    const generateId = useCallback(() => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2)
    }, [])

    /**
     * Add a new toast
     */
    const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
        const toast: Toast = {
            id: generateId(),
            duration: 5000,
            dismissible: true,
            ...toastData,
        }

        setToasts(prev => [...prev, toast])

        // Auto-remove toast after duration
        if (toast.duration && toast.duration > 0) {
            setTimeout(() => {
                removeToast(toast.id)
            }, toast.duration)
        }
    }, [generateId])

    /**
     * Remove a toast by ID
     */
    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    /**
     * Clear all toasts
     */
    const clearToasts = useCallback(() => {
        setToasts([])
    }, [])

    /**
     * Convenience methods for different toast types
     */
    const success = useCallback((message: string, options?: Partial<Toast>) => {
        addToast({ type: 'success', message, ...options })
    }, [addToast])

    const error = useCallback((message: string, options?: Partial<Toast>) => {
        addToast({ type: 'error', message, duration: 7000, ...options })
    }, [addToast])

    const warning = useCallback((message: string, options?: Partial<Toast>) => {
        addToast({ type: 'warning', message, duration: 6000, ...options })
    }, [addToast])

    const info = useCallback((message: string, options?: Partial<Toast>) => {
        addToast({ type: 'info', message, ...options })
    }, [addToast])

    const value: ToastContextType = {
        toasts,
        addToast,
        removeToast,
        clearToasts,
        success,
        error,
        warning,
        info,
    }

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    )
}

/**
 * Hook to use toast context
 */
export function useToast(): ToastContextType {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }

    return context
} 