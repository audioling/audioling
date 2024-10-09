import { forwardRef } from 'react';
import { Group as MantineGroup } from '@mantine/core';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import styles from './group.module.scss';

interface GroupProps extends React.ComponentPropsWithoutRef<'div'> {
    align?: 'start' | 'center' | 'end' | 'between';
    as?: React.ElementType;
    children: React.ReactNode;
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
    grow?: boolean;
    h?: string;
    justify?: 'start' | 'center' | 'end' | 'between';
    mah?: string;
    maw?: string;
    mih?: string;
    miw?: string;
    preventOverflow?: boolean;
    w?: string;
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
        mah,
        maw,
        mih,
        miw,
        w,
        ...htmlProps
    } = props;

    const rootClassNames = clsx({
        [styles.gapXs]: gap === 'xs',
        [styles.gapSm]: gap === 'sm',
        [styles.gapMd]: gap === 'md',
        [styles.gapLg]: gap === 'lg',
        [styles.gapXl]: gap === 'xl',
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
