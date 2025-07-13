/**
 * Card component for content containers
 * TODO: Implement card with variants and hover states
 */

import React from 'react'
import { cn } from '@/utils'

export interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

const Card: React.FC<CardProps> = ({ children, className, hover = false }) => {
  return (
    <div className={cn('card', hover && 'hover:shadow-md transition-shadow', className)}>
      {children}
    </div>
  )
}

export default Card