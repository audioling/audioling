import { Indicator } from '@mantine/core';

export const IndicatorComponentOverride = Indicator.extend({
    vars: (theme, props) => {
        const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
        return {
            root: {
                '--indicator-text-color': colorKey
                    ? `var(--mantine-color-${colorKey}-contrast)`
                    : 'var(--mantine-primary-color-contrast)',
            },
        };
    },
});
