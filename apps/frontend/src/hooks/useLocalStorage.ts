/**
 * Local storage hook with TypeScript support
 */

import { useState, useEffect } from 'react'

/**
 * Hook for managing localStorage state
 * Automatically syncs with localStorage and handles JSON serialization
 * Intelligently handles both strings and objects
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state with value from localStorage or default
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return defaultValue
      
      // If the default value is a string, return the item as-is (commonly used for plain tokens)
      if (typeof defaultValue === 'string') {
        return item as T
      }

      // Attempt to parse JSON, but gracefully fall back to the raw string if parsing fails.
      try {
        return JSON.parse(item)
      } catch {
        return item as unknown as T
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  })

  // Update localStorage when state changes
  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    try {
      // Allow functional updates
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue
      
      setValue(valueToStore)
      
      // If the value is a string, store it as-is (for tokens, etc.)
      if (typeof valueToStore === 'string') {
        window.localStorage.setItem(key, valueToStore)
      } else {
        // Otherwise, stringify as JSON (for objects)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  // Listen for changes to this localStorage key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          // If the default value is a string, use the new value as-is
          if (typeof defaultValue === 'string') {
            setValue(e.newValue as T)
            return
          }

          // Attempt to parse JSON, but fall back to raw string on failure
          try {
            setValue(JSON.parse(e.newValue))
          } catch {
            setValue(e.newValue as unknown as T)
          }
        } catch (error) {
          console.warn(`Error parsing localStorage change for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, defaultValue])

  return [value, setStoredValue]
}