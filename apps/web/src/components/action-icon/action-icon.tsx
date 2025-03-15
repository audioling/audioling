import { ActionIcon } from '@mantine/core';
import clsx from 'clsx';
import styles from './action-icon.module.css';

export const ActionIconComponentOverride = ActionIcon.extend({
    classNames: (_theme, props) => ({
        icon: styles.icon,
        loader: styles.loader,
        root: clsx(styles.root, {
            [styles.fill]: props.variant?.includes('-fill'),
        }),
    }),
    vars: (_theme, props) => {
        const variant = props.variant ?? 'filled';

        return {
            root: {
                '--ai-color': (() => {
                    switch (variant) {
                        case 'filled':
                            return 'var(--mantine-primary-color-contrast)';
                        case 'secondary':
                            return `var(--mantine-color-secondary-contrast)`;
                        case 'transparent':
                            return 'var(--mantine-primary-color-filled)';
                        case 'white':
                            return 'var(--mantine-primary-color-filled)';
                        case 'subtle':
                            return 'var(--mantine-primary-color-filled)';
                        default:
                            return undefined;
                    }
                })(),
            },
        };
    },
});
