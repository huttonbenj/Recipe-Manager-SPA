import { describe, it, expect } from 'vitest';
import { 
  formatDate, 
  formatDateShort, 
  formatDateRelative, 
  formatDuration, 
  isToday, 
  isThisWeek 
} from '../../utils/format/date';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format date without time', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = formatDate(date, false);
      expect(result).toBe('January 15, 2024');
    });

    it('should format date with time', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = formatDate(date, true);
      expect(result).toBe('January 15, 2024 at 10:30 AM');
    });

    it('should format date with different formats', () => {
      const date = new Date('2024-01-15T10:30:00');
      expect(formatDateShort(date)).toBe('01/15/2024');
      expect(formatDate(date, false)).toBe('January 15, 2024');
    });

    it('should handle invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('Invalid Date');
    });
  });

  describe('formatDateShort', () => {
    it('should format date as MM/DD/YYYY', () => {
      const date = new Date('2024-01-15T10:30:00');
      expect(formatDateShort(date)).toBe('01/15/2024');
    });

    it('should handle string dates', () => {
      expect(formatDateShort('2024-01-15')).toBe('01/15/2024');
    });

    it('should handle invalid dates', () => {
      expect(formatDateShort('invalid')).toBe('Invalid Date');
    });
  });

  describe('formatDateRelative', () => {
    it('should format recent dates', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const result = formatDateRelative(fiveMinutesAgo);
      expect(result).toBe('5 minutes ago');
    });

    it('should handle "just now" for very recent dates', () => {
      const now = new Date();
      const result = formatDateRelative(now);
      expect(result).toBe('just now');
    });

    it('should handle singular forms correctly', () => {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
      const result = formatDateRelative(oneMinuteAgo);
      expect(result).toBe('1 minute ago');
    });

    it('should handle hours correctly', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      const result = formatDateRelative(twoHoursAgo);
      expect(result).toBe('2 hours ago');
    });

    it('should handle days correctly', () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const result = formatDateRelative(threeDaysAgo);
      expect(result).toBe('3 days ago');
    });

    it('should handle invalid dates', () => {
      expect(formatDateRelative('invalid')).toBe('Invalid Date');
    });
  });

  describe('formatDuration', () => {
    it('should format duration in minutes', () => {
      expect(formatDuration(30)).toBe('30 min');
      expect(formatDuration(45)).toBe('45 min');
    });

    it('should format duration in hours', () => {
      expect(formatDuration(60)).toBe('1 hr');
      expect(formatDuration(120)).toBe('2 hr');
    });

    it('should format duration in hours and minutes', () => {
      expect(formatDuration(90)).toBe('1 hr 30 min');
      expect(formatDuration(150)).toBe('2 hr 30 min');
    });

    it('should handle zero duration', () => {
      expect(formatDuration(0)).toBe('0 min');
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });

    it('should handle string dates', () => {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0]!;
      expect(isToday(todayString)).toBe(true);
    });
  });

  describe('isThisWeek', () => {
    it('should return true for dates in current week', () => {
      const today = new Date();
      expect(isThisWeek(today)).toBe(true);
    });

    it('should return false for dates outside current week', () => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 8);
      expect(isThisWeek(nextWeek)).toBe(false);
    });

    it('should handle string dates', () => {
      const today = new Date();
      const todayString = today.toISOString();
      expect(isThisWeek(todayString)).toBe(true);
    });
  });
}); 