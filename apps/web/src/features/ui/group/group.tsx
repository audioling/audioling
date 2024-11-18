import { forwardRef } from 'react';
import { Group as MantineGroup } from '@mantine/core';
import clsx from 'clsx';
import { motion, wrap } from 'motion/react';
import type { Sizes } from '@/themes/index.ts';
import styles from './group.module.scss';

interface GroupProps extends React.ComponentPropsWithoutRef<'div'> {
    align?: 'start' | 'center' | 'end' | 'between';
    as?: React.ElementType;
    children: React.ReactNode;
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
    grow?: boolean;
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
    preventOverflow?: boolean;
    px?: Sizes;
    py?: Sizes;
    w?: string;
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}

export const Group = forwardRef<HTMLDivElement, GroupProps>((props: GroupProps, ref) => {
    const {
        align,
        as,
        children,
        gap,
        grow,
        justify,
        preventOverflow,
        wrap,
        mah,
        maw,
        mih,
        miw,
        w,
        m,
        mx,
        my,
        p,
        px,
        py,
        ...htmlProps
    } = props;

    const rootClassNames = clsx({
        [styles.gapXs]: gap === 'xs',
        [styles.gapSm]: gap === 'sm',
        [styles.gapMd]: gap === 'md',
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
    });

    return (
        <MantineGroup
            ref={ref}
            align={getAlign(align)}
            classNames={{ root: rootClassNames }}
            component={as}
            grow={grow}
            justify={getJustify(justify)}
            mah={mah}
            maw={maw}
            mih={mih}
            miw={miw}
            preventGrowOverflow={preventOverflow}
            w={w}
            wrap={wrap}
            {...htmlProps}
        >
            {children}
        </MantineGroup>
    );
});

export const MotionGroup = motion.create(Group);

Group.displayName = 'Group';

function getJustify(justify: GroupProps['justify']) {
    switch (justify) {
        case 'start':
            return 'flex-start';
        case 'center':
            return 'center';
        case 'end':
            return 'flex-end';
        case 'between':
            return 'space-between';
    }

    return undefined;
}

function getAlign(align: GroupProps['align']) {
    switch (align) {
        case 'start':
            return 'flex-start';
        case 'center':
            return 'center';
        case 'end':
            return 'flex-end';
        case 'between':
            return 'space-between';
    }

    return undefined;
}
