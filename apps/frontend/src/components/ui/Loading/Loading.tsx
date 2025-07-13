/**
 * Loading component with various spinner types and sizes
 * Provides flexible loading states for different use cases
 */

import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils'

export interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
  fullScreen?: boolean
  overlay?: boolean
}

const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  text,
  className,
  fullScreen = false,
  overlay = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  const spinnerSizeClasses = {
    sm: 'text-sm gap-2',
    md: 'text-base gap-3',
    lg: 'text-lg gap-4',
    xl: 'text-xl gap-5',
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <Loader2
            className={cn('loading-spinner', sizeClasses[size])}
          />
        )

      case 'dots':
        return (
          <div className="loading-dots">
            <div className={cn('loading-dot', sizeClasses[size])} style={{ animationDelay: '0ms' }} />
            <div className={cn('loading-dot', sizeClasses[size])} style={{ animationDelay: '150ms' }} />
            <div className={cn('loading-dot', sizeClasses[size])} style={{ animationDelay: '300ms' }} />
          </div>
        )

      case 'pulse':
        return (
          <div className={cn('loading-pulse', sizeClasses[size])} />
        )

      case 'skeleton':
        return (
          <div className="space-y-3 w-full">
            <div className="skeleton-text" />
            <div className="skeleton-text w-3/4" />
            <div className="skeleton-text w-1/2" />
          </div>
        )

      default:
        return (
          <Loader2
            className={cn('loading-spinner', sizeClasses[size])}
          />
        )
    }
  }

  const loadingContent = (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        spinnerSizeClasses[size],
        className
      )}
    >
      {renderSpinner()}
      {text && (
        <span className={cn('text-secondary-600 dark:text-secondary-400 font-medium', textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        {loadingContent}
      </div>
    )
  }

  if (overlay) {
    return (
      <div className="loading-overlay">
        {loadingContent}
      </div>
    )
  }

  return loadingContent
}

// Preset loading components for common use cases
export const PageLoading: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <Loading variant="spinner" size="lg" text={text} fullScreen />
)

export const ComponentLoading: React.FC<{ text?: string }> = ({ text }) => (
  <Loading variant="spinner" size="md" text={text} className="py-8" />
)

export const ButtonLoading: React.FC = () => (
  <Loading variant="spinner" size="sm" />
)

export const SkeletonLoading: React.FC<{ className?: string }> = ({ className }) => (
  <Loading variant="skeleton" className={className} />
)

export default Loading