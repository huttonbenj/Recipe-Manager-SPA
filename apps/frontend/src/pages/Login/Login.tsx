/**
 * Login page component
 * Enhanced with modern design, animations, and mobile optimization
 */

import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Mail, Lock, ChefHat, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react'

// UI Components
import { Button, Card, CardHeader, CardBody } from '@/components/ui'

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
  const { login, errors: authErrors, clearErrors } = useAuth()

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })

  // UI state
  const [localErrors, setLocalErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)

  // Combine local validation errors with auth errors
  const errors: FormErrors = {
    ...localErrors,
    submit: authErrors.login
  }

  // Get redirect path from location state
  const from = location.state?.from?.pathname || '/'

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      // Clear any errors on successful login
      setLocalErrors({})
      clearErrors()
      navigate(from, { replace: true })
    },
    onError: (error: any) => {
      // Handle validation errors for form fields
      const fieldErrors: FormErrors = {}

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

      // Set local validation errors (auth error is handled in context)
      setLocalErrors(fieldErrors)
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

    // Validate form
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setLocalErrors(formErrors)
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
    if (localErrors[field]) {
      setLocalErrors(prev => ({ ...prev, [field]: undefined }))
    }

    // Clear auth error when user starts typing
    if (authErrors.login) {
      clearErrors()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/90 via-secondary-50/90 to-primary-100/90 dark:from-secondary-900/90 dark:via-secondary-800/90 dark:to-primary-900/90 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIG9wYWNpdHk9Ii4yIi8+PC9nPjwvc3ZnPg==')] opacity-30 dark:opacity-20 bg-repeat transform rotate-45 scale-150"></div>
      </div>

      <div className="max-w-md w-full space-y-6 sm:space-y-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-xl transform hover:rotate-6 transition-all duration-300 group">
              <ChefHat className="w-8 h-8 sm:w-10 sm:h-10 text-white transform group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary-900 to-primary-800 dark:from-white dark:to-primary-300 mb-2 sm:mb-3">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400 max-w-sm mx-auto">
            Sign in to your account and continue your culinary journey
          </p>
        </div>

        {/* Enhanced Login Form */}
        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-secondary-800/90 backdrop-blur-xl transform hover:scale-[1.01] transition-all duration-300">
          <CardHeader className="pb-4 sm:pb-6">
            <h2 className="text-lg sm:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-secondary-900 to-primary-700 dark:from-white dark:to-primary-400 text-center">
              Sign In to Your Account
            </h2>
          </CardHeader>
          <CardBody className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Submit Error Display - Enhanced Animation */}
              {errors.submit && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 flex items-start gap-3 animate-[shake_0.5s_ease-in-out]">
                  <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200 text-sm">Sign In Failed</h4>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-1">{errors.submit}</p>
                  </div>
                </div>
              )}

              {/* Email Field - Enhanced Focus States */}
              <div className="space-y-2 group">
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 dark:text-secondary-500 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    disabled={loginMutation.isPending}
                    className={`w-full pl-10 pr-4 py-3 sm:py-3.5 border rounded-xl bg-white/80 dark:bg-secondary-700/80 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-sm sm:text-base ${errors.email
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500/50 focus:border-red-500'
                      : 'border-secondary-300 dark:border-secondary-600 hover:border-secondary-400 dark:hover:border-secondary-500'
                      } ${loginMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-[slideIn_0.2s_ease-in-out]">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field - Enhanced Focus States */}
              <div className="space-y-2 group">
                <label htmlFor="password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 dark:text-secondary-500 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loginMutation.isPending}
                    className={`w-full pl-10 pr-12 py-3 sm:py-3.5 border rounded-xl bg-white/80 dark:bg-secondary-700/80 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-sm sm:text-base ${errors.password
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500/50 focus:border-red-500'
                      : 'border-secondary-300 dark:border-secondary-600 hover:border-secondary-400 dark:hover:border-secondary-500'
                      } ${loginMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-600/50"
                    disabled={loginMutation.isPending}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-[slideIn_0.2s_ease-in-out]">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password Link - Enhanced Hover Effect */}
              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors font-medium hover:underline decoration-2 underline-offset-2 transform hover:translate-x-0.5 transition-transform inline-flex items-center gap-1"
                >
                  Forgot your password?
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Submit Button - Enhanced Loading State */}
              <div>
                <Button
                  type="submit"
                  isFullWidth
                  isLoading={loginMutation.isPending}
                  size="lg"
                  className="group"
                  rightIcon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                >
                  Sign In
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Enhanced Sign Up Link */}
        <p className="text-center text-sm text-secondary-600 dark:text-secondary-400">
          Don&apos;t have an account?{' '}
          <Link to="/register">
            <Button variant="link" className="font-semibold">
              Sign up now
            </Button>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login