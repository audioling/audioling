import type { CSSVariablesResolver } from '@mantine/core';

export const mantineCssVariableResolver: CSSVariablesResolver = () => ({
    dark: {
        '--mantine-color-default': 'var(--mantine-color-dark-9)',
    },
    light: {
        '--mantine-color-default': 'var(--mantine-color-gray-1)',
        '--mantine-color-default-hover': 'var(--mantine-color-gray-3)',
    },
    variables: {},
});
