import { useState, useCallback } from 'react';

export type ValidationRule<T> = (value: T) => string | undefined;
export type ValidationRules<T> = Partial<Record<keyof T, ValidationRule<T[keyof T]>[]>>;
export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export interface UseFormValidationReturn<T> {
  errors: ValidationErrors<T>;
  validateField: (field: keyof T, value: T[keyof T]) => boolean;
  validateForm: (data: T) => boolean;
  clearErrors: () => void;
  clearFieldError: (field: keyof T) => void;
  hasErrors: boolean;
}

/**
 * Custom hook for form validation
 * Provides field-level and form-level validation with error management
 */
export const useFormValidation = <T extends Record<string, any>>(
  rules: ValidationRules<T>
): UseFormValidationReturn<T> => {
  const [errors, setErrors] = useState<ValidationErrors<T>>({});

  const validateField = useCallback((field: keyof T, value: T[keyof T]): boolean => {
    const fieldRules = rules[field];
    if (!fieldRules) return true;

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
        return false;
      }
    }

    // Clear error if validation passes
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    return true;
  }, [rules]);

  const validateForm = useCallback((data: T): boolean => {
    const newErrors: ValidationErrors<T> = {};
    let isValid = true;

    for (const field in rules) {
      const fieldRules = rules[field];
      if (fieldRules) {
        const value = data[field];
        for (const rule of fieldRules) {
          const error = rule(value);
          if (error) {
            newErrors[field] = error;
            isValid = false;
            break; // Stop at first error for this field
          }
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [rules]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    hasErrors,
  };
};

// Common validation rules
export const CommonValidationRules = {
  required: <T>(message: string = 'This field is required'): ValidationRule<T> => 
    (value: T) => {
      if (value === null || value === undefined || value === '') {
        return message;
      }
      return undefined;
    },

  minLength: (min: number, message?: string): ValidationRule<string> =>
    (value: string) => {
      if (value && value.length < min) {
        return message || `Must be at least ${min} characters`;
      }
      return undefined;
    },

  maxLength: (max: number, message?: string): ValidationRule<string> =>
    (value: string) => {
      if (value && value.length > max) {
        return message || `Must be no more than ${max} characters`;
      }
      return undefined;
    },

  email: (message: string = 'Please enter a valid email'): ValidationRule<string> =>
    (value: string) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return message;
      }
      return undefined;
    },

  min: (min: number, message?: string): ValidationRule<number> =>
    (value: number) => {
      if (value !== undefined && value < min) {
        return message || `Must be at least ${min}`;
      }
      return undefined;
    },

  max: (max: number, message?: string): ValidationRule<number> =>
    (value: number) => {
      if (value !== undefined && value > max) {
        return message || `Must be no more than ${max}`;
      }
      return undefined;
    },
}; 