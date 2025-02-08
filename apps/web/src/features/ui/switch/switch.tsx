import { forwardRef } from 'react';
import * as RSwitch from '@radix-ui/react-switch';
import clsx from 'clsx';
import { Group } from '@/features/ui/group/group.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './switch.module.scss';

interface SwitchProps {
    defaultValue?: boolean;
    disabled?: boolean;
    label?: string;
    onChange: (value: boolean) => void;
    required?: boolean;
    value: boolean;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>((props, ref) => {
    const { defaultValue, disabled, label, onChange, required, value } = props;

    const rootClassNames = clsx(styles.root, {
        [styles.disabled]: disabled,
    });

    if (label) {
        return (
            <Group align="center">
                <RSwitch.Root
                    ref={ref}
                    checked={value}
                    className={rootClassNames}
                    defaultChecked={defaultValue}
                    disabled={disabled}
                    required={required}
                    onCheckedChange={onChange}
                >
                    <RSwitch.Thumb className={styles.thumb} />
                </RSwitch.Root>
                <Text isNoSelect>{label}</Text>
            </Group>
        );
    }

    return (
        <RSwitch.Root
            ref={ref}
            checked={value}
            className={rootClassNames}
            defaultChecked={defaultValue}
            disabled={disabled}
            required={required}
            onCheckedChange={onChange}
        >
            <RSwitch.Thumb className={styles.thumb} />
        </RSwitch.Root>
    );
});

Switch.displayName = 'Switch';
