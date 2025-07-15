/**
 * Register page component
 * Enhanced with modern design, animations, and mobile optimization
 */

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Mail, Lock, User, ChefHat, AlertCircle, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'

// UI Components
import { Button, Card, CardHeader, CardBody, Loading } from '@/components/ui'

// Hooks
import { useAuth } from '@/hooks/useAuth'

/**
 * Form validation schema
 */
interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  name?: string
  submit?: string
}

/**
 * Register form data interface
 */
interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  name: string
}

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { register, errors: authErrors, clearErrors } = useAuth()

  // Form state
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })

  // UI state
  const [localErrors, setLocalErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Combine local validation errors with auth errors
  const errors: FormErrors = {
    ...localErrors,
    submit: authErrors.register
  }

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      // Clear any errors on successful registration
      setLocalErrors({})
      clearErrors()
      navigate('/')
    },
    onError: (error: any) => {
      const fieldErrors: FormErrors = {}

      // Handle validation errors
      if (error?.details?.issues) {
        error.details.issues.forEach((issue: any) => {
          if (issue.field === 'email') {
            fieldErrors.email = issue.message
          } else if (issue.field === 'password') {
            fieldErrors.password = issue.message
          } else if (issue.field === 'name') {
            fieldErrors.name = issue.message
          }
        })
      }

      // Handle specific error cases
      if (error?.message?.includes('already exists')) {
        fieldErrors.email = 'An account with this email already exists'
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

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Full name is required'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
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

    // Submit registration request
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = formData
    registerMutation.mutate(registerData)
  }

  /**
   * Handle input changes
   */
  const handleInputChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear field error when user starts typing
    if (localErrors[field]) {
      setLocalErrors(prev => ({ ...prev, [field]: undefined }))
    }

    // Clear auth error when user starts typing
    if (authErrors.register) {
      clearErrors()
    }
  }

  /**
   * Password strength indicator
   */
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 dark:from-secondary-900 dark:via-secondary-800 dark:to-primary-900 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-secondary-100/20 dark:from-primary-900/20 dark:to-secondary-900/20"></div>
      </div>

      <div className="max-w-md w-full space-y-6 sm:space-y-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
              <ChefHat className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-white mb-2 sm:mb-3">
            Join Our Community
          </h1>
          <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400 max-w-sm mx-auto">
            Create your account and start sharing amazing recipes with food enthusiasts worldwide
          </p>
        </div>

        {/* Enhanced Register Form */}
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-xl">
          <CardHeader className="pb-4 sm:pb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-white text-center">
              Create Your Account
            </h2>
          </CardHeader>
          <CardBody className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Submit Error Display */}
              {errors.submit && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 flex items-start gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200 text-sm">Registration Failed</h4>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-1">{errors.submit}</p>
                  </div>
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 dark:text-secondary-500 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    disabled={registerMutation.isPending}
                    className={`w-full pl-10 pr-4 py-3 sm:py-3.5 border rounded-xl bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${errors.name
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
                      : 'border-secondary-300 dark:border-secondary-600 hover:border-secondary-400 dark:hover:border-secondary-500'
                      } ${registerMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 dark:text-secondary-500 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    disabled={registerMutation.isPending}
                    className={`w-full pl-10 pr-4 py-3 sm:py-3.5 border rounded-xl bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${errors.email
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
                      : 'border-secondary-300 dark:border-secondary-600 hover:border-secondary-400 dark:hover:border-secondary-500'
                      } ${registerMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 dark:text-secondary-500 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    disabled={registerMutation.isPending}
                    className={`w-full pl-10 pr-12 py-3 sm:py-3.5 border rounded-xl bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${errors.password
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
                      : 'border-secondary-300 dark:border-secondary-600 hover:border-secondary-400 dark:hover:border-secondary-500'
                      } ${registerMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
                    disabled={registerMutation.isPending}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 w-full rounded-full transition-colors duration-200 ${passwordStrength >= level
                            ? passwordStrength <= 2
                              ? 'bg-red-500'
                              : passwordStrength <= 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            : 'bg-secondary-200 dark:bg-secondary-600'
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-secondary-600 dark:text-secondary-400">
                      Password strength: {' '}
                      <span className={
                        passwordStrength <= 2 ? 'text-red-600 dark:text-red-400' :
                          passwordStrength <= 3 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-green-600 dark:text-green-400'
                      }>
                        {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Medium' : 'Strong'}
                      </span>
                    </p>
                  </div>
                )}

                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}

                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  Must be at least 8 characters with uppercase, lowercase, and number
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 dark:text-secondary-500 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    disabled={registerMutation.isPending}
                    className={`w-full pl-10 pr-12 py-3 sm:py-3.5 border rounded-xl bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${errors.confirmPassword
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
                      : formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-300 dark:border-green-700 focus:ring-green-500'
                        : 'border-secondary-300 dark:border-secondary-600 hover:border-secondary-400 dark:hover:border-secondary-500'
                      } ${registerMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
                    disabled={registerMutation.isPending}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 sm:py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none text-sm sm:text-base"
              >
                {registerMutation.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loading variant="spinner" size="sm" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 sm:mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary-200 dark:border-secondary-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-secondary-800 text-secondary-500 dark:text-secondary-400">
                    Already have an account?
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors text-sm sm:text-base group"
                >
                  <span>Sign in here</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Additional Features */}
        <div className="text-center text-xs sm:text-sm text-secondary-500 dark:text-secondary-400">
          <p>
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register