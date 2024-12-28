import type { Ref } from 'react';
import { forwardRef } from 'react';
import * as RCheckbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { Group } from '@/features/ui/group/group.tsx';
import { Icon } from '@/features/ui/icon/icon.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './checkbox.module.scss';

interface CheckboxProps {
    defaultValue?: boolean;
    label?: string;
    onChange: (value: boolean) => void;
    required?: boolean;
    value: boolean;
}

export const Checkbox = forwardRef((props: CheckboxProps, ref: Ref<HTMLButtonElement>) => {
    const { defaultValue, label, onChange, required, value } = props;

    const rootClassNames = clsx({
        [styles.root]: true,
    });

    if (label) {
        return (
            <Group align="center" gap="sm">
                <RCheckbox.Root
                    ref={ref}
                    asChild
                    checked={value}
                    defaultChecked={defaultValue}
                    required={required}
                    onCheckedChange={onChange}
                >
                    <span className={rootClassNames}>
                        <RCheckbox.Indicator asChild className={styles.indicator}>
                            <Icon icon="x" />
                        </RCheckbox.Indicator>
                    </span>
                </RCheckbox.Root>
                <Text isNoSelect>{label}</Text>
            </Group>
        );
    }

    return (
        <RCheckbox.Root
            ref={ref}
            asChild
            checked={value}
            defaultChecked={value}
            required={required}
            onCheckedChange={onChange}
        >
            <span className={rootClassNames}>
                <RCheckbox.Indicator asChild className={styles.indicator}>
                    <Icon icon="x" />
                </RCheckbox.Indicator>
            </span>
        </RCheckbox.Root>
    );
});

Checkbox.displayName = 'Checkbox';
