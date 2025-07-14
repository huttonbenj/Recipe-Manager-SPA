module.exports = {
    root: true,
    env: {
        node: true,
        es2022: true,
        jest: true,
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
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    plugins: [
        '@typescript-eslint',
        'import',
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
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/require-await': 'error',

        // Import rules
        'import/order': ['error', {
            'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            'newlines-between': 'always',
            'alphabetize': { order: 'asc', caseInsensitive: true }
        }],
        'import/no-unresolved': 'off', // TypeScript handles this
        'import/no-cycle': 'error',
        'import/no-duplicate-exports': 'error',
        'import/newline-after-import': 'error',
        'import/no-default-export': 'error',

        // Node.js specific rules
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-debugger': 'error',
        'no-unused-vars': 'off',
        'prefer-const': 'error',
        'no-var': 'error',
        'object-shorthand': 'error',
        'prefer-arrow-callback': 'error',
        'prefer-template': 'error',

        // Security rules
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',
        'no-script-url': 'error',

        // Error handling
        'no-throw-literal': 'error',
        'prefer-promise-reject-errors': 'error',

        // Performance
        'no-await-in-loop': 'warn',
        'no-inner-declarations': 'error',

        // Code quality
        'complexity': ['warn', 10],
        'max-depth': ['warn', 4],
        'max-lines-per-function': ['warn', 50],
        'max-params': ['warn', 5],
    },
    overrides: [
        {
            files: ['**/*.test.ts', '**/*.spec.ts'],
            env: {
                jest: true,
            },
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
                'import/no-default-export': 'off',
                'max-lines-per-function': 'off',
                'complexity': 'off',
            },
        },
        {
            files: ['src/server.ts', 'src/app.ts'],
            rules: {
                'import/no-default-export': 'off',
            },
        },
    ],
} 