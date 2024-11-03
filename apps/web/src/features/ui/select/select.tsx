import type { Ref } from 'react';
import { forwardRef } from 'react';
import type { SelectProps as MantineSelectProps } from '@mantine/core';
import { Select as MantineSelect } from '@mantine/core';
import clsx from 'clsx';
import type { Sizes } from '@/themes/index.ts';
import styles from './select.module.scss';

interface SelectProps {
    data: {
        label: string;
        value: string;
    }[];
    description?: string;
    label?: string;
    leftSection?: React.ReactNode;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onChange: (value: string | null) => void;
    placeholder?: string;
    radius?: Sizes;
    rightSection?: React.ReactNode;
    size?: Sizes;
    value?: string;
}

export const Select = forwardRef((props: SelectProps, ref: Ref<HTMLInputElement>) => {
    const {
        description,
        label,
        leftSection,
        placeholder,
        radius,
        rightSection,
        size,
        data,
        value,
        onChange,
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
    });

    const selectClassNames: MantineSelectProps['classNames'] = {
        description: styles.description,
        dropdown: styles.dropdown,
        input: inputClassNames,
        label: styles.label,
        option: styles.option,
        required: styles.required,
        root: rootClassNames,
        section: styles.section,
        wrapper: styles.wrapper,
    };

    return (
        <MantineSelect
            ref={ref}
            classNames={selectClassNames}
            comboboxProps={{
                withinPortal: true,
                zIndex: 10000,
            }}
            data={data}
            description={description}
            label={label}
            leftSection={leftSection}
            placeholder={placeholder}
            rightSection={rightSection}
            value={value}
            onChange={onChange}
            {...htmlProps}
        />
    );
});

Select.displayName = 'Select';
