/**
 * Helper functions tests
 */

import { describe, it, expect } from 'vitest'
import {
  formatCookTime,
  formatRelativeTime,
  truncateText,
  generateSlug,
  formatFileSize,
  isValidUrl,
  capitalize
} from './helpers'

describe('Helper Functions', () => {
  describe('formatCookTime', () => {
    it('returns "Not specified" for undefined', () => {
      expect(formatCookTime()).toBe('Not specified')
    })

    it('formats minutes correctly', () => {
      expect(formatCookTime(30)).toBe('30 min')
      expect(formatCookTime(45)).toBe('45 min')
    })

    it('formats hours correctly', () => {
      expect(formatCookTime(60)).toBe('1h')
      expect(formatCookTime(120)).toBe('2h')
    })

    it('formats hours and minutes correctly', () => {
      expect(formatCookTime(90)).toBe('1h 30m')
      expect(formatCookTime(135)).toBe('2h 15m')
    })
  })

  describe('truncateText', () => {
    it('returns original text if shorter than max length', () => {
      expect(truncateText('short', 10)).toBe('short')
    })

    it('truncates text and adds ellipsis', () => {
      expect(truncateText('this is a very long text', 10)).toBe('this is a...')
    })

    it('handles exact length', () => {
      expect(truncateText('exactly10!', 10)).toBe('exactly10!')
    })
  })

  describe('generateSlug', () => {
    it('generates slug from title', () => {
      expect(generateSlug('My Recipe Title')).toBe('my-recipe-title')
    })

    it('removes special characters', () => {
      expect(generateSlug('Recipe with @#$% symbols!')).toBe('recipe-with-symbols')
    })

    it('handles multiple spaces and dashes', () => {
      expect(generateSlug('  Recipe   with    spaces  ')).toBe('recipe-with-spaces')
    })
  })

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(512)).toBe('512 Bytes')
    })

    it('formats KB correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
    })

    it('formats MB correctly', () => {
      expect(formatFileSize(1048576)).toBe('1 MB')
      expect(formatFileSize(1572864)).toBe('1.5 MB')
    })
  })

  describe('isValidUrl', () => {
    it('returns true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:3000')).toBe(true)
      expect(isValidUrl('ftp://files.example.com')).toBe(true)
    })

    it('returns false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('example.com')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })
  })

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('WORLD')).toBe('World')
    })

    it('handles empty string', () => {
      expect(capitalize('')).toBe('')
    })

    it('handles single character', () => {
      expect(capitalize('a')).toBe('A')
    })
  })

  describe('formatRelativeTime', () => {
    it('returns "Just now" for very recent dates', () => {
      const now = new Date()
      expect(formatRelativeTime(now.toISOString())).toBe('Just now')
    })

    it('formats minutes ago correctly', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      expect(formatRelativeTime(fiveMinutesAgo.toISOString())).toBe('5m ago')
    })

    it('formats hours ago correctly', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
      expect(formatRelativeTime(twoHoursAgo.toISOString())).toBe('2h ago')
    })
  })
})