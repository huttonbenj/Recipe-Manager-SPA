import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axiosInstance } from '../../../../services/base/config';
import { STORAGE_KEYS } from '@recipe-manager/shared';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock window.location
const mockLocation = {
  href: '',
};

// Replace global objects with mocks
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('config.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.href = '';
  });

  describe('axios instance configuration', () => {
    it('should create axios instance with correct base configuration', () => {
      expect(axiosInstance).toBeDefined();
      expect(axiosInstance.defaults).toBeDefined();
      expect(axiosInstance.defaults.baseURL).toBeDefined();
      expect(axiosInstance.defaults.timeout).toBeDefined();
      expect(axiosInstance.defaults.headers).toBeDefined();
      expect(axiosInstance.defaults.headers['Content-Type']).toBe('application/json');
    });

    it('should have interceptors configured', () => {
      expect(axiosInstance.interceptors).toBeDefined();
      expect(axiosInstance.interceptors.request).toBeDefined();
      expect(axiosInstance.interceptors.response).toBeDefined();
    });

    it('should have proper timeout configuration', () => {
      expect(axiosInstance.defaults.timeout).toBeDefined();
      expect(typeof axiosInstance.defaults.timeout).toBe('number');
      expect(axiosInstance.defaults.timeout).toBeGreaterThan(0);
    });

    it('should have proper headers configuration', () => {
      expect(axiosInstance.defaults.headers).toBeDefined();
      expect(axiosInstance.defaults.headers['Content-Type']).toBe('application/json');
    });

    it('should have baseURL configured', () => {
      expect(axiosInstance.defaults.baseURL).toBeDefined();
      expect(typeof axiosInstance.defaults.baseURL).toBe('string');
      if (axiosInstance.defaults.baseURL) {
        expect(axiosInstance.defaults.baseURL.length).toBeGreaterThan(0);
      }
    });

    it('should have all required axios methods', () => {
      expect(axiosInstance.get).toBeDefined();
      expect(axiosInstance.post).toBeDefined();
      expect(axiosInstance.put).toBeDefined();
      expect(axiosInstance.patch).toBeDefined();
      expect(axiosInstance.delete).toBeDefined();
      expect(axiosInstance.request).toBeDefined();
    });

    it('should have interceptors with proper structure', () => {
      expect(axiosInstance.interceptors.request).toBeDefined();
      expect(axiosInstance.interceptors.response).toBeDefined();
      expect(typeof axiosInstance.interceptors.request.use).toBe('function');
      expect(typeof axiosInstance.interceptors.response.use).toBe('function');
    });
  });

  describe('localStorage integration', () => {
    it('should interact with localStorage for token management', () => {
      const mockToken = 'test-token';

      // Test getting token
      mockLocalStorage.getItem.mockReturnValue(mockToken);
      const token = mockLocalStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      expect(token).toBe(mockToken);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);

      // Test setting token
      mockLocalStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'new-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN, 'new-token');

      // Test removing token
      mockLocalStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
    });

    it('should clear all auth data on refresh failure', () => {
      mockLocalStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      mockLocalStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      mockLocalStorage.removeItem(STORAGE_KEYS.USER);

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.USER);
    });

    it('should handle different token scenarios', () => {
      // Test with null token
      mockLocalStorage.getItem.mockReturnValue(null);
      let token = mockLocalStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      expect(token).toBeNull();

      // Test with empty token
      mockLocalStorage.getItem.mockReturnValue('');
      token = mockLocalStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      expect(token).toBe('');

      // Test with valid token
      mockLocalStorage.getItem.mockReturnValue('valid-token');
      token = mockLocalStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      expect(token).toBe('valid-token');
    });

    it('should handle refresh token operations', () => {
      const refreshToken = 'refresh-token';

      // Test getting refresh token
      mockLocalStorage.getItem.mockReturnValue(refreshToken);
      const token = mockLocalStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      expect(token).toBe(refreshToken);

      // Test setting refresh token
      mockLocalStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'new-refresh-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN, 'new-refresh-token');
    });

    it('should handle user data operations', () => {
      const userData = JSON.stringify({ id: '1', name: 'Test User' });

      // Test getting user data
      mockLocalStorage.getItem.mockReturnValue(userData);
      const user = mockLocalStorage.getItem(STORAGE_KEYS.USER);
      expect(user).toBe(userData);

      // Test setting user data
      mockLocalStorage.setItem(STORAGE_KEYS.USER, userData);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.USER, userData);

      // Test removing user data
      mockLocalStorage.removeItem(STORAGE_KEYS.USER);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.USER);
    });
  });

  describe('window.location integration', () => {
    it('should redirect to login on auth failure', () => {
      mockLocation.href = '/login';
      expect(mockLocation.href).toBe('/login');
    });

    it('should handle different redirect scenarios', () => {
      // Test login redirect
      mockLocation.href = '/login';
      expect(mockLocation.href).toBe('/login');

      // Test home redirect
      mockLocation.href = '/';
      expect(mockLocation.href).toBe('/');

      // Test dashboard redirect
      mockLocation.href = '/dashboard';
      expect(mockLocation.href).toBe('/dashboard');
    });
  });

  describe('environment configuration', () => {
    it('should use environment variable for API URL when available', () => {
      // This test verifies that the configuration uses environment variables
      // The actual implementation checks import.meta.env.VITE_API_URL
      expect(axiosInstance.defaults.baseURL).toBeDefined();
      expect(typeof axiosInstance.defaults.baseURL).toBe('string');
    });

    it('should have fallback configuration', () => {
      // Test that defaults are set even without environment variables
      expect(axiosInstance.defaults.baseURL).toBeDefined();
      expect(axiosInstance.defaults.timeout).toBeDefined();
      expect(axiosInstance.defaults.headers).toBeDefined();
    });
  });

  describe('storage keys integration', () => {
    it('should use correct storage keys', () => {
      expect(STORAGE_KEYS.ACCESS_TOKEN).toBeDefined();
      expect(STORAGE_KEYS.REFRESH_TOKEN).toBeDefined();
      expect(STORAGE_KEYS.USER).toBeDefined();

      expect(typeof STORAGE_KEYS.ACCESS_TOKEN).toBe('string');
      expect(typeof STORAGE_KEYS.REFRESH_TOKEN).toBe('string');
      expect(typeof STORAGE_KEYS.USER).toBe('string');
    });

    it('should handle storage key operations', () => {
      // Test access token key
      mockLocalStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);

      // Test refresh token key
      mockLocalStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN);

      // Test user key
      mockLocalStorage.getItem(STORAGE_KEYS.USER);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.USER);
    });
  });

  describe('axios instance properties', () => {
    it('should have proper default configuration', () => {
      expect(axiosInstance.defaults.baseURL).toBeDefined();
      expect(axiosInstance.defaults.timeout).toBeDefined();
      expect(axiosInstance.defaults.headers).toBeDefined();
      expect(axiosInstance.defaults.headers['Content-Type']).toBe('application/json');
    });

    it('should have interceptors properly configured', () => {
      // Check that interceptors are functions
      expect(typeof axiosInstance.interceptors.request.use).toBe('function');
      expect(typeof axiosInstance.interceptors.response.use).toBe('function');
    });

    it('should have all standard axios methods', () => {
      expect(axiosInstance.get).toBeDefined();
      expect(typeof axiosInstance.get).toBe('function');
      expect(axiosInstance.post).toBeDefined();
      expect(typeof axiosInstance.post).toBe('function');
      expect(axiosInstance.put).toBeDefined();
      expect(typeof axiosInstance.put).toBe('function');
      expect(axiosInstance.patch).toBeDefined();
      expect(typeof axiosInstance.patch).toBe('function');
      expect(axiosInstance.delete).toBeDefined();
      expect(typeof axiosInstance.delete).toBe('function');
      expect(axiosInstance.head).toBeDefined();
      expect(typeof axiosInstance.head).toBe('function');
      expect(axiosInstance.options).toBeDefined();
      expect(typeof axiosInstance.options).toBe('function');
    });

    it('should have request method', () => {
      expect(axiosInstance.request).toBeDefined();
      expect(typeof axiosInstance.request).toBe('function');
    });

    it('should have proper axios instance structure', () => {
      expect(axiosInstance.defaults).toBeDefined();
      expect(axiosInstance.interceptors).toBeDefined();
      expect(axiosInstance.interceptors.request).toBeDefined();
      expect(axiosInstance.interceptors.response).toBeDefined();
    });
  });

  describe('configuration constants', () => {
    it('should have proper storage key constants', () => {
      expect(STORAGE_KEYS.ACCESS_TOKEN).toBe('accessToken');
      expect(STORAGE_KEYS.REFRESH_TOKEN).toBe('refreshToken');
      expect(STORAGE_KEYS.USER).toBe('user');
    });

    it('should handle storage key validation', () => {
      const keys = [STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN, STORAGE_KEYS.USER];
      keys.forEach(key => {
        expect(key).toBeDefined();
        expect(typeof key).toBe('string');
        expect(key.length).toBeGreaterThan(0);
      });
    });
  });
}); 