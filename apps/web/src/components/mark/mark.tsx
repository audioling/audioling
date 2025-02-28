import { Mark } from '@mantine/core';

export const MarkComponentOverride = Mark.extend({
    vars: (theme, props) => {
        const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : 'yellow';
        return {
            root: {
                '--mark-bg-dark': `var(--mantine-color-${colorKey}-filled)`,
                '--mark-bg-light': `var(--mantine-color-${colorKey}-filled-hover)`,
            },
        };
    },
});
