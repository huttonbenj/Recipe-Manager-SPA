module.exports = {
    extends: ['../../.eslintrc.cjs'],
    env: {
        node: true,
        es2022: true,
    },
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    rules: {
        // Node.js specific rules
        'no-process-env': 'off',
        'no-process-exit': 'error',
        'no-buffer-constructor': 'error',
        'no-path-concat': 'error',

        // Express.js specific rules
        'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

        // TypeScript specific rules for backend
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': ['warn', {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
        }],
        '@typescript-eslint/no-unused-vars': ['error', {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
        }],

        // Import rules for backend
        'import/order': ['error', {
            'groups': [
                'builtin',
                'external',
                'internal',
                'parent',
                'sibling',
                'index'
            ],
            'newlines-between': 'always',
            'alphabetize': { order: 'asc', caseInsensitive: true },
            'pathGroups': [
                {
                    'pattern': '@/**',
                    'group': 'internal',
                    'position': 'before'
                }
            ],
            'pathGroupsExcludedImportTypes': ['builtin']
        }],

        // Security rules
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',
        'no-script-url': 'error',
    },
    overrides: [
        {
            files: ['**/*.test.ts', '**/*.spec.ts'],
            env: {
                jest: true,
            },
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
                'no-console': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off',
            },
        },
        {
            files: ['src/prisma/seed.ts'],
            rules: {
                'no-console': 'off',
            },
        },
    ],
} 