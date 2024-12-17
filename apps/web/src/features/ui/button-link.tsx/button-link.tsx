import type { LinkProps } from 'react-router';
import { Link } from 'react-router';
import type { ButtonProps } from '@/features/ui/button/button.tsx';
import { Button } from '@/features/ui/button/button.tsx';

interface ButtonLinkProps extends LinkProps {
    children?: React.ReactNode;
    isDisabled?: ButtonProps['isDisabled'];
    isLoading?: ButtonProps['isLoading'];
    justify?: ButtonProps['justify'];
    leftIcon?: ButtonProps['leftIcon'];
    leftIconProps?: ButtonProps['leftIconProps'];
    radius?: ButtonProps['radius'];
    rightIcon?: ButtonProps['rightIcon'];
    rightIconProps?: ButtonProps['rightIconProps'];
    size?: ButtonProps['size'];
    uppercase?: ButtonProps['uppercase'];
    variant?: ButtonProps['variant'];
}

export const ButtonLink = (props: ButtonLinkProps) => {
    const {
        children,
        isDisabled,
        isLoading,
        justify,
        leftIcon,
        leftIconProps,
        radius,
        rightIcon,
        rightIconProps,
        size,
        uppercase,
        variant,
        ...linkProps
    } = props;

    return (
        <Link {...linkProps}>
            <Button
                isDisabled={isDisabled}
                isLoading={isLoading}
                justify={justify}
                leftIcon={leftIcon}
                leftIconProps={leftIconProps}
                radius={radius}
                rightIcon={rightIcon}
                rightIconProps={rightIconProps}
                size={size}
                uppercase={uppercase}
                variant={variant}
            >
                {children}
            </Button>
        </Link>
    );
};
