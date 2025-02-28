import antfu from '@antfu/eslint-config';
import sortKeysCustomOrder from 'eslint-plugin-sort-keys-custom-order';

export default antfu(
    {
        formatters: true,
        ignores: ['./.github/workflows/**', '/apps/electron/.electron-vendors.cache.json'],
        plugins: {
            'sort-keys-custom-order': sortKeysCustomOrder,
        },
        react: true,
        rules: {
            ...sortKeysCustomOrder.configs['flat/recommended'].rules,
            'style/jsx-child-element-spacing': 'error',
            'style/jsx-closing-tag-location': [
                'error',
                'tag-aligned',
            ],
            'style/jsx-max-props-per-line': [
                'error',
                {
                    maximum: 4,
                    when: 'always',
                },
            ],
            'style/jsx-newline': [
                'error',
                {
                    allowMultilines: false,
                    prevent: true,
                },
            ],
            'style/jsx-self-closing-comp': [
                'error',
                {
                    component: true,
                    html: true,
                },
            ],
            'style/jsx-sort-props': [
                'error',
                {
                    callbacksLast: true,
                    ignoreCase: false,
                    noSortAlphabetically: false,
                    reservedFirst: true,
                    shorthandFirst: true,
                    shorthandLast: false,
                },
            ],
            'yaml/indent': 'off',
        },
        stylistic: {
            indent: 4,
            quotes: 'single',
            semi: true,
        },
        typescript: true,
    },
    {
        rules: {
            'eslint-comments/no-unlimited-disable': 'off',
            'n/prefer-global/process': 'off',
            'no-console': 'off',
        },
    },
    {
        files: ['apps/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
        rules: {
            'style/max-len': [
                'error',
                {
                    code: 120,
                    ignoreComments: true,
                    ignoreRegExpLiterals: true,
                    ignoreTemplateLiterals: true,
                    tabWidth: 4,
                },
            ],
            'ts/prefer-literal-enum-member': 'off',
        },
    },
);
