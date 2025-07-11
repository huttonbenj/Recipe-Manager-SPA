import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseService } from '../../../../services/base/helpers';
import { STORAGE_KEYS } from '@recipe-manager/shared';
import type { User } from '@recipe-manager/shared';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Replace global localStorage with our mock
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('BaseService', () => {
  let baseService: BaseService;

  beforeEach(() => {
    baseService = new BaseService();
    vi.clearAllMocks();
  });

  describe('isAuthenticated', () => {
    it('should return true when access token exists', () => {
      mockLocalStorage.getItem.mockReturnValue('valid-token');
      
      const result = baseService.isAuthenticated();
      
      expect(result).toBe(true);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
    });

    it('should return false when access token does not exist', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const result = baseService.isAuthenticated();
      
      expect(result).toBe(false);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
    });

    it('should return false when access token is empty string', () => {
      mockLocalStorage.getItem.mockReturnValue('');
      
      const result = baseService.isAuthenticated();
      
      expect(result).toBe(false);
    });
  });

  describe('getStoredUser', () => {
    it('should return parsed user data when user exists in localStorage', () => {
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        created_at: new Date('2023-01-01T00:00:00.000Z'),
        updated_at: new Date('2023-01-01T00:00:00.000Z'),
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));
      
      const result = baseService.getStoredUser();
      
      expect(result).toEqual({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      });
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.USER);
    });

    it('should return null when user does not exist in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const result = baseService.getStoredUser();
      
      expect(result).toBeNull();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.USER);
    });

    it('should return null when user data is invalid JSON', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');
      
      expect(() => baseService.getStoredUser()).toThrow();
    });
  });

  describe('clearAuth', () => {
    it('should remove all authentication data from localStorage', () => {
      baseService.clearAuth();
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.USER);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(3);
    });
  });

  describe('storeUser', () => {
    it('should store user data in localStorage as JSON string', () => {
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        created_at: new Date('2023-01-01T00:00:00.000Z'),
        updated_at: new Date('2023-01-01T00:00:00.000Z'),
      };
      
      baseService.storeUser(mockUser);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER,
        JSON.stringify(mockUser)
      );
    });
  });

  describe('storeTokens', () => {
    it('should store access and refresh tokens in localStorage', () => {
      const accessToken = 'access-token-123';
      const refreshToken = 'refresh-token-456';
      
      baseService.storeTokens(accessToken, refreshToken);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.ACCESS_TOKEN,
        accessToken
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.REFRESH_TOKEN,
        refreshToken
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);
    });
  });
}); 