import { Grid as MantineGrid } from '@mantine/core';
import clsx from 'clsx';
import styles from './grid.module.scss';

interface GridProps extends React.ComponentPropsWithoutRef<'div'> {
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    children: React.ReactNode;
    columns?: number;
    grow?: boolean;
    gutter?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    justify?: 'start' | 'end' | 'center' | 'between' | 'around';
}

export const Grid = (props: GridProps) => {
    const { align, children, columns, gutter, grow, justify, ...htmlProps } = props;

    const innerClassNames = clsx({
        [styles.innerXs]: gutter === 'xs',
        [styles.innerSm]: gutter === 'sm',
        [styles.innerMd]: gutter === 'md',
        [styles.innerLg]: gutter === 'lg',
        [styles.innerXl]: gutter === 'xl',
    });

    const colClassNames = clsx({
        [styles.colXs]: gutter === 'xs',
        [styles.colSm]: gutter === 'sm',
        [styles.colMd]: gutter === 'md',
        [styles.colLg]: gutter === 'lg',
        [styles.colXl]: gutter === 'xl',
    });

    return (
        <MantineGrid
            align={getAlign(align)}
            classNames={{
                col: colClassNames,
                inner: innerClassNames,
            }}
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
