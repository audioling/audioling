import type { HTMLInputAutoCompleteAttribute, ReactNode, Ref } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';
import type { AppIcon, IconProps } from '@/features/ui/icon/icon.tsx';
import { Icon } from '@/features/ui/icon/icon.tsx';
import type { Sizes } from '@/themes/index.ts';
import styles from './text-input.module.scss';

export interface TextInputProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
    autoComplete?: HTMLInputAutoCompleteAttribute;
    description?: string;
    label?: string;
    leftIcon?: keyof typeof AppIcon;
    leftIconProps?: Omit<IconProps, 'icon'>;
    placeholder?: string;
    radius?: Sizes;
    rightIcon?: keyof typeof AppIcon;
    rightIconProps?: Omit<IconProps, 'icon'>;
    rightSection?: ReactNode;
    size?: Sizes;
    spellCheck?: boolean;
}

export const TextInput = forwardRef((props: TextInputProps, ref: Ref<HTMLInputElement>) => {
    const {
        autoComplete = 'off',
        description,
        label,
        leftIcon,
        leftIconProps,
        placeholder,
        radius = 'md',
        rightIcon,
        rightIconProps,
        rightSection,
        size = 'md',
        spellCheck = false,
        ...htmlProps
    } = props;

    const rootClassNames = clsx({
        [styles.root]: true,
        [styles[`size-${size}`]]: true,
    });

    const inputClassNames = clsx({
        [styles.input]: true,
        [styles[`size-${size}`]]: true,
        [styles[`radius-${radius}`]]: true,
        [styles.leftSection]: !!leftIcon,
        [styles.rightSection]: !!rightIcon,
    });

    return (
        <div ref={ref} className={rootClassNames}>
            {label && <label className={styles.label}>{label}</label>}
            {description && <p className={styles.description}>{description}</p>}
            <div className={styles.inputWrapper}>
                <input
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    spellCheck={spellCheck}
                    type="text"
                    {...htmlProps}
                    className={clsx(inputClassNames, htmlProps.className)}
                />
                {leftIcon && (
                    <Icon
                        className={clsx(styles.section, styles.leftIcon)}
                        icon={leftIcon}
                        {...leftIconProps}
                    />
                )}
                {rightIcon && (
                    <Icon
                        className={clsx(styles.section, styles.rightIcon)}
                        icon={rightIcon}
                        {...rightIconProps}
                    />
                )}
                {rightSection && (
                    <div className={clsx(styles.section, styles.rightIcon)}>{rightSection}</div>
                )}
            </div>
        </div>
    );
});

TextInput.displayName = 'TextInput';
