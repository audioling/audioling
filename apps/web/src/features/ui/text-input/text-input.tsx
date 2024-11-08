import type { Ref } from 'react';
import { forwardRef } from 'react';
import type { TextInputProps as MantineTextInputProps } from '@mantine/core';
import { TextInput as MantineTextInput } from '@mantine/core';
import { clsx } from 'clsx';
import type { Sizes } from '@/themes/index.ts';
import styles from './text-input.module.scss';

export interface TextInputProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
    children?: React.ReactNode;
    description?: string;
    label?: string;
    leftSection?: React.ReactNode;
    placeholder?: string;
    radius?: Sizes;
    rightSection?: React.ReactNode;
    size?: Sizes;
}

export const TextInput = forwardRef((props: TextInputProps, ref: Ref<HTMLInputElement>) => {
    const {
        children,
        description,
        label,
        leftSection,
        placeholder,
        radius,
        rightSection,
        size,
        ...htmlProps
    } = props;

    const rootClassNames = clsx({
        [styles.root]: true,
        [styles[`size-${size || 'md'}`]]: true,
    });

    const inputClassNames = clsx({
        [styles.input]: true,
        [styles[`size-${size || 'md'}`]]: true,
        [styles[`radius-${radius || 'md'}`]]: true,
        [styles.rightSection]: !!rightSection,
    });

    const textInputClassNames: MantineTextInputProps['classNames'] = {
        description: styles.description,
        input: inputClassNames,
        label: styles.label,
        required: styles.required,
        root: rootClassNames,
        section: styles.section,
        wrapper: styles.wrapper,
    };

    return (
        <MantineTextInput
            ref={ref}
            unstyled
            classNames={textInputClassNames}
            description={description}
            label={label}
            leftSection={leftSection}
            placeholder={placeholder}
            rightSection={rightSection}
            {...htmlProps}
        >
            {children}
        </MantineTextInput>
    );
});

TextInput.displayName = 'TextInput';
