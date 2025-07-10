module.exports = {
    root: true,
    env: { node: true, es2020: true },
    extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
    ],
    ignorePatterns: [
        'dist',
        'node_modules',
        'src/generated/**/*',  // Exclude all generated Prisma files
        '*.d.ts'
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
        '@typescript-eslint/prefer-const': 'error',
        'prefer-const': 'off', // Let TypeScript handle this
        'no-console': 'warn',
    },
}; 