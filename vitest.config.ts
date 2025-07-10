import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    // Pick environment automatically per package
    environmentMatchGlobs: [
      ['packages/client/**', 'happy-dom'],
      ['tests/client/**', 'happy-dom'],
      ['**', 'node'],
    ],
    setupFiles: [
      './packages/server/src/__tests__/setup/global-setup.ts',
      './packages/client/src/__tests__/setup/test-setup.ts',
    ],
    include: [
      'tests/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'packages/**/src/__tests__/**/*.{test,spec}.{js,ts,jsx,tsx}'
    ],
    exclude: [
      'node_modules',
      'dist',
      '.git',
      '**/fixtures/**',
      'tests/e2e/**',
    ],
    // Standardized timeouts
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 30000,
    // Standardized reporters
    reporters: ['verbose', 'junit', 'json'],
    outputFile: {
      junit: './test-results/junit.xml',
      json: './test-results/results.json'
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      // Measure all source files for true coverage
      all: true,
      exclude: [
        'node_modules/',
        '**/__tests__/**',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/dist/**',
        '**/migrations/**',
        '**/generated/**',
        '**/coverage/**'
      ],
      // Standardized coverage thresholds
      thresholds: {
        global: {
          statements: 85,
          branches: 85,
          functions: 85,
          lines: 85,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@client': resolve(__dirname, 'packages/client/src'),
      '@server': resolve(__dirname, 'packages/server/src'),
      '@shared': resolve(__dirname, 'packages/shared/src'),
    },
  },
}); 