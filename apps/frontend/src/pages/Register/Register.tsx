/**
 * Register page component
 * Provides user registration with form validation and API integration
 */

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Mail, Lock, User, Loader2 } from 'lucide-react'

// UI Components
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

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
  const { register } = useAuth()

  // Form state
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })

  // UI state
  const [errors, setErrors] = useState<FormErrors>({})

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate('/')
    },
    onError: (error: any) => {
      setErrors({
        submit: error?.response?.data?.message || 'Registration failed. Please try again.'
      })
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

    // Clear previous errors
    setErrors({})

    // Validate form
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    // Submit registration request
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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Join our community of food enthusiasts
          </p>
        </div>

        {/* Register Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Submit Error Display */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Name Field */}
            <Input
              id="name"
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              leftIcon={<User className="h-5 w-5" />}
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={registerMutation.isPending}
              error={errors.name}
              required
            />

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
              disabled={registerMutation.isPending}
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
              autoComplete="new-password"
              disabled={registerMutation.isPending}
              error={errors.password}
              showPasswordToggle
              helperText="Must be at least 8 characters with uppercase, lowercase, and number"
              required
            />

            {/* Confirm Password Field */}
            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              leftIcon={<Lock className="h-5 w-5" />}
              placeholder="Confirm your password"
              autoComplete="new-password"
              disabled={registerMutation.isPending}
              error={errors.confirmPassword}
              showPasswordToggle
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Register