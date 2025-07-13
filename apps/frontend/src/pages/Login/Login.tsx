/**
 * Login page component
 * Provides user authentication with form validation and API integration
 */

import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Mail, Lock, Loader2 } from 'lucide-react'

// UI Components
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

// Services and hooks
import { useAuth } from '@/hooks/useAuth'


/**
 * Form validation schema
 */
interface FormErrors {
  email?: string
  password?: string
  submit?: string
}

/**
 * Login form data interface
 */
interface LoginFormData {
  email: string
  password: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })

  // UI state
  const [errors, setErrors] = useState<FormErrors>({})

  // Get redirect path from location state
  const from = location.state?.from?.pathname || '/'

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate(from, { replace: true })
    },
    onError: (error: any) => {
      console.error('Login error:', error) // Debug logging

      let errorMessage = 'Login failed. Please check your credentials.'
      let fieldErrors: FormErrors = {}

      // Extract specific error message
      if (error?.message) {
        errorMessage = error.message
      } else if (error?.details?.message) {
        errorMessage = error.details.message
      }

      // Handle validation errors
      if (error?.details?.issues) {
        error.details.issues.forEach((issue: any) => {
          if (issue.field === 'email') {
            fieldErrors.email = issue.message
          } else if (issue.field === 'password') {
            fieldErrors.password = issue.message
          }
        })
      }

      // Set form errors
      setErrors({
        submit: errorMessage,
        ...fieldErrors
      })
    }
  })

  /**
   * Validate form fields
   */
  const validateForm = (): FormErrors => {
    const errors: FormErrors = {}

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    return errors
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    setErrors({})

    // Validate form
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    // Submit login request
    loginMutation.mutate(formData)
  }

  /**
   * Handle input changes
   */
  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground dark:text-foreground-dark">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Submit Error Display */}
            {errors.submit && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
              </div>
            )}

            {/* Email Field */}
            <Input
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              leftIcon={<Mail className="h-5 w-5" />}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loginMutation.isPending}
              error={errors.email}
              required
            />

            {/* Password Field */}
            <Input
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              leftIcon={<Lock className="h-5 w-5" />}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loginMutation.isPending}
              error={errors.password}
              showPasswordToggle
              required
            />

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Login