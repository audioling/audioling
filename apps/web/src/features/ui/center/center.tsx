import { forwardRef } from 'react';
import { Center as MantineCenter } from '@mantine/core';
import clsx from 'clsx';
import type { GapSize } from '@/features/ui/shared/types.ts';
import styles from './center.module.scss';

interface CenterProps extends React.ComponentPropsWithoutRef<'div'> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    as?: React.ElementType | any;
    children: React.ReactNode;
    h?: string;
    inline?: boolean;
    m?: GapSize;
    mah?: string;
    maw?: string;
    mih?: string;
    miw?: string;
    mx?: GapSize;
    my?: GapSize;
    p?: GapSize;
    px?: GapSize;
    py?: GapSize;
    w?: string;
}

export const Center = forwardRef<HTMLDivElement, CenterProps>((props: CenterProps, ref) => {
    const { as, children, inline, h, mah, maw, mih, miw, w, m, mx, my, p, px, py, ...htmlProps } =
        props;

    const rootClassNames = clsx({
        [styles.center]: true,
        [styles.marginXSm]: mx === 'sm' || m === 'sm',
        [styles.marginXMd]: mx === 'md' || m === 'md',
        [styles.marginXlg]: mx === 'lg' || m === 'lg',
        [styles.marginXxl]: mx === 'xl' || m === 'xl',
        [styles.marginYSm]: my === 'sm' || m === 'sm',
        [styles.marginYMd]: my === 'md' || m === 'md',
        [styles.marginYlg]: my === 'lg' || m === 'lg',
        [styles.marginYxl]: my === 'xl' || m === 'xl',
        [styles.paddingXSm]: px === 'sm' || p === 'sm',
        [styles.paddingXMd]: px === 'md' || p === 'md',
        [styles.paddingXlg]: px === 'lg' || p === 'lg',
        [styles.paddingXxl]: px === 'xl' || p === 'xl',
        [styles.paddingYSm]: py === 'sm' || p === 'sm',
        [styles.paddingYMd]: py === 'md' || p === 'md',
        [styles.paddingYlg]: py === 'lg' || p === 'lg',
        [styles.paddingYxl]: py === 'xl' || p === 'xl',
    });

    return (
        <MantineCenter
            ref={ref}
            classNames={{
                root: rootClassNames,
            }}
            component={as}
            h={h}
            inline={inline}
            mah={mah}
            maw={maw}
            mih={mih}
            miw={miw}
            w={w}
            {...htmlProps}
        >
            {children}
        </MantineCenter>
    );
});

Center.displayName = 'Center';
