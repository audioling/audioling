import type { Ref } from 'react';
import { forwardRef } from 'react';
import type { TextareaProps as MantineTextAreaProps } from '@mantine/core';
import { Textarea as MantineTextArea } from '@mantine/core';
import { clsx } from 'clsx';
import type { Sizes } from '@/themes/index.ts';
import styles from './text-area.module.scss';

export interface TextAreaProps extends Omit<React.ComponentPropsWithoutRef<'textarea'>, 'size'> {
    children?: React.ReactNode;
    description?: string;
    label?: string;
    leftSection?: React.ReactNode;
    placeholder?: string;
    radius?: Sizes;
    rightSection?: React.ReactNode;
    size?: Sizes;
}

export const TextArea = forwardRef((props: TextAreaProps, ref: Ref<HTMLTextAreaElement>) => {
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

    const textAreaClassNames: MantineTextAreaProps['classNames'] = {
        description: styles.description,
        input: inputClassNames,
        label: styles.label,
        required: styles.required,
        root: rootClassNames,
        section: styles.section,
        wrapper: styles.wrapper,
    };

    return (
        <MantineTextArea
            ref={ref}
            classNames={textAreaClassNames}
            description={description}
            label={label}
            leftSection={leftSection}
            placeholder={placeholder}
            resize="none"
            rightSection={rightSection}
            {...htmlProps}
        >
            {children}
        </MantineTextArea>
    );
});

TextArea.displayName = 'TextArea';
