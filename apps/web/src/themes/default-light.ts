import { baseTheme } from '@/themes/base.ts';
import type { AppThemeConfiguration } from '@/themes/index.ts';

export const defaultLightTheme: AppThemeConfiguration = {
    name: 'Light (Default)',
    theme: {
        ...baseTheme,
    },
    type: 'dark',
};
