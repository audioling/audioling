import type { Ref } from 'react';
import { forwardRef } from 'react';
import { Button as MantineButton } from '@mantine/core';
import { clsx } from 'clsx';
import styles from './button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    isDisabled?: boolean;
    isLoading?: boolean;
    radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    uppercase?: boolean;
    variant?: 'filled' | 'default' | 'danger';
}

export const Button = forwardRef((props: ButtonProps, ref: Ref<HTMLButtonElement>) => {
    const { children, isLoading, isDisabled, size, uppercase, variant, ...htmlProps } = props;

    const rootClassNames = clsx({
        [styles.root]: true,
        [styles.filledVariant]: variant === 'filled',
        [styles.defaultVariant]: variant === undefined || variant === 'default',
        [styles.dangerVariant]: variant === 'danger',
        [styles[`size-${size || 'md'}`]]: true,
        [styles[`radius-${size || 'md'}`]]: true,
        [styles.uppercase]: uppercase,
    });

    const buttonClassNames = {
        inner: styles.inner,
        label: styles.label,
        loader: styles.loader,
        root: rootClassNames,
        section: styles.section,
    };

    return (
        <MantineButton
            ref={ref}
            unstyled
            classNames={buttonClassNames}
            disabled={isDisabled}
            loading={isLoading}
            {...htmlProps}
        >
            {children}
        </MantineButton>
    );
});

Button.displayName = 'Button';
