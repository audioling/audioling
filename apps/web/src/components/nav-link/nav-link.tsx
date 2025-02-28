import { NavLink } from '@mantine/core';

export const NavLinkComponentOverride = NavLink.extend({
    vars: (theme, props) => {
        const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
        const variant = props.variant ?? 'light';
        return {
            children: {},
            root: {
                '--nl-color':
        variant === 'filled' ? colorKey ? `var(--mantine-color-${colorKey}-contrast)` : 'var(--mantine-primary-color-contrast)' : undefined,
            },
        };
    },
});
