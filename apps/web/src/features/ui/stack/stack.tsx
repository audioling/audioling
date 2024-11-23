import { forwardRef } from 'react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import type { Sizes } from '@/themes/index.ts';
import styles from './stack.module.scss';

interface StackProps extends React.ComponentPropsWithoutRef<'div'> {
    align?: 'start' | 'center' | 'end' | 'between' | 'stretch';
    as?: React.ElementType;
    children: React.ReactNode;
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
    h?: string;
    justify?: 'start' | 'center' | 'end' | 'between';
    m?: Sizes;
    mah?: string;
    maw?: string;
    mih?: string;
    miw?: string;
    mx?: Sizes;
    my?: Sizes;
    p?: Sizes;
    px?: Sizes;
    py?: Sizes;
    w?: string;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>((props: StackProps, ref) => {
    const {
        align,
        children,
        gap,
        h,
        justify,
        m,
        mah,
        maw,
        mih,
        miw,
        mx,
        my,
        p,
        px,
        py,
        w,
        ...htmlProps
    } = props;

    const classNames = clsx({
        [styles.stack]: true,
        [styles.gapXs]: gap === 'xs',
        [styles.gapSm]: gap === 'sm',
        [styles.gapMd]: gap === 'md' || !gap,
        [styles.gapLg]: gap === 'lg',
        [styles.gapXl]: gap === 'xl',
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
        [styles.alignStart]: align === 'start',
        [styles.alignCenter]: align === 'center',
        [styles.alignEnd]: align === 'end',
        [styles.alignBetween]: align === 'between',
        [styles.alignStretch]: align === 'stretch',
        [styles.justifyStart]: justify === 'start',
        [styles.justifyCenter]: justify === 'center',
        [styles.justifyEnd]: justify === 'end',
        [styles.justifyBetween]: justify === 'between',
    });

    return (
        <div
            ref={ref}
            className={classNames}
            style={{
                height: h,
                maxHeight: mah,
                maxWidth: maw,
                minHeight: mih,
                minWidth: miw,
                width: w,
            }}
            {...htmlProps}
        >
            {children}
        </div>
    );
});

Stack.displayName = 'Stack';

export const MotionStack = motion.create(Stack);
