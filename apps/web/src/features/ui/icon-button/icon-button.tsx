import type { Ref } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';
import type { AppIcon } from '@/features/ui/icon/icon.tsx';
import { Icon } from '@/features/ui/icon/icon.tsx';
import type { TooltipProps } from '@/features/ui/tooltip/tooltip.tsx';
import { Tooltip } from '@/features/ui/tooltip/tooltip.tsx';
import styles from './icon-button.module.scss';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    icon: keyof typeof AppIcon;
    iconFill?: boolean;
    iconProps?: Omit<React.ComponentProps<typeof Icon>, 'icon'>;
    isCompact?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'filled' | 'default' | 'danger' | 'primary' | 'subtle' | 'transparent' | 'outline';
}

export const IconButton = forwardRef((props: IconButtonProps, ref: Ref<HTMLButtonElement>) => {
    const {
        className,
        isCompact,
        isDisabled,
        isLoading,
        size,
        variant,
        iconProps,
        radius,
        iconFill,
        ...htmlProps
    } = props;

    const rootClassNames = clsx({
        [styles.root]: true,
        [styles.iconFill]: iconFill,
        [styles.filledVariant]: variant === 'filled',
        [styles.defaultVariant]: variant === undefined || variant === 'default',
        [styles.dangerVariant]: variant === 'danger',
        [styles.primaryVariant]: variant === 'primary',
        [styles.subtleVariant]: variant === 'subtle',
        [styles.transparentVariant]: variant === 'transparent',
        [styles.outlineVariant]: variant === 'outline',
        [styles[`size-${size || 'md'}`]]: true,
        [styles[`radius-${radius || 'md'}`]]: true,
        [styles.compact]: isCompact,
        [styles.loading]: isLoading,
    });

    return (
        <button
            ref={ref}
            className={clsx(rootClassNames, className)}
            disabled={isDisabled}
            {...htmlProps}
        >
            <Icon
                fill={iconFill}
                icon={isLoading ? 'spinner' : props.icon}
                size={size}
                {...iconProps}
            />
        </button>
    );
});

IconButton.displayName = 'IconButton';

export const IconButtonWithTooltip = forwardRef(
    (
        props: IconButtonProps & { tooltipProps: Omit<TooltipProps, 'children'> },
        ref: Ref<HTMLButtonElement>,
    ) => {
        const { tooltipProps, ...iconButtonProps } = props;

        return (
            <Tooltip {...tooltipProps}>
                <IconButton ref={ref} {...iconButtonProps} />
            </Tooltip>
        );
    },
);

IconButtonWithTooltip.displayName = 'IconButtonWithTooltip';
