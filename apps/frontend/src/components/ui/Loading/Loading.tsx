/**
 * Loading component with different variants
 */

import React from 'react'
import { cn } from '@/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'skeleton' | 'dots'
  className?: string
  text?: string
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  variant = 'spinner', 
  className,
  text 
}) => {
  if (variant === 'skeleton') {
    return (
      <div className={cn('animate-pulse space-y-4', className)}>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex space-x-1 justify-center items-center', className)}>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    )
  }

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-primary-600', sizeClasses[size])}></div>
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  )
}

export default Loading