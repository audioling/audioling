import { baseTheme, baseThemeComponents } from '@/themes/base.ts';
import type { AppThemeConfiguration } from '@/themes/index.ts';

export const defaultLightTheme: AppThemeConfiguration = {
    components: {
        ...baseThemeComponents,
    },
    name: 'Light (Default)',
    theme: {
        ...baseTheme,
    },
    type: 'dark',
};
