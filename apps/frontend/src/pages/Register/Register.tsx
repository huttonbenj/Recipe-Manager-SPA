/**
 * Register page component
 * Enhanced with modern design, animations, and mobile optimization
 */

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Mail, Lock, User, ChefHat, AlertCircle, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'

// UI Components
import { Button, Card, CardHeader, CardBody } from '@/components/ui'

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
            Join Our Community
          </h1>
          <p className="text-sm sm:text-base text-secondary-600 dark:text-secondary-400 max-w-sm mx-auto">
            Create your account and start sharing amazing recipes with food enthusiasts worldwide
          </p>
        </div>

        {/* Enhanced Register Form */}
        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-secondary-800/90 backdrop-blur-xl transform hover:scale-[1.01] transition-all duration-300">
          <CardHeader className="pb-4 sm:pb-6">
            <h2 className="text-lg sm:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-secondary-900 to-primary-700 dark:from-white dark:to-primary-400 text-center">
              Create Your Account
            </h2>
          </CardHeader>
          <CardBody className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Submit Error Display - Enhanced Animation */}
              {errors.submit && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 flex items-start gap-3 animate-[shake_0.5s_ease-in-out]">
                  <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200 text-sm">Registration Failed</h4>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-1">{errors.submit}</p>
                  </div>
                </div>
              )}

              {/* Name Field - Enhanced Focus States */}
              <div className="space-y-2 group">
                <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 dark:text-secondary-500 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    disabled={registerMutation.isPending}
                    className={`w-full pl-10 pr-4 py-3 sm:py-3.5 border rounded-xl bg-white/80 dark:bg-secondary-700/80 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-sm sm:text-base ${errors.name
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500/50 focus:border-red-500'
                      : 'border-secondary-300 dark:border-secondary-600 hover:border-secondary-400 dark:hover:border-secondary-500'
                      } ${registerMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-[slideIn_0.2s_ease-in-out]">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

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
                    disabled={registerMutation.isPending}
                    className={`w-full pl-10 pr-4 py-3 sm:py-3.5 border rounded-xl bg-white/80 dark:bg-secondary-700/80 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-sm sm:text-base ${errors.email
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500/50 focus:border-red-500'
                      : 'border-secondary-300 dark:border-secondary-600 hover:border-secondary-400 dark:hover:border-secondary-500'
                      } ${registerMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    disabled={registerMutation.isPending}
                    className={`w-full pl-10 pr-12 py-3 sm:py-3.5 border rounded-xl bg-white/80 dark:bg-secondary-700/80 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-sm sm:text-base ${errors.password
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500/50 focus:border-red-500'
                      : 'border-secondary-300 dark:border-secondary-600 hover:border-secondary-400 dark:hover:border-secondary-500'
                      } ${registerMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-600/50"
                    disabled={registerMutation.isPending}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Enhanced Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 w-full rounded-full transition-all duration-300 transform origin-left ${passwordStrength >= level
                            ? passwordStrength <= 2
                              ? 'bg-red-500 scale-x-100'
                              : passwordStrength <= 3
                                ? 'bg-yellow-500 scale-x-100'
                                : 'bg-green-500 scale-x-100'
                            : 'bg-secondary-200 dark:bg-secondary-600 scale-x-75'
                            }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <p className="text-secondary-600 dark:text-secondary-400">
                        Password strength:{' '}
                        <span className={
                          passwordStrength <= 2 ? 'text-red-600 dark:text-red-400 font-medium' :
                            passwordStrength <= 3 ? 'text-yellow-600 dark:text-yellow-400 font-medium' :
                              'text-green-600 dark:text-green-400 font-medium'
                        }>
                          {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Medium' : 'Strong'}
                        </span>
                      </p>
                      <span className="text-secondary-500 dark:text-secondary-400">
                        {passwordStrength * 20}%
                      </span>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-[slideIn_0.2s_ease-in-out]">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}

                <ul className="text-xs space-y-1 text-secondary-500 dark:text-secondary-400">
                  <li className={`flex items-center gap-1.5 ${formData.password.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}`}>
                    <CheckCircle className={`w-3.5 h-3.5 ${formData.password.length >= 8 ? 'text-green-500' : 'text-secondary-400'}`} />
                    At least 8 characters
                  </li>
                  <li className={`flex items-center gap-1.5 ${/[A-Z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                    <CheckCircle className={`w-3.5 h-3.5 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-secondary-400'}`} />
                    One uppercase letter
                  </li>
                  <li className={`flex items-center gap-1.5 ${/[a-z]/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                    <CheckCircle className={`w-3.5 h-3.5 ${/[a-z]/.test(formData.password) ? 'text-green-500' : 'text-secondary-400'}`} />
                    One lowercase letter
                  </li>
                  <li className={`flex items-center gap-1.5 ${/\d/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                    <CheckCircle className={`w-3.5 h-3.5 ${/\d/.test(formData.password) ? 'text-green-500' : 'text-secondary-400'}`} />
                    One number
                  </li>
                </ul>
              </div>

              {/* Confirm Password Field - Enhanced Focus States */}
              <div className="space-y-2 group">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 dark:text-secondary-500 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    disabled={registerMutation.isPending}
                    className={`w-full pl-10 pr-12 py-3 sm:py-3.5 border rounded-xl bg-white/80 dark:bg-secondary-700/80 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 text-sm sm:text-base ${errors.confirmPassword
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-500/50 focus:border-red-500'
                      : formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-300 dark:border-green-700 focus:ring-green-500/50'
                        : 'border-secondary-300 dark:border-secondary-600 hover:border-secondary-400 dark:hover:border-secondary-500'
                      } ${registerMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-600/50"
                    disabled={registerMutation.isPending}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="w-5 h-5 text-green-500 animate-[fadeIn_0.2s_ease-in-out]" />
                    </div>
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-[slideIn_0.2s_ease-in-out]">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button - Enhanced Loading State */}
              <div>
                <Button
                  type="submit"
                  isFullWidth
                  isLoading={registerMutation.isPending}
                  disabled={registerMutation.isPending || passwordStrength < 3}
                  size="lg"
                  className="group"
                  rightIcon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                >
                  Create Account
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Enhanced Sign In Link */}
        <p className="text-center text-sm text-secondary-600 dark:text-secondary-400">
          Already have an account?{' '}
          <Link to="/login">
            <Button variant="link" className="font-semibold">
              Sign in
            </Button>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register