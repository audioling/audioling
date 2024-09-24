import { Grid as MantineGrid } from '@mantine/core';
import { motion } from 'framer-motion';

interface GridProps extends React.ComponentPropsWithoutRef<'div'> {
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    children: React.ReactNode;
    columns?: number;
    grow?: boolean;
    justify?: 'start' | 'end' | 'center' | 'between' | 'around';
}

export const Grid = (props: GridProps) => {
    const { align, children, columns, grow, justify, ...htmlProps } = props;
    return (
        <MantineGrid
            align={getAlign(align)}
            columns={columns}
            grow={grow}
            justify={getJustify(justify)}
            {...htmlProps}
        >
            {children}
        </MantineGrid>
    );
};

interface GridColProps extends React.ComponentPropsWithoutRef<'div'> {
    children: React.ReactNode;
    offset?: number;
    order?: number;
    span?: number;
}

export const GridCol = (props: GridColProps) => {
    const { children, offset, order, span, ...htmlProps } = props;
    return (
        <MantineGrid.Col
            offset={offset}
            order={order}
            span={span}
            {...htmlProps}
        >
            {children}
        </MantineGrid.Col>
    );
};

export const MotionGrid = motion(Grid);

Grid.displayName = 'Grid';

Grid.Col = MantineGrid.Col;

function getJustify(justify: GridProps['justify']) {
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

function getAlign(align: GridProps['align']) {
    switch (align) {
        case 'start':
            return 'flex-start';
        case 'center':
            return 'center';
        case 'end':
            return 'flex-end';
        case 'stretch':
            return 'stretch';
    }

    return undefined;
}
