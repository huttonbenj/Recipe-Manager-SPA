/**
 * Error boundary component
 * Catches JavaScript errors anywhere in the component tree
 */

import { Component, ErrorInfo, ReactNode } from 'react'
import Button from '@/components/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-accent-600 dark:text-accent-400 mb-4">Something went wrong</h1>
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">We&apos;re sorry, but something unexpected happened.</p>
            <Button variant="primary">Try again</Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary