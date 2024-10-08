import { forwardRef } from 'react';
import { Center as MantineCenter } from '@mantine/core';
import styles from './center.module.scss';

interface CenterProps extends React.ComponentPropsWithoutRef<'div'> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    as?: React.ElementType | any;
    children: React.ReactNode;
    h?: string;
    inline?: boolean;
    mah?: string;
    maw?: string;
    w?: string;
}

export const Center = forwardRef<HTMLDivElement, CenterProps>((props: CenterProps, ref) => {
    const { as, children, inline, h, mah, maw, w, ...htmlProps } = props;

    return (
        <MantineCenter
            ref={ref}
            component={as}
            h={h}
            inline={inline}
            mah={mah}
            maw={maw}
            w={w}
            {...htmlProps}
            className={styles.center}
        >
            {children}
        </MantineCenter>
    );
});

Center.displayName = 'Center';
