import { Chip } from '@mantine/core';

export const ChipComponentOverride = Chip.extend({
    vars: (theme, props) => {
        const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
        const variant = props.variant ?? 'filled';
        return {
            root: {
                '--chip-bg':
        variant !== 'light'
            ? colorKey
                ? `var(--mantine-color-${colorKey}-filled)`
                : 'var(--mantine-primary-color-filled)'
            : undefined,
                '--chip-color':
        variant === 'filled'
            ? colorKey
                ? `var(--mantine-color-${colorKey}-contrast)`
                : 'var(--mantine-primary-color-contrast)'
            : undefined,
            },
        };
    },
});
