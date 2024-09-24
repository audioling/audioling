import { baseTheme } from '@/themes/base.ts';
import type { AppThemeConfiguration } from '@/themes/index.js';

export const defaultDarkTheme: AppThemeConfiguration = {
    name: 'Dark (Default)',
    theme: {
        ...baseTheme,
    },
    type: 'dark',
};
