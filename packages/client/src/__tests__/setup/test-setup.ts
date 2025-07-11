import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { server } from '../mocks/server';
import * as matchers from '@testing-library/jest-dom/matchers';
import { API_CONFIG } from '@recipe-manager/shared';

// Extend expect with Jest DOM matchers
expect.extend(matchers);

// Setup MSW only if not explicitly skipped (e.g., in server-side tests)
const skipMsw = typeof window === 'undefined';

if (!skipMsw) {
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'error',
    });
  });

  afterEach(() => {
    server.resetHandlers();
    cleanup();
  });

  afterAll(() => {
    server.close();
  });
} else {
  // Even if MSW is skipped, still perform RTL cleanup after each test
  afterEach(() => {
    cleanup();
  });
}

// Global test utilities
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// DOM-related mocks (only run in browser environment)
if (typeof window !== 'undefined') {
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock window.scrollTo
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn(),
  });

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0,
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  // Mock sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock,
  });
}

// Mock URL.createObjectURL
globalThis.URL.createObjectURL = vi.fn(() => 'mock-url');
globalThis.URL.revokeObjectURL = vi.fn();

// Mock File and FileReader
globalThis.File = class MockFile {
  constructor(
    public contents: string[],
    public name: string,
    public options: any = {}
  ) {}
  
  get size() {
    return this.contents.reduce((acc, content) => acc + content.length, 0);
  }
  
  get type() {
    return this.options.type || 'text/plain';
  }
} as any;

globalThis.FileReader = class MockFileReader {
  result: any = null;
  error: any = null;
  readyState = 0;
  onload: any = null;
  onerror: any = null;
  onabort: any = null;
  onloadstart: any = null;
  onloadend: any = null;
  onprogress: any = null;

  readAsText(file: any) {
    this.result = file.contents.join('');
    this.readyState = 2;
    if (this.onload) this.onload({ target: this });
  }

  readAsDataURL(file: any) {
    this.result = `data:${file.type};base64,${btoa(file.contents.join(''))}`;
    this.readyState = 2;
    if (this.onload) this.onload({ target: this });
  }

  addEventListener(event: string, callback: any) {
    if (event === 'load') this.onload = callback;
    if (event === 'error') this.onerror = callback;
  }

  removeEventListener() {
    // Mock implementation
  }
} as any;

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_URL: API_CONFIG.BASE_URL,
    MODE: 'test',
    DEV: false,
    PROD: false,
    SSR: false,
  },
  writable: true,
});

// Console error/warning suppression for tests
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  if (
    args[0]?.includes?.('Warning: ReactDOM.render is no longer supported') ||
    args[0]?.includes?.('Warning: React.createFactory() is deprecated')
  ) {
    return;
  }
  originalError.call(console, ...args);
};

console.warn = (...args) => {
  if (
    args[0]?.includes?.('componentWillReceiveProps') ||
    args[0]?.includes?.('componentWillUpdate')
  ) {
    return;
  }
  originalWarn.call(console, ...args);
}; 

// Mock React Query
export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Test environment configuration
declare global {
  interface Window {
    __REACT_QUERY_STATE__: unknown;
  }
} 