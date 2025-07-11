import { z } from 'zod';
import { ValidationResult } from './errors';

// Email validation
export function validateEmail(email: string): boolean {
  const emailSchema = z.string().email();
  try {
    emailSchema.parse(email.trim());
    return true;
  } catch {
    return false;
  }
}

// Password validation
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  let isValid = true;

  // Check minimum length
  if (password.length < 8) {
    errors.push('minLength');
    isValid = false;
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('uppercase');
    isValid = false;
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('lowercase');
    isValid = false;
  }

  // Check for number
  if (!/\d/.test(password)) {
    errors.push('number');
    isValid = false;
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('specialChar');
    isValid = false;
  }

  return {
    isValid,
    errors,
    message: isValid ? '' : 'Password does not meet requirements'
  };
}

// User validation
export function validateUser(user: unknown): ValidationResult {
  const errors: string[] = [];
  let isValid = true;

  if (!user || typeof user !== 'object') {
    return {
      isValid: false,
      errors: ['Invalid user data'],
      message: 'User data must be an object'
    };
  }

  const userData = user as Record<string, unknown>;

  // Check required fields
  if (!userData.email || typeof userData.email !== 'string') {
    errors.push('email');
    isValid = false;
  } else if (!validateEmail(userData.email)) {
    errors.push('email');
    isValid = false;
  }

  if (!userData.name || typeof userData.name !== 'string' || userData.name.trim().length === 0) {
    errors.push('name');
    isValid = false;
  }

  // Check password if present (for registration validation)
  if (userData.password !== undefined) {
    if (!userData.password || typeof userData.password !== 'string') {
      errors.push('password');
      isValid = false;
    } else {
      const passwordResult = validatePassword(userData.password);
      if (!passwordResult.isValid) {
        errors.push('password');
        isValid = false;
      }
    }
  }

  return {
    isValid,
    errors,
    message: isValid ? '' : 'User validation failed'
  };
}

// User credentials validation
export function validateUserCredentials(credentials: unknown): ValidationResult {
  const errors: string[] = [];
  let isValid = true;

  if (!credentials || typeof credentials !== 'object') {
    return {
      isValid: false,
      errors: ['Invalid credentials'],
      message: 'Credentials must be an object'
    };
  }

  const creds = credentials as Record<string, unknown>;

  if (!creds.email || typeof creds.email !== 'string') {
    errors.push('email');
    isValid = false;
  } else if (!validateEmail(creds.email)) {
    errors.push('email');
    isValid = false;
  }

  if (!creds.password || typeof creds.password !== 'string') {
    errors.push('password');
    isValid = false;
  }

  return {
    isValid,
    errors,
    message: isValid ? '' : 'Credentials validation failed'
  };
}

// User registration validation
export function validateUserRegistration(registration: unknown): ValidationResult {
  // Use the same validation as user but ensure password is present
  const result = validateUser(registration);
  
  if (!result.isValid) {
    return result;
  }

  const userData = registration as Record<string, unknown>;
  
  // Ensure password is present for registration
  if (!userData.password) {
    return {
      isValid: false,
      errors: ['password'],
      message: 'Password is required for registration'
    };
  }

  return result;
} 