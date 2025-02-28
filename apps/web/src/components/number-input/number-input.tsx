import { NumberInput } from '@mantine/core';
import styles from './number-input.module.css';

export const NumberInputComponentOverride = NumberInput.extend({
    classNames: () => ({
        label: styles.label,
    }),
    defaultProps: {
        variant: 'filled',
    },
    vars: (_theme, props) => {
        return {
            controls: {},
            wrapper: {
                '--input-bg': props.variant === 'filled' ? `var(--mantine-color-default)` : 'transparent',
            },
        };
    },
});
