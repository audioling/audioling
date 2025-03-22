import type { ServerItemType } from '@repo/shared-types/app-types';
import type { CSSProperties, ReactNode, RefObject, SyntheticEvent } from 'react';
import type {
    GridIndexLocation,
    GridScrollSeekPlaceholderProps,
    GridStateSnapshot,
    VirtuosoGridHandle,
} from 'react-virtuoso';
import clsx from 'clsx';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import styles from './item-list-grid.module.css';
import { ItemCard, type ItemCardProps } from '/@/features/shared/components/item-card/item-card';
import { useItemListInternalState } from '/@/features/shared/components/item-list/utils/helpers';

const BaseListComponent = forwardRef<
    HTMLDivElement,
    { children?: ReactNode; className?: string; style?: CSSProperties }
>((props, ref) => {
    const { children, className, style } = props;

    return (
        <div
            ref={ref}
            className={clsx(styles.gridListComponent, className)}
            style={style}
        >
            {children}
        </div>
    );
});

BaseListComponent.displayName = 'BaseListComponent';

const BaseItemComponent = forwardRef<
    HTMLDivElement,
    {
        'children'?: ReactNode;
        'className'?: string;
        'context'?: unknown;
        'data-index': number;
        'enableExpanded'?: boolean;
        'style'?: CSSProperties;
        'virtuosoRef'?: RefObject<VirtuosoGridHandle>;
    }
>((props, ref) => {
    const { children, 'data-index': index } = props;

    return (
        <>
            <div ref={ref} className={clsx(styles.gridItemComponent)} data-index={index}>
                {children}
            </div>

        </>
    );
});

BaseItemComponent.displayName = 'BaseItemComponent';

function ScrollSeekPlaceholderComponent(props: GridScrollSeekPlaceholderProps & { context: unknown }) {
    const { context, index } = props;
    const { displayType, lines, reducers } = context as any;

    const type = displayType === 'default' ? 'default-skeleton' : displayType;

    return (
        <div className={styles.scrollSeekPlaceholder}>
            <ItemCard
                data={undefined}
                id={undefined}
                index={index}
                lines={lines}
                reducers={reducers}
                type={type as any}
            />
        </div>
    );
}

export interface GridItemProps<
    T,
    C,
> {
    context: C;
    data: T | undefined;
    index: number;
    isExpanded?: boolean;
    itemType: ServerItemType;
}

export type ItemGridComponent = Parameters<typeof VirtuosoGrid>['0']['itemContent'];

interface ItemGridProps<
    T,
    C,
> {
    context?: C;
    data: (T | undefined)[];
    displayType: ItemCardProps<T>['type'];
    getItemId?: (index: number) => string;
    initialScrollIndex?: number;
    isScrolling?: (isScrolling: boolean) => void;
    ItemComponent: ItemGridComponent;
    itemCount: number;
    itemSelectionType?: 'single' | 'multiple';
    itemType: ServerItemType;
    onEndReached?: (index: number) => void;
    onRangeChanged?: (args: { endIndex: number; startIndex: number }) => void;
    onScroll?: (event: SyntheticEvent) => void;
    onStartReached?: (index: number) => void;
    onStateChanged?: (state: GridStateSnapshot) => void;
    virtuosoRef?: RefObject<VirtuosoGridHandle | undefined>;
}

export function ItemListGrid<
    T,
    C,
>({
    context,
    data,
    displayType,
    initialScrollIndex,
    isScrolling,
    ItemComponent,
    itemCount = 0,
    itemSelectionType,
    itemType,
    onEndReached,
    onRangeChanged,
    onScroll,
    onStartReached,
    onStateChanged,
    virtuosoRef,
}: ItemGridProps<T, C>) {
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
                elements: { viewport: scroller },
                target: root,
            });
        }

        return () => osInstance()?.destroy();
    }, [scroller, initialize, osInstance]);

    const ref = useRef<VirtuosoGridHandle | null>(null);

    const {
        _onMultiSelectionClick,
        _onSingleSelectionClick,
        itemSelection,
        reducers,
    } = useItemListInternalState({ data });

    useImperativeHandle(virtuosoRef, () => ({
        scrollBy: (location: ScrollToOptions) => {
            ref?.current?.scrollBy(location);
        },
        scrollTo: (location: ScrollToOptions) => {
            ref?.current?.scrollTo(location);
        },
        scrollToIndex: (location: GridIndexLocation) => {
            ref?.current?.scrollToIndex(location);
        },
        selectAll: () => {
            const selection: Record<string, boolean> = {};

            for (const item of data) {
                const id = item as string;

                if (id) {
                    selection[id] = true;
                }
            }

            reducers.setSelection(selection);
        },
        selectNone: () => {
            reducers.clearSelection();
        },
    }));

    const gridContext = useMemo(() => ({
        ...context,
        displayType,
        itemSelection,
        itemSelectionType,
        itemType,
        onItemSelection: itemSelectionType === 'multiple'
            ? _onMultiSelectionClick
            : itemSelectionType === 'single' ? _onSingleSelectionClick : undefined,
        reducers,
    }), [
        context,
        displayType,
        itemSelection,
        itemSelectionType,
        itemType,
        _onMultiSelectionClick,
        _onSingleSelectionClick,
        reducers,
    ]);

    return (
        <div
            ref={rootRef}
            className={styles.itemGridContainer}
            data-overlayscrollbars-initialize=""
        >
            <VirtuosoGrid
                ref={ref}
                components={{
                    Item: BaseItemComponent,
                    List: BaseListComponent,
                    ScrollSeekPlaceholder: ScrollSeekPlaceholderComponent,
                }}
                context={gridContext}
                data={data}
                endReached={onEndReached}
                increaseViewportBy={300}
                initialTopMostItemIndex={initialScrollIndex || 0}
                isScrolling={isScrolling}
                itemContent={ItemComponent}
                overscan={0}
                rangeChanged={onRangeChanged}
                scrollSeekConfiguration={{
                    enter: velocity => Math.abs(velocity) > 2000,
                    exit: (velocity) => {
                        const shouldExit = Math.abs(velocity) < 100;
                        return shouldExit;
                    },
                }}
                scrollerRef={setScroller}
                startReached={onStartReached}
                stateChanged={onStateChanged}
                style={{ overflow: 'hidden' }}
                totalCount={itemCount}
                onScroll={onScroll}
            />
        </div>
    );
}
