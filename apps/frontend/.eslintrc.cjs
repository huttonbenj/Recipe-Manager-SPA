module.exports = {
    extends: [
        '../../.eslintrc.cjs',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
    ],
    env: {
        browser: true,
        es2022: true,
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    plugins: [
        'react',
        'react-hooks',
        'jsx-a11y',
    ],
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        // React specific rules
        'react/react-in-jsx-scope': 'off', // Not needed with React 17+
        'react/prop-types': 'off', // TypeScript handles this
        'react/display-name': 'off',
        'react/jsx-uses-react': 'off',
        'react/jsx-uses-vars': 'error',
        'react/jsx-key': 'error',
        'react/jsx-no-duplicate-props': 'error',
        'react/jsx-no-undef': 'error',
        'react/jsx-pascal-case': 'error',
        'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
        'react/jsx-boolean-value': ['error', 'never'],
        'react/jsx-fragments': ['error', 'syntax'],
        'react/jsx-no-useless-fragment': 'error',
        'react/jsx-sort-props': ['error', {
            callbacksLast: true,
            shorthandFirst: true,
            reservedFirst: true,
        }],
        'react/self-closing-comp': 'error',
        'react/no-array-index-key': 'warn',
        'react/no-unstable-nested-components': 'error',
        'react/hook-use-state': 'error',

        // React Hooks rules
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // Accessibility rules
        'jsx-a11y/alt-text': 'error',
        'jsx-a11y/aria-props': 'error',
        'jsx-a11y/aria-proptypes': 'error',
        'jsx-a11y/aria-unsupported-elements': 'error',
        'jsx-a11y/role-has-required-aria-props': 'error',
        'jsx-a11y/role-supports-aria-props': 'error',
        'jsx-a11y/no-access-key': 'error',
        'jsx-a11y/no-autofocus': 'warn',
        'jsx-a11y/click-events-have-key-events': 'warn',
        'jsx-a11y/no-static-element-interactions': 'warn',

        // TypeScript specific rules for frontend
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off', // Too verbose for React components
        '@typescript-eslint/no-unused-vars': ['error', {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
        }],

        // Import rules for frontend
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
                    'pattern': 'react',
                    'group': 'external',
                    'position': 'before'
                },
                {
                    'pattern': '@/**',
                    'group': 'internal',
                    'position': 'before'
                }
            ],
            'pathGroupsExcludedImportTypes': ['react']
        }],

        // Browser specific rules
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-alert': 'error',
        'no-confirm': 'error',
    },
    overrides: [
        {
            files: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.tsx', '**/*.spec.ts'],
            env: {
                jest: true,
            },
            extends: ['plugin:testing-library/react'],
            plugins: ['testing-library'],
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
                'no-console': 'off',
                'testing-library/await-async-query': 'error',
                'testing-library/no-await-sync-query': 'error',
                'testing-library/no-debug': 'warn',
                'testing-library/no-dom-import': 'error',
                'testing-library/prefer-screen-queries': 'error',
            },
        },
        {
            files: ['src/vite-env.d.ts', 'vite.config.ts'],
            rules: {
                'import/no-default-export': 'off',
            },
        },
    ],
} 