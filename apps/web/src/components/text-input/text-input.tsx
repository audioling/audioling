import { TextInput } from '@mantine/core';
import styles from './text-input.module.css';

export const TextInputComponentOverride = TextInput.extend({
    classNames: () => ({
        label: styles.label,
    }),
    defaultProps: {
        variant: 'filled',
    },
    vars: (_theme, props) => {
        return {
            wrapper: {
                '--input-bg': props.variant === 'filled' ? `var(--mantine-color-default)` : 'transparent',
            },
        };
    },
});
