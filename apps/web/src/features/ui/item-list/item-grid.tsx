import type { CSSProperties, ReactNode, SyntheticEvent } from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { VirtuosoGrid } from 'react-virtuoso';
import styles from './item-grid.module.scss';

const GridListComponent = forwardRef<
    HTMLDivElement,
    { children?: ReactNode; className?: string; style?: CSSProperties }
>((props, ref) => {
    const { style, children, className, ...rest } = props;

    return (
        <div
            ref={ref}
            className={clsx(styles.gridListComponent, className)}
            style={{ ...style }}
            {...rest}
        >
            {children}
        </div>
    );
});

GridListComponent.displayName = 'GridListComponent';

const GridItemComponent = forwardRef<
    HTMLDivElement,
    {
        children?: ReactNode;
        className?: string;
        context?: Record<string, unknown>;
        style?: CSSProperties;
    }
>((props, ref) => {
    const { children } = props;

    return (
        <div ref={ref} className={clsx(styles.gridItemComponent)}>
            {children}
        </div>
    );
});

GridItemComponent.displayName = 'GridItemComponent';

export interface InfiniteGridItemProps<T, C extends Record<string, unknown>> {
    context?: C;
    data: T | undefined;
    index: number;
}

interface InfiniteItemGridProps<T, C extends Record<string, unknown>> {
    GridComponent: React.ComponentType<InfiniteGridItemProps<T, C>>;
    context?: C;
    data: (T | undefined)[];
    isScrolling?: (isScrolling: boolean) => void;
    itemCount: number;
    onEndReached?: (index: number) => void;
    onRangeChanged?: (args: { endIndex: number; startIndex: number }) => void;
    onScroll?: (event: SyntheticEvent) => void;
    onStartReached?: (index: number) => void;
    overscan?: number;
}

export function InfiniteItemGrid<T, C extends Record<string, unknown>>(
    props: InfiniteItemGridProps<T, C>,
) {
    const {
        context,
        data,
        GridComponent,
        itemCount = 0,
        isScrolling,
        onEndReached,
        onRangeChanged,
        onScroll,
        overscan = 10,
        onStartReached,
    } = props;
    const rootRef = useRef(null);

    const [scroller, setScroller] = useState<HTMLElement | null>(null);
    const [initialize, osInstance] = useOverlayScrollbars({
        defer: true,
        options: {
            overflow: { x: 'hidden', y: 'scroll' },
            paddingAbsolute: true,
            scrollbars: {
                autoHide: 'leave',
                autoHideDelay: 500,
                pointers: ['mouse', 'pen', 'touch'],
                theme: 'al-os-scrollbar',
                visibility: 'visible',
            },
        },
    });

    useEffect(() => {
        const { current: root } = rootRef;

        if (scroller && root) {
            initialize({
                elements: {
                    viewport: scroller,
                },
                target: root,
            });
        }

        return () => osInstance()?.destroy();
    }, [scroller, initialize, osInstance]);

    return (
        <div
            ref={rootRef}
            className={styles.itemGridContainer}
            data-overlayscrollbars-initialize=""
        >
            <VirtuosoGrid
                components={{
                    Item: GridItemComponent,
                    List: GridListComponent,
                }}
                data={data}
                endReached={onEndReached}
                increaseViewportBy={300}
                isScrolling={isScrolling}
                itemContent={(index, data) => (
                    <GridComponent context={context} data={data} index={index} />
                )}
                overscan={overscan}
                rangeChanged={onRangeChanged}
                scrollerRef={setScroller}
                startReached={onStartReached}
                totalCount={itemCount}
                onScroll={onScroll}
            />
        </div>
    );
}
