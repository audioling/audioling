import { forwardRef } from 'react';
import { createPolymorphicComponent, Box as MantineBox } from '@mantine/core';
import type { PolymorphicComponentType } from '@/types.ts';

interface BoxProps extends React.ComponentPropsWithoutRef<'div'> {
    as?: PolymorphicComponentType;
    children: React.ReactNode;
}

export const _Box = forwardRef<HTMLDivElement, BoxProps>((props: BoxProps, ref) => {
    const { as, children, ...htmlProps } = props;

    return (
        <MantineBox
            ref={ref}
            component={as}
            {...htmlProps}
        >
            {children}
        </MantineBox>
    );
});

_Box.displayName = 'Box';

export const Box = createPolymorphicComponent<'div', BoxProps>(_Box);
