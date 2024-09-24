import { forwardRef } from 'react';
import { Group as MantineGroup } from '@mantine/core';
import { motion } from 'framer-motion';

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
    preventOverflow?: boolean;
    w?: string;
}

export const Group = forwardRef<HTMLDivElement, GroupProps>((props: GroupProps, ref) => {
    const { align, as, children, gap, grow, justify, preventOverflow, ...htmlProps } = props;

    return (
        <MantineGroup
            ref={ref}
            align={getAlign(align)}
            component={as}
            gap={gap}
            grow={grow}
            justify={getJustify(justify)}
            preventGrowOverflow={preventOverflow}
            {...htmlProps}
        >
            {children}
        </MantineGroup>
    );
});

export const MotionGroup = motion(Group);

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
