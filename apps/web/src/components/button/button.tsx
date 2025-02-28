import { Button } from '@mantine/core';

export const ButtonComponentOverride = Button.extend({
    vars: (theme, props) => {
        const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
        const variant = props.variant ?? 'filled';
        return {
            root: {
                '--button-color': (() => {
                    if (variant === 'filled') {
                        if (colorKey) {
                            return `var(--mantine-color-${colorKey}-contrast)`;
                        }
                        return 'var(--mantine-primary-color-contrast)';
                    }
                    if (variant === 'white') {
                        return undefined;
                    }
                    return undefined;
                })(),
            },
        };
    },
});
