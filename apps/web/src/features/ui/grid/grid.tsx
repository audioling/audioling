import { Grid as MantineGrid } from '@mantine/core';
import clsx from 'clsx';
import type { GapSize } from '@/features/ui/shared/types.ts';
import styles from './grid.module.scss';

interface GridProps extends React.ComponentPropsWithoutRef<'div'> {
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    children: React.ReactNode;
    columns?: number;
    grow?: boolean;
    gutter?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    h?: string;
    justify?: 'start' | 'end' | 'center' | 'between' | 'around';
    m?: GapSize;
    mah?: string;
    maw?: string;
    mih?: string;
    miw?: string;
    mx?: GapSize;
    my?: GapSize;
    p?: GapSize;
    px?: GapSize;
    py?: GapSize;
    w?: string;
}

export const Grid = (props: GridProps) => {
    const {
        align,
        children,
        columns,
        gutter,
        grow,
        justify,
        m,
        mx,
        my,
        p,
        px,
        py,
        mah,
        maw,
        mih,
        miw,
        w,
        h,
        ...htmlProps
    } = props;

    const rootClassNames = clsx({
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
                root: rootClassNames,
            }}
            columns={columns}
            grow={grow}
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
