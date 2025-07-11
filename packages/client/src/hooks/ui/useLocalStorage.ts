import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing localStorage with React state
 * Automatically syncs state with localStorage and handles JSON serialization
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: T | ((val: T) => T)) => void] => {
  // Store the initial value in a ref to avoid recreating it on every render
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;
  
  // Cache the computed initial value to avoid calling function multiple times
  const computedInitialValue = useRef<T | null>(null);
  
  // Track if this is the initial mount
  const isInitialMount = useRef(true);
  
  const getInitialValue = useCallback(() => {
    if (computedInitialValue.current === null) {
      const initial = initialValueRef.current;
      computedInitialValue.current = typeof initial === 'function' ? (initial as () => T)() : initial;
    }
    return computedInitialValue.current;
  }, []);

  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      // Handle initial value function
      return getInitialValue();
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return getInitialValue();
    }
  });

  // Update state when key changes
  useEffect(() => {
    // Skip the initial mount since useState already handled it
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsedValue = JSON.parse(item);
        setStoredValue(parsedValue);
      } else {
        // When key changes to non-existent key, reset to default value
        // Only reset if we're changing keys (not on initial mount)
        // Reset the cached initial value for the new key
        computedInitialValue.current = null;
        setStoredValue(getInitialValue());
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      // Reset the cached initial value on error
      computedInitialValue.current = null;
      setStoredValue(getInitialValue());
    }
  }, [key, getInitialValue]);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}; 