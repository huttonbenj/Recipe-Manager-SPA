/**
 * Local storage hook with TypeScript support
 */

import { useState, useEffect } from 'react'

/**
 * Hook for managing localStorage state
 * Automatically syncs with localStorage and handles JSON serialization
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
      
      // Handle null values
      if (item === 'null') return null as T
      
      // For string defaults, try to return as string first
      if (typeof defaultValue === 'string') {
        // If it's JSON-wrapped string, unwrap it
        if (item.startsWith('"') && item.endsWith('"')) {
          try {
            return JSON.parse(item) as T
          } catch {
            return item as T
          }
        }
        return item as T
      }

      // For non-string defaults, try to parse as JSON
      try {
        return JSON.parse(item)
      } catch {
        // If JSON parsing fails, return as-is if it's a string, otherwise default
        return typeof item === 'string' ? item as unknown as T : defaultValue
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
      
      // Handle null/undefined values
      if (valueToStore === null || valueToStore === undefined) {
        window.localStorage.setItem(key, 'null')
        return
      }
      
      // For strings, store directly (tokens, etc.)
      if (typeof valueToStore === 'string') {
        window.localStorage.setItem(key, valueToStore)
      } else {
        // For objects, stringify as JSON
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
          // Handle null values
          if (e.newValue === 'null') {
            setValue(null as T)
            return
          }

          // For string defaults, use the new value as-is
          if (typeof defaultValue === 'string') {
            setValue(e.newValue as T)
            return
          }

          // For non-string defaults, try to parse as JSON
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