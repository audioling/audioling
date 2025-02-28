import { Radio } from '@mantine/core';

export const RadioComponentOverride = Radio.extend({
    vars: (theme, props) => ({
        root: {
            '--radio-color': props.color
                ? Object.keys(theme.colors).includes(props.color)
                    ? `var(--mantine-color-${props.color}-filled)`
                    : props.color
                : 'var(--mantine-primary-color-filled)',

            '--radio-icon-color': props.color
                ? Object.keys(theme.colors).includes(props.color)
                    ? `var(--mantine-color-${props.color}-contrast)`
                    : props.color
                : 'var(--mantine-primary-color-contrast)',
        },
    }),
});
