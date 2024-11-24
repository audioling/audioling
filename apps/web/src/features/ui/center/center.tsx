import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import clsx from 'clsx';
import type { Sizes } from '@/themes/index.ts';
import styles from './center.module.scss';

interface CenterProps extends React.ComponentPropsWithoutRef<'div'> {
    children: ReactNode;
    className?: string;
    h?: Sizes;
    m?: Sizes;
    mx?: Sizes;
    my?: Sizes;
    p?: Sizes;
    px?: Sizes;
    py?: Sizes;
    w?: Sizes;
}

export const Center = forwardRef<HTMLDivElement, CenterProps>((props: CenterProps, ref) => {
    const { children, className, h, m, mx, my, p, px, py, w, style, ...htmlProps } = props;

    const classNames = clsx({
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
        <div
            ref={ref}
            className={clsx(classNames, className)}
            style={{ height: h, width: w, ...style }}
            {...htmlProps}
        >
            {children}
        </div>
    );
});

Center.displayName = 'Center';
