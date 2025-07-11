module.exports = {
    root: true,
    env: { node: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    ignorePatterns: [
        'dist',
        'node_modules',
        'src/generated/**/*',  // Exclude all generated Prisma files
        '*.d.ts',
        '**/*.test.ts',  // Exclude test files
        '**/__tests__/**/*'  // Exclude test directories
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        'prefer-const': 'error',
        'no-console': 'warn',
    },
}; 