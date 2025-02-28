import { PasswordInput } from '@mantine/core';
import styles from './password-input.module.css';
import { Icon } from '/@/components/icon/icon';

export const PasswordInputComponentOverride = PasswordInput.extend({
    classNames: () => ({
        label: styles.label,
    }),
    defaultProps: {
        variant: 'filled',
        visibilityToggleIcon: ({ reveal }) => <Icon icon={reveal ? 'visibilityOff' : 'visibility'} />,
    },
    vars: (_theme, props) => {
        return {
            root: {},
            wrapper: {
                '--input-bg': props.variant === 'filled' ? `var(--mantine-color-default)` : 'transparent',
            },
        };
    },
});
