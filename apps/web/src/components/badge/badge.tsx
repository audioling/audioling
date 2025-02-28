import { Badge } from '@mantine/core';

export const BadgeComponentOverride = Badge.extend({
    vars: (theme, props) => {
        const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
        const variant = props.variant ?? 'filled';
        return {
            root: {
                '--badge-bg': variant === 'filled' && colorKey ? `var(--mantine-color-${colorKey}-filled)` : undefined,
                '--badge-color':
        variant === 'filled'
            ? (colorKey ? `var(--mantine-color-${colorKey}-contrast)` : 'var(--mantine-primary-color-contrast)')
            : undefined,
            },
        };
    },
});
