module.exports = {
    root: true,
    env: {
        es2022: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'import',
        'prettier',
    ],
    rules: {
        // TypeScript rules
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/prefer-const': 'error',
        '@typescript-eslint/no-inferrable-types': 'error',

        // Import rules
        'import/order': ['error', {
            'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            'newlines-between': 'always',
            'alphabetize': { order: 'asc', caseInsensitive: true }
        }],
        'import/no-unresolved': 'off', // TypeScript handles this
        'import/no-cycle': 'error',
        'import/no-duplicate-exports': 'error',

        // General rules
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-debugger': 'error',
        'no-unused-vars': 'off', // TypeScript handles this
        'prefer-const': 'error',
        'no-var': 'error',
        'object-shorthand': 'error',
        'prefer-arrow-callback': 'error',
        'prefer-template': 'error',
        'no-duplicate-imports': 'error',
        'no-useless-return': 'error',
        'no-useless-catch': 'error',
        'no-useless-concat': 'error',
        'no-useless-escape': 'error',
        'no-trailing-spaces': 'error',
        'eol-last': 'error',
        'comma-dangle': ['error', 'always-multiline'],
        'semi': ['error', 'never'],
        'quotes': ['error', 'single', { avoidEscape: true }],

        // Prettier integration
        'prettier/prettier': 'error',
    },
    overrides: [
        {
            files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
            env: {
                jest: true,
                'vitest-globals/env': true,
            },
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
                'no-console': 'off',
            },
        },
    ],
    ignorePatterns: [
        'dist/',
        'build/',
        'node_modules/',
        '*.config.js',
        '*.config.ts',
        '.eslintrc.js',
        '.eslintrc.cjs',
        'coverage/',
        'public/',
        'uploads/',
    ],
} 