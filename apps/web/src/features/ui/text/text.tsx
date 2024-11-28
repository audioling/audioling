import { Box as MantineBox } from '@mantine/core';
import { clsx } from 'clsx';
import type { NavLinkProps } from 'react-router-dom';
import type { Sizes } from '@/themes/index.ts';
import styles from './text.module.scss';

interface TextProps extends React.ComponentPropsWithoutRef<'div'> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    as?: React.ElementType | any;
    isEllipsis?: boolean;
    isSecondary?: boolean;
    size?: Sizes;
    to?: NavLinkProps['to'];
    weight?: Sizes;
}

export const Text = (props: TextProps) => {
    const { as, children, isEllipsis, isSecondary, size, weight, className, ...htmlProps } = props;

    const classNames = clsx({
        [styles[`size-${size || 'md'}`]]: true,
        [styles[`weight-${weight || 'md'}`]]: true,
        [styles.secondary]: isSecondary,
        [styles.ellipsis]: isEllipsis,
    });

    return (
        <MantineBox className={clsx(classNames, className)} component={as} {...htmlProps}>
            {children}
        </MantineBox>
    );
};
