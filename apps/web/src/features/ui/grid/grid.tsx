import { Grid as MantineGrid } from '@mantine/core';
import clsx from 'clsx';
import styles from './grid.module.scss';

interface GridProps extends React.ComponentPropsWithoutRef<'div'> {
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    children: React.ReactNode;
    columns?: number;
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    grow?: boolean;
    justify?: 'start' | 'end' | 'center' | 'between' | 'around';
}

export const Grid = (props: GridProps) => {
    const { align, children, columns, gap, grow, justify, ...htmlProps } = props;
    return (
        <MantineGrid
            align={getAlign(align)}
            columns={columns}
            grow={grow}
            gutter={gap}
            justify={getJustify(justify)}
            {...htmlProps}
        >
            {children}
        </MantineGrid>
    );
};

interface GridColProps extends React.ComponentPropsWithoutRef<'div'> {
    children: React.ReactNode;
    grow?: boolean;
    offset?: number;
    order?: number;
    span?: number;
}

export const GridCol = (props: GridColProps) => {
    const { children, offset, order, span, grow, ...htmlProps } = props;

    const classNames = {
        col: clsx(styles.col, {
            [styles.grow]: grow,
        }),
    };

    return (
        <MantineGrid.Col
            classNames={classNames}
            offset={offset}
            order={order}
            span={span}
            {...htmlProps}
        >
            {children}
        </MantineGrid.Col>
    );
};

Grid.displayName = 'Grid';

Grid.Col = GridCol;

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
