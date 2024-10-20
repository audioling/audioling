import { baseTheme, baseThemeComponents } from '@/themes/base.ts';
import type { AppThemeConfiguration } from '@/themes/index.js';

export const defaultDarkTheme: AppThemeConfiguration = {
    components: {
        ...baseThemeComponents,
    },
    name: 'Dark (Default)',
    theme: {
        ...baseTheme,
    },
    type: 'dark',
};
