import { forwardRef } from 'react';
import * as RSwitch from '@radix-ui/react-switch';
import { Group } from '@/features/ui/group/group.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './switch.module.scss';

interface SwitchProps {
    defaultValue?: boolean;
    label?: string;
    onChange: (value: boolean) => void;
    required?: boolean;
    value: boolean;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>((props, ref) => {
    const { defaultValue, label, onChange, required, value } = props;

    if (label) {
        return (
            <Group align="center">
                <RSwitch.Root
                    ref={ref}
                    checked={value}
                    className={styles.root}
                    defaultChecked={defaultValue}
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
            className={styles.root}
            defaultChecked={defaultValue}
            required={required}
            onCheckedChange={onChange}
        >
            <RSwitch.Thumb className={styles.thumb} />
        </RSwitch.Root>
    );
});

Switch.displayName = 'Switch';
