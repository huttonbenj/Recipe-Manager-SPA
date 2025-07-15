/**
 * Tests for validation utilities
 * Critical form validation tests
 */

import { describe, it, expect } from 'vitest'
import {
  emailSchema,
  passwordSchema,
  nameSchema,
  loginSchema,
  registerSchema,
  recipeSchema,
} from './validation'

describe('Validation Utilities', () => {
  describe('emailSchema', () => {
    it('validates correct email addresses', () => {
      expect(emailSchema.safeParse('test@example.com').success).toBe(true)
      expect(emailSchema.safeParse('user.name@domain.co.uk').success).toBe(true)
      expect(emailSchema.safeParse('user+tag@example.org').success).toBe(true)
    })

    it('rejects invalid email addresses', () => {
      expect(emailSchema.safeParse('').success).toBe(false)
      expect(emailSchema.safeParse('invalid-email').success).toBe(false)
      expect(emailSchema.safeParse('missing@domain').success).toBe(false)
      expect(emailSchema.safeParse('@domain.com').success).toBe(false)
    })

    it('provides correct error messages', () => {
      const result = emailSchema.safeParse('')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address')
      }
    })
  })

  describe('passwordSchema', () => {
    it('validates strong passwords', () => {
      expect(passwordSchema.safeParse('Password123').success).toBe(true)
      expect(passwordSchema.safeParse('MySecure1Pass').success).toBe(true)
    })

    it('rejects weak passwords', () => {
      expect(passwordSchema.safeParse('weak').success).toBe(false)
      expect(passwordSchema.safeParse('password').success).toBe(false)
      expect(passwordSchema.safeParse('PASSWORD').success).toBe(false)
      expect(passwordSchema.safeParse('12345678').success).toBe(false)
    })

    it('provides correct error messages', () => {
      const result = passwordSchema.safeParse('weak')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 8 characters')
      }
    })
  })

  describe('nameSchema', () => {
    it('validates correct names', () => {
      expect(nameSchema.safeParse('John Doe').success).toBe(true)
      expect(nameSchema.safeParse('Alice').success).toBe(true)
    })

    it('rejects invalid names', () => {
      expect(nameSchema.safeParse('').success).toBe(false)
      expect(nameSchema.safeParse('A'.repeat(51)).success).toBe(false)
    })

    it('provides correct error messages', () => {
      const result = nameSchema.safeParse('')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name is required')
      }
    })
  })

  describe('loginSchema', () => {
    it('validates complete login data', () => {
      expect(loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123'
      }).success).toBe(true)
    })

    it('rejects incomplete login data', () => {
      expect(loginSchema.safeParse({
        email: 'test@example.com'
      }).success).toBe(false)
      expect(loginSchema.safeParse({
        password: 'password123'
      }).success).toBe(false)
    })
  })

  describe('registerSchema', () => {
    it('validates complete registration data', () => {
      expect(registerSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123',
        name: 'John Doe'
      }).success).toBe(true)
    })

    it('validates registration without name', () => {
      expect(registerSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123'
      }).success).toBe(true)
    })

    it('rejects invalid registration data', () => {
      expect(registerSchema.safeParse({
        email: 'invalid-email',
        password: 'weak'
      }).success).toBe(false)
    })
  })

  describe('recipeSchema', () => {
    it('validates complete recipe data', () => {
      expect(recipeSchema.safeParse({
        title: 'Test Recipe',
        description: 'A test recipe',
        ingredients: ['ingredient 1', 'ingredient 2'],
        instructions: 'Mix ingredients and cook for 30 minutes'
      }).success).toBe(true)
    })

    it('rejects invalid recipe data', () => {
      expect(recipeSchema.safeParse({
        title: '',
        description: 'A test recipe',
        ingredients: [],
        instructions: 'Too short'
      }).success).toBe(false)
    })
  })
}) 