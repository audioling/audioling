import { Box as MantineBox } from '@mantine/core';
import { clsx } from 'clsx';
import type { Sizes } from '@/themes/index.ts';
import styles from './text.module.scss';

interface TextProps extends React.ComponentPropsWithoutRef<'div'> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    as?: React.ElementType | any;
    isSecondary?: boolean;
    size?: Sizes;
    weight?: Sizes;
}

export const Text = (props: TextProps) => {
    const { as, children, isSecondary, size, weight, ...htmlProps } = props;

    const classNames = clsx({
        [styles[`size-${size || 'md'}`]]: true,
        [styles[`weight-${weight || 'md'}`]]: true,
        [styles.secondary]: isSecondary,
    });

    return (
        <MantineBox className={classNames} component={as} {...htmlProps}>
            {children}
        </MantineBox>
    );
};
