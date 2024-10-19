const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:typescript-sort-keys/recommended',
        'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import', 'sort-keys-fix', 'sort-export-all'],
    parserOptions: {
        project,
    },
    rules: {
        'prettier/prettier': [
            'error',
            {
                tabWidth: 4,
                singleAttributePerLine: false,
            },
        ],
        '@typescript-eslint/consistent-type-imports': 'error',
        'import/order': [
            'error',
            {
                alphabetize: {
                    caseInsensitive: true,
                    order: 'asc',
                },
                groups: ['builtin', 'external', 'internal', ['parent', 'sibling']],
                'newlines-between': 'never',
                pathGroups: [
                    {
                        group: 'external',
                        pattern: 'react',
                        position: 'before',
                    },
                ],
                pathGroupsExcludedImportTypes: ['react'],
            },
        ],
        'sort-keys-fix/sort-keys-fix': 'warn',
        'sort-imports': [
            'error',
            {
                ignoreCase: true,
                ignoreDeclarationSort: true,
            },
        ],
        'sort-export-all/sort-export-all': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'import/no-named-as-default-member': 'off',
        '@typescript-eslint/no-misused-promises': [
            'error',
            {
                checksVoidReturn: false,
            },
        ],
    },
    overrides: [
        {
            files: ['**/index.{ts,js,jsx,tsx}'],
            rules: {
                'sort-export-all/sort-export-all': 'error',
            },
        },
    ],
    settings: {
        'import/resolver': {
            typescript: {
                project,
            },
        },
        ignorePatterns: ['node_modules/', 'dist/'],
    },
};
