import { forwardRef } from 'react';
import { Center as MantineCenter } from '@mantine/core';

interface CenterProps extends React.ComponentPropsWithoutRef<'div'> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    as?: React.ElementType | any;
    children: React.ReactNode;
    inline?: boolean;
}

export const Center = forwardRef<HTMLDivElement, CenterProps>((props: CenterProps, ref) => {
    const { as, children, inline, ...htmlProps } = props;

    return (
        <MantineCenter
            ref={ref}
            component={as}
            inline={inline}
            {...htmlProps}
        >
            {children}
        </MantineCenter>
    );
});

Center.displayName = 'Center';
