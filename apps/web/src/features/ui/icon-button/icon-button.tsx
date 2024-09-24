import type { Ref } from 'react';
import { forwardRef } from 'react';
import type { ActionIconProps as MantineActionIconProps } from '@mantine/core';
import { ActionIcon as MantineActionIcon } from '@mantine/core';
import { clsx } from 'clsx';
import styles from './icon-button.module.scss';
import { type AppIcon, Icon } from '../../features/ui/icon/icon';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    icon: keyof typeof AppIcon;
    iconProps?: React.ComponentProps<typeof Icon>;
    iconSize?: number;
    isDisabled?: boolean;
    isLoading?: boolean;
    radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'filled' | 'default' | 'danger';
}

export const IconButton = forwardRef((props: IconButtonProps, ref: Ref<HTMLButtonElement>) => {
    const { isLoading, isDisabled, size, variant, iconProps, ...htmlProps } = props;

    const rootClassNames = clsx({
        [styles.root]: true,
        [styles.filledVariant]: variant === 'filled',
        [styles.defaultVariant]: variant === undefined || variant === 'default',
        [styles.dangerVariant]: variant === 'danger',
        [styles[`size-${size || 'md'}`]]: true,
        [styles[`radius-${size || 'md'}`]]: true,
    });

    const buttonClassNames: MantineActionIconProps['classNames'] = {
        loader: styles.loader,
        root: rootClassNames,
    };

    return (
        <MantineActionIcon
            ref={ref}
            unstyled
            classNames={buttonClassNames}
            disabled={isDisabled}
            loading={isLoading}
            {...htmlProps}
        >
            <Icon
                icon={props.icon}
                {...iconProps}
            />
        </MantineActionIcon>
    );
});

IconButton.displayName = 'IconButton';
