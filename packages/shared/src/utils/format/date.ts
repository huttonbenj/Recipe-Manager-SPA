/**
 * Date formatting utilities
 */

/**
 * Format a date to a human-readable string
 * @param date - Date to format
 * @param includeTime - Whether to include time in the format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, includeTime: boolean = false): string => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return new Intl.DateTimeFormat('en-US', options).format(d);
};

/**
 * Format a date to a short string (MM/DD/YYYY)
 * @param date - Date to format
 * @returns Short date string
 */
export const formatDateShort = (date: Date | string): string => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  // For string dates without time, treat as local date to avoid timezone issues
  if (typeof date === 'string' && !date.includes('T') && !date.includes(' ')) {
    const parts = date.split('-');
    if (parts.length === 3) {
      const localDate = new Date(parseInt(parts[0]!), parseInt(parts[1]!) - 1, parseInt(parts[2]!));
      return new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }).format(localDate);
    }
  }

  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(d);
};

/**
 * Format a date to a relative time string (e.g., "2 days ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export const formatDateRelative = (date: Date | string): string => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 1) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  } else {
    return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
  }
};

/**
 * Format time duration in minutes to human-readable string
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${remainingMinutes} min`;
};

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns True if date is today
 */
export const isToday = (date: Date | string): boolean => {
  let d: Date;
  
  // Handle string dates without time to avoid timezone issues
  if (typeof date === 'string' && !date.includes('T') && !date.includes(' ')) {
    const parts = date.split('-');
    if (parts.length === 3) {
      d = new Date(parseInt(parts[0]!), parseInt(parts[1]!) - 1, parseInt(parts[2]!));
    } else {
      d = new Date(date);
    }
  } else {
    d = new Date(date);
  }
  
  const today = new Date();
  
  return d.toDateString() === today.toDateString();
};

/**
 * Check if a date is this week
 * @param date - Date to check
 * @returns True if date is this week
 */
export const isThisWeek = (date: Date | string): boolean => {
  const d = new Date(date);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  return d >= startOfWeek && d <= endOfWeek;
}; 