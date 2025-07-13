/**
 * Toast notification types
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
}

export interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  success: (message: string, options?: Partial<Toast>) => void
  error: (message: string, options?: Partial<Toast>) => void
  warning: (message: string, options?: Partial<Toast>) => void
  info: (message: string, options?: Partial<Toast>) => void
} 