module.exports = {
    root: true,
    env: {
        node: true,
        es2022: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.cjs', 'dist/**'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
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
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/require-await': 'off',

        // Import rules - simplified for now
        'import/no-unresolved': 'off', // TypeScript handles this
        'import/order': 'off',
        'import/no-cycle': 'off',
        'import/no-duplicate-exports': 'off',
        'import/newline-after-import': 'off',
        'import/no-default-export': 'off',

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

        // Code quality - relaxed for now
        'complexity': 'off',
        'max-depth': 'off',
        'max-lines-per-function': 'off',
        'max-params': 'off',
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