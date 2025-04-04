import { Button } from '@mantine/core';
import styles from './button.module.css';

export const ButtonComponentOverride = Button.extend({
    classNames: () => ({
        root: styles.root,
        section: styles.section,
    }),
    vars: (_theme, props) => {
        const variant = props.variant ?? 'filled';

        return {
            root: {
                '--button-bg': (() => {
                    if (variant === 'filled') {
                        return 'var(--mantine-primary-color-filled)';
                    }

                    if (variant === 'secondary') {
                        return `var(--mantine-color-secondary-7)`;
                    }
                })(),
                '--button-color': (() => {
                    if (variant === 'filled') {
                        return 'var(--mantine-primary-color-contrast)';
                    }

                    if (variant === 'secondary') {
                        return `var(--mantine-color-secondary-contrast)`;
                    }

                    if (variant === 'white') {
                        return undefined;
                    }
                    return undefined;
                })(),
                '--button-hover': (() => {
                    if (variant === 'secondary') {
                        return `var(--mantine-color-secondary-9)`;
                    }

                    if (variant === 'outline') {
                        return 'transparent';
                    }

                    return undefined;
                })(),
            },
        };
    },
});
