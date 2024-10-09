import { forwardRef } from 'react';
import { Stack as MantineStack } from '@mantine/core';
import { motion } from 'framer-motion';

interface StackProps extends React.ComponentPropsWithoutRef<'div'> {
    align?: 'start' | 'center' | 'end' | 'between' | 'stretch';
    as?: React.ElementType;
    children: React.ReactNode;
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
    h?: string;
    justify?: 'start' | 'center' | 'end' | 'between';
    mah?: string;
    maw?: string;
    mih?: string;
    miw?: string;
    w?: string;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>((props: StackProps, ref) => {
    const { align, as, children, gap, justify, w, maw, h, mah, mih, miw, ...htmlProps } = props;

    return (
        <MantineStack
            ref={ref}
            align={getAlign(align)}
            component={as}
            gap={gap}
            h={h}
            justify={getJustify(justify)}
            mah={mah}
            maw={maw}
            mih={mih}
            miw={miw}
            w={w}
            {...htmlProps}
        >
            {children}
        </MantineStack>
    );
});

Stack.displayName = 'Stack';

export const MotionStack = motion.create(Stack);

function getJustify(justify: StackProps['justify']) {
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

function getAlign(align: StackProps['align']) {
    switch (align) {
        case 'start':
            return 'flex-start';
        case 'center':
            return 'center';
        case 'end':
            return 'flex-end';
        case 'between':
            return 'space-between';
        case 'stretch':
            return 'stretch';
    }

    return undefined;
}
