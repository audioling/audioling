import type {
    ItemListColumn,
    ItemListColumnDefinitions,
    ItemListColumnOrder,
} from '/@/features/shared/components/item-list/utils/helpers';
import type { DragData } from '/@/utils/drag-drop';
import type { ServerItemType } from '@repo/shared-types/app-types';
import type {
    ElementType,
    MutableRefObject,
    RefObject,
    SyntheticEvent,

} from 'react';
import type {
    FlatIndexLocationWithAlign,
    FlatScrollIntoViewLocation,
    ItemProps,
    ListProps,
    StateCallback,
    VirtuosoHandle,
} from 'react-virtuoso';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import clsx from 'clsx';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import React, {
    forwardRef,
    useEffect,
    useId,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Virtuoso } from 'react-virtuoso';
import styles from './item-list-table.module.css';
import { ComponentErrorBoundary } from '/@/components/error-boundary/component-error-boundary';
import { itemListHelpers, useItemListInternalState } from '/@/features/shared/components/item-list/utils/helpers';
import { ItemTableHeader } from '/@/features/shared/components/item-table-header/item-table-header';
import { DragTarget } from '/@/utils/drag-drop';

const BaseListComponent = forwardRef<
    HTMLDivElement,
    ListProps & { context: Record<string, any> }
>((props, ref) => {
    const { children, context, style, ...rest } = props;

    return (
        <div
            ref={ref as unknown as RefObject<HTMLTableSectionElement>}
            className={styles.baseListComponent}
            style={{ ...style }}
            {...rest}
        >
            {children}
        </div>
    );
});

const BaseItemComponent = forwardRef<
    HTMLDivElement,
    ItemProps<any> & { context: Record<string, any> }
>((props, ref) => {
    const { children, context, style, ...rest } = props;

    return (
        <div
            ref={ref}
            className={styles.baseItemComponent}
            style={{ ...context.columnStyles }}
            {...rest}
        >
            {children}
        </div>
    );
});

// export interface TableContext {
//     columnOrder?: ItemListColumn[];
//     columnStyles?: { sizes: string[]; styles: { gridTemplateColumns: string } };
//     currentTrack?: PlayQueueItem;
//     libraryId: string;
//     listKey: string;
//     onChangeColumnOrder?: (columnOrder: ItemListColumn[]) => void;
//     startIndex?: number;
// }

export type ItemListTableComponent = Parameters<typeof Virtuoso>['0']['itemContent'];

export interface ItemListTableProps<T, C> {
    columnOrder: ItemListColumnOrder;
    columns: ItemListColumnDefinitions;
    context: C;
    data: (T | undefined)[];
    disableAutoScroll?: boolean;
    enableHeader?: boolean;
    enableStickyHeader?: boolean;
    getItemId?: (index: number) => string;
    HeaderComponent?: ElementType;
    initialScrollIndex?: number;
    isScrolling?: (isScrolling: boolean) => void;
    ItemComponent: ItemListTableComponent;
    itemCount: number;
    itemSelectionType?: 'single' | 'multiple';
    itemType: ServerItemType;
    onChangeColumnOrder?: (columnOrder: ItemListColumn[]) => void;
    onEndReached?: (index: number) => void;
    onRangeChanged?: (args: { endIndex: number; startIndex: number }) => void;
    onScroll?: (event: SyntheticEvent) => void;
    onStartReached?: (index: number) => void;
    virtuosoRef?: MutableRefObject<ItemListTableHandle | undefined>;
}

export interface ItemListTableHandle extends VirtuosoHandle {
    deselectAll: () => void;
    getSelection: () => {
        ids: string[];
        items: unknown[];
    };
    selectAll: () => void;
}

export function ItemListTable<TDataType, TItemType>(props: ItemListTableProps<TDataType, TItemType>) {
    const {
        columnOrder,
        columns,
        context,
        data,
        disableAutoScroll,
        enableHeader = true,
        enableStickyHeader,
        getItemId,
        HeaderComponent,
        initialScrollIndex,
        isScrolling,
        ItemComponent,
        itemCount,
        itemSelectionType,
        itemType,
        onChangeColumnOrder,
        onEndReached,
        onRangeChanged,
        onScroll,
        onStartReached,
        virtuosoRef,
    } = props;

    const tableId = useId();

    const ref = useRef<VirtuosoHandle | null>(null);

    const rowsRef = useRef(null);

    const [scroller, setScroller] = useState<HTMLElement | Window | null>(null);
    const [initialize, osInstance] = useOverlayScrollbars({
        defer: true,
        options: {
            overflow: { x: 'scroll', y: 'scroll' },
            paddingAbsolute: true,
            scrollbars: {
                autoHide: 'move',
                autoHideDelay: 500,
                pointers: ['mouse', 'pen', 'touch'],
                theme: 'al-os-scrollbar',
                visibility: 'visible',
            },
        },
    });

    useEffect(() => {
        const { current: root } = rowsRef;

        if (scroller && root) {
            initialize({
                elements: { viewport: scroller as HTMLElement },
                target: root,
            });

            if (!disableAutoScroll) {
                autoScrollForElements({
                    canScroll: (args) => {
                        const data = args.source.data as unknown as DragData<unknown>;
                        if (data.type === DragTarget.TABLE_COLUMN)
                            return false;
                        return true;
                    },
                    element: scroller as HTMLElement,
                    getAllowedAxis: () => 'vertical',
                    getConfiguration: () => ({ maxScrollSpeed: 'fast' }),
                });
            }
        }

        return () => osInstance()?.destroy();
    }, [scroller, initialize, osInstance, disableAutoScroll]);

    const {
        _onMultiSelectionClick,
        _onSingleSelectionClick,
        itemSelection,
        reducers,
    } = useItemListInternalState<TDataType, TItemType>({ data, getItemId });

    const columnStyles = useMemo(() => {
        const headerSizes = columns.map(column => column.size);

        const sizes: string[] = [];
        const styles = headerSizes.map((size) => {
            if (size > 100000) {
                sizes.push(itemListHelpers.table.columnSizeToStyle(size));
                return itemListHelpers.table.columnSizeToStyle(size);
            }

            sizes.push(itemListHelpers.table.columnSizeToStyle(size));
            return itemListHelpers.table.columnSizeToStyle(size);
        });

        return {
            gridTemplateColumns: styles.join(' '),
        };
    }, [columns]);

    useImperativeHandle(virtuosoRef, () => ({
        autoscrollToBottom: () => {
            ref?.current?.autoscrollToBottom();
        },
        deselectAll: () => {
            reducers.setSelection({});
        },
        getSelection: () => {
            const items = data.filter((_, index) => {
                const id = getItemId ? getItemId(index) : undefined;
                return id ? itemSelection[id] : false;
            });

            return {
                ids: Object.keys(itemSelection),
                items,
            };
        },
        getState: (stateCb: StateCallback) => {
            ref?.current?.getState(stateCb);
        },
        scrollBy: (location: ScrollToOptions) => {
            ref?.current?.scrollBy(location);
        },
        scrollIntoView: (location: FlatScrollIntoViewLocation) => {
            ref?.current?.scrollIntoView(location);
        },
        scrollTo: (location: ScrollToOptions) => {
            ref?.current?.scrollTo(location);
        },
        scrollToIndex: (location: number | FlatIndexLocationWithAlign) => {
            ref?.current?.scrollToIndex(location);
        },
        selectAll: () => {
            const selection: Record<string, boolean> = {};

            for (const [index] of data.entries()) {
                const id = getItemId ? getItemId(index) : undefined;
                if (id) {
                    selection[id] = true;
                }
            }

            reducers.setSelection(selection);
        },
    }));

    const tableContext = useMemo(() => ({
        ...context,
        columns,
        columnStyles,
        itemSelection,
        itemSelectionType,
        itemType,
        onItemSelection: itemSelectionType === 'multiple'
            ? _onMultiSelectionClick
            : itemSelectionType === 'single' ? _onSingleSelectionClick : undefined,
        reducers,
    }), [
        context,
        columns,
        columnStyles,
        itemSelection,
        itemSelectionType,
        itemType,
        _onMultiSelectionClick,
        _onSingleSelectionClick,
        reducers,
    ]);

    return (
        <div className={clsx(styles.container)}>
            {enableHeader && (
                <TableHeader
                    columnOrder={columnOrder}
                    columnStyles={columnStyles}
                    columns={columns}
                    tableId={tableId}
                    onChangeColumnOrder={onChangeColumnOrder}
                />
            )}
            <ComponentErrorBoundary>
                <div
                    ref={rowsRef}
                    className={styles.rows}
                    data-overlayscrollbars-initialize=""
                    draggable="false"
                >
                    <Virtuoso
                        ref={ref}
                        components={{
                            Header: HeaderComponent
                                ? props => <HeaderComponent {...props} />
                                : undefined,
                            Item: BaseItemComponent,
                            List: BaseListComponent,
                        }}
                        context={tableContext}
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
                        style={{ overflow: 'hidden' }}
                        topItemCount={enableStickyHeader ? 1 : 0}
                        totalCount={itemCount}
                        onScroll={onScroll}
                    />
                </div>
            </ComponentErrorBoundary>
        </div>
    );
}

export function TableHeader(props: {
    columnOrder: ItemListColumn[];
    columns: ItemListColumnDefinitions;
    columnStyles?: Record<string, any>;
    onChangeColumnOrder?: (columnOrder: ItemListColumn[]) => void;
    tableId: string;
}) {
    const { columnOrder, columns, columnStyles, onChangeColumnOrder, tableId } = props;

    // if (!columnOrder)
    //     return null;

    return (
        <div className={styles.header} style={{ ...columnStyles }}>
            {columns.map(column => (
                <ItemTableHeader
                    key={`header-${column.id}`}
                    column={column}
                    columnOrder={columnOrder}
                    columnStyles={columnStyles?.styles || {}}
                    setColumnOrder={onChangeColumnOrder}
                    tableId={tableId}
                />
            ))}
        </div>
    );
}
