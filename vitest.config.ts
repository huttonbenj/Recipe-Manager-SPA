import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { TIMEOUTS, TEST_CONFIG } from '@recipe-manager/shared';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    // Pick environment automatically per package
    environmentMatchGlobs: [
      // Server tests need Node
      ['packages/server/**', 'node'],
      ['packages/server/src/**', 'node'],
      // Client tests (and all others) use happy-dom as well for DOM APIs
      ['packages/client/**', 'happy-dom'],
      ['**/*.{test,spec}.{js,ts,jsx,tsx}', 'happy-dom'],
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
    testTimeout: TIMEOUTS.TEST_TIMEOUT,
    hookTimeout: TIMEOUTS.HOOK_TIMEOUT,
    teardownTimeout: TIMEOUTS.TEARDOWN_TIMEOUT,
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
        'node_modules',
        'dist',
        '.git',
        '**/fixtures/**',
        'tests/e2e/**',
        // Exclude non-runtime or barrel files that should not be tested for coverage
        '**/index.ts',
        '**/index.js',
        '**/vite.config.ts',
        '**/vitest.config.ts',
        '**/*.config.{js,ts}',
        '**/test-setup.{js,ts}',
        '**/setupTests.{js,ts}',
        '**/global-setup.{js,ts}',
        '**/postcss.config.{js,ts}',
        '**/tailwind.config.{js,ts}',
        '**/.eslintrc.{js,cjs,ts,json}',
        '**/test-results/**',
        '**/assets/**',
        '**/cypress/**',
        '**/e2e/**',
        '**/config/**',
        '**/main.{js,ts,jsx,tsx}',
        '**/App.{js,ts,jsx,tsx}',
        '**/__tests__/mocks/**',
        'scripts/**',
        '**/*.d.ts',
        '**/migrations/**',
        '**/generated/**',
        '**/coverage/**',
        // Keep default distribution / build artifacts excluded
        '**/dist/**'
      ],
      // Standardized coverage thresholds
      thresholds: {
        global: {
          statements: TEST_CONFIG.COVERAGE_THRESHOLD.STATEMENTS,
          branches: TEST_CONFIG.COVERAGE_THRESHOLD.BRANCHES,
          functions: TEST_CONFIG.COVERAGE_THRESHOLD.FUNCTIONS,
          lines: TEST_CONFIG.COVERAGE_THRESHOLD.LINES,
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