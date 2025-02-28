import { Checkbox } from '@mantine/core';

export const CheckboxComponentOverride = Checkbox.extend({
    vars: (theme, props) => {
        const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
        return {
            root: {
                '--checkbox-color': colorKey ? `var(--mantine-color-${colorKey}-filled)` : 'var(--mantine-primary-color-filled)',

                '--checkbox-icon-color': colorKey ? `var(--mantine-color-${colorKey}-contrast)` : 'var(--mantine-primary-color-contrast)',
            },
        };
    },
});
