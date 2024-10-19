import type { Ref } from 'react';
import { forwardRef } from 'react';
import { Button as MantineButton } from '@mantine/core';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { type AppIcon, Icon } from '@/features/ui/icon/icon.tsx';
import styles from './button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    isDisabled?: boolean;
    isLoading?: boolean;
    justify?: 'start' | 'center' | 'end' | 'between';
    leftIcon?: keyof typeof AppIcon;
    leftIconProps?: Partial<React.ComponentProps<typeof Icon>>;
    radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    rightIcon?: keyof typeof AppIcon;
    rightIconProps?: Partial<React.ComponentProps<typeof Icon>>;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    uppercase?: boolean;
    variant?: 'filled' | 'default' | 'danger' | 'primary' | 'subtle';
}

export const Button = forwardRef((props: ButtonProps, ref: Ref<HTMLButtonElement>) => {
    const {
        justify,
        children,
        isLoading,
        isDisabled,
        leftIcon,
        leftIconProps,
        rightIcon,
        rightIconProps,
        size,
        uppercase,
        variant,
        ...htmlProps
    } = props;

    const rootClassNames = clsx({
        [styles.root]: true,
        [styles.filledVariant]: variant === 'filled',
        [styles.defaultVariant]: variant === undefined || variant === 'default',
        [styles.dangerVariant]: variant === 'danger',
        [styles.primaryVariant]: variant === 'primary',
        [styles.subtleVariant]: variant === 'subtle',
        [styles[`size-${size || 'md'}`]]: true,
        [styles[`radius-${size || 'md'}`]]: true,
        [styles.uppercase]: uppercase,
    });

    const innerClassNames = clsx({
        [styles.inner]: true,
        [styles[`justify-${justify || 'center'}`]]: true,
        [styles.justifyBetweenIcons]: justify === 'between' && leftIcon && rightIcon,
    });

    const buttonClassNames = {
        inner: innerClassNames,
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
            leftSection={leftIcon && <Icon icon={leftIcon} {...leftIconProps} />}
            loading={isLoading}
            rightSection={rightIcon && <Icon icon={rightIcon} {...rightIconProps} />}
            {...htmlProps}
        >
            {children}
        </MantineButton>
    );
});

Button.displayName = 'Button';

export const MotionButton = motion.create(Button);
