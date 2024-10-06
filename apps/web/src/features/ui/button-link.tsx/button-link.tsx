import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';
import type { ButtonProps } from '@/features/ui/button/button.tsx';
import { Button } from '@/features/ui/button/button.tsx';

interface ButtonLinkProps extends LinkProps {
    buttonProps?: ButtonProps;
}

export const ButtonLink = (props: ButtonLinkProps) => {
    const { buttonProps, children, ...linkProps } = props;

    return (
        <Link {...linkProps}>
            <Button {...buttonProps}>{children}</Button>
        </Link>
    );
};
