import type { Ref } from 'react';
import { forwardRef, useState } from 'react';
import type { PasswordInputProps as MantinePasswordInputProps } from '@mantine/core';
import { PasswordInput as MantinePasswordInput } from '@mantine/core';
import { clsx } from 'clsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import type { Sizes } from '@/themes/index.ts';
import styles from './password-input.module.scss';

interface PasswordInputProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
    children?: React.ReactNode;
    description?: string;
    label?: string;
    leftSection?: React.ReactNode;
    placeholder?: string;
    radius?: Sizes;
    size?: Sizes;
}

export const PasswordInput = forwardRef((props: PasswordInputProps, ref: Ref<HTMLInputElement>) => {
    const { children, description, label, leftSection, placeholder, radius, size, ...htmlProps } =
        props;

    const rootClassNames = clsx({
        [styles.root]: true,
        [styles[`size-${size || 'md'}`]]: true,
    });

    const inputClassNames = clsx({
        [styles.input]: true,
        [styles[`size-${size || 'md'}`]]: true,
        [styles[`radius-${radius || 'md'}`]]: true,
    });

    const passwordInputClassNames: MantinePasswordInputProps['classNames'] = {
        description: styles.description,
        input: inputClassNames,
        label: styles.label,
        required: styles.required,
        root: rootClassNames,
        section: styles.section,
        wrapper: styles.wrapper,
    };

    const [visible, setVisible] = useState(false);

    return (
        <MantinePasswordInput
            ref={ref}
            unstyled
            classNames={passwordInputClassNames}
            description={description}
            label={label}
            leftSection={leftSection}
            placeholder={placeholder}
            rightSection={
                <IconButton
                    icon={visible ? 'visibilityOff' : 'visibility'}
                    variant="default"
                    onClick={() => setVisible((prev) => !prev)}
                />
            }
            visible={visible}
            onVisibilityChange={setVisible}
            {...htmlProps}
        >
            {children}
        </MantinePasswordInput>
    );
});

PasswordInput.displayName = 'PasswordInput';
