import type { CSSVariablesResolver } from '@mantine/core';

export const mantineCssVariableResolver: CSSVariablesResolver = () => ({
    dark: {
        '--mantine-color-default': 'var(--mantine-color-dark-9)',
        '--mantine-color-default-border': 'var(--mantine-color-dark-7)',
        '--mantine-primary-color-contrast': 'var(--theme-global-primary-color-contrast)',
    },
    light: {
        '--mantine-color-default': 'var(--mantine-color-gray-1)',
        '--mantine-color-default-hover': 'var(--mantine-color-gray-3)',
        '--mantine-primary-color-contrast': 'var(--theme-global-primary-color-contrast)',
    },
    variables: {
        '--ai-color-default': 'var(--mantine-color-default)',
    },
});
