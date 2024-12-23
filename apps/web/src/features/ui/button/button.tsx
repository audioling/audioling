import type { Ref } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { type AppIcon, Icon } from '@/features/ui/icon/icon.tsx';
import styles from './button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    isCompact?: boolean;
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
    variant?:
        | 'filled'
        | 'default'
        | 'danger'
        | 'primary'
        | 'subtle'
        | 'transparent'
        | 'outline'
        | 'input';
}

export const Button = forwardRef((props: ButtonProps, ref: Ref<HTMLButtonElement>) => {
    const {
        justify = 'center',
        children,
        isLoading,
        isDisabled,
        isCompact,
        leftIcon,
        leftIconProps,
        rightIcon,
        rightIconProps,
        size = 'md',
        uppercase,
        variant = 'default',
        radius = 'md',
        className,
        ...htmlProps
    } = props;

    const rootClassNames = clsx({
        [styles.root]: true,
        [styles.filledVariant]: variant === 'filled',
        [styles.defaultVariant]: variant === 'default',
        [styles.dangerVariant]: variant === 'danger',
        [styles.primaryVariant]: variant === 'primary',
        [styles.subtleVariant]: variant === 'subtle',
        [styles.transparentVariant]: variant === 'transparent',
        [styles.outlineVariant]: variant === 'outline',
        [styles.inputVariant]: variant === 'input',
        [styles[`size-${size}`]]: true,
        [styles[`radius-${radius}`]]: true,
        [styles.uppercase]: uppercase,
        [styles.loading]: isLoading,
        [styles.compact]: isCompact,
    });

    const innerClassNames = clsx({
        [styles.inner]: true,
        [styles[`justify-${justify}`]]: justify,
    });

    const labelClassNames = clsx({
        [styles.innerLabel]: true,
        [styles.loading]: isLoading,
        [styles.leftSection]: leftIcon,
        [styles.rightSection]: rightIcon,
    });

    const sectionClassNames = clsx({
        [styles.section]: true,
        [styles.loading]: isLoading,
    });

    return (
        <button
            ref={ref}
            className={clsx(rootClassNames, className)}
            disabled={isDisabled || isLoading}
            {...htmlProps}
        >
            <div className={innerClassNames}>
                {leftIcon && (
                    <Icon
                        className={sectionClassNames}
                        data-position="left"
                        icon={leftIcon}
                        {...leftIconProps}
                    />
                )}
                <span className={labelClassNames}>{children}</span>
                {isLoading && (
                    <span className={styles.spinner}>
                        <Icon icon="spinner" />
                    </span>
                )}
                {rightIcon && (
                    <Icon
                        className={sectionClassNames}
                        data-position="right"
                        icon={rightIcon}
                        {...rightIconProps}
                    />
                )}
            </div>
        </button>
    );
});

Button.displayName = 'Button';

export const MotionButton = motion.create(Button);
