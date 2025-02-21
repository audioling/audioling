import antfu from '@antfu/eslint-config';
import tailwind from 'eslint-plugin-tailwindcss';

export default antfu(
    {
        ...tailwind.configs['flat/recommended'],
        formatters: true,
        react: true,
        typescript: true,
        stylistic: {
            indent: 4,
            quotes: 'single',
            semi: true,
        },
        rules: {
            'yaml/indent': 'off',
        },
        ignores: ['./.github/workflows/**', '/apps/electron/.electron-vendors.cache.json'],
    },
    {
        // Without `files`, they are general rules for all files
        rules: {
            'no-console': 'off',
            'n/prefer-global/process': 'off',
        },
    },
);
