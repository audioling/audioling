import type { ElementType, MouseEvent, MutableRefObject, SyntheticEvent } from 'react';
import {
    useCallback,
    useEffect,
    useId,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { LibraryItemType } from '@repo/shared-types';
import clsx from 'clsx';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import type {
    FlatIndexLocationWithAlign,
    FlatScrollIntoViewLocation,
    StateCallback,
    VirtuosoHandle,
} from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import type { PlayQueueItem } from '@/api/api-types.ts';
import { ComponentErrorBoundary } from '@/features/shared/error-boundary/component-error-boundary.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type {
    ItemListColumn,
    ItemListColumnDefinitions,
    ItemListColumnOrder,
} from '@/features/ui/item-list/helpers.ts';
import { TableHeader } from '@/features/ui/item-list/item-table/table-header.tsx';
import type { ItemListInternalReducers } from '@/hooks/use-list.ts';
import { useItemListInternalState } from '@/hooks/use-list.ts';
import { type DragData, DragTarget } from '@/utils/drag-drop.ts';
import styles from './item-table.module.scss';

export interface TableContext {
    columnOrder?: ItemListColumn[];
    columnStyles?: { sizes: string[]; styles: { gridTemplateColumns: string } };
    currentTrack?: PlayQueueItem;
    libraryId: string;
    listKey: string;
    onChangeColumnOrder?: (columnOrder: ItemListColumn[]) => void;
    startIndex?: number;
}

export interface ItemTableContext extends TableContext {}

export interface ItemTableProps<TDataType, TItemType> {
    HeaderComponent?: ElementType;
    ItemComponent: React.ComponentType<ItemTableItemProps<TDataType, TItemType>>;
    columnOrder: ItemListColumnOrder;
    columns: ItemListColumnDefinitions;
    context: TableContext;
    data: (TDataType | undefined)[];
    disableAutoScroll?: boolean;
    enableDragItem?: boolean;
    enableDropItem?: (args: { dragData: DragData }) => boolean;
    enableHeader?: boolean;
    enableMultiRowSelection?: boolean;
    enableSingleRowSelection?: boolean;
    enableStickyHeader?: boolean;
    getItemId?: (index: number, item: TItemType) => string;
    initialScrollIndex?: number;
    isScrolling?: (isScrolling: boolean) => void;
    itemCount: number;
    itemType: LibraryItemType;
    onChangeColumnOrder: (columnOrder: ItemListColumn[]) => void;
    onEndReached?: (index: number) => void;
    onItemClick?: (
        args: {
            data: (TDataType | undefined)[];
            id: string;
            index: number;
            item: TItemType;
            reducers: ItemListInternalReducers;
        },
        e: MouseEvent<HTMLDivElement>,
    ) => void;
    onItemContextMenu?: (
        args: {
            data: (TDataType | undefined)[];
            id: string;
            index: number;
            item: TItemType;
            reducers: ItemListInternalReducers;
            selectedIds: string[];
        },
        e: MouseEvent<HTMLDivElement | HTMLButtonElement>,
    ) => void;
    onItemDoubleClick?: (
        args: {
            data: (TDataType | undefined)[];
            id: string;
            index: number;
            item: TItemType;
            reducers: ItemListInternalReducers;
        },
        e: MouseEvent<HTMLDivElement>,
    ) => void;
    onItemDrag?: (args: {
        id: string;
        index: number;
        item: TItemType;
        selectedIds: string[];
    }) => void;
    onItemDragData?: (args: {
        id: string;
        index: number;
        item: TItemType;
        selectedIds: string[];
    }) => DragData;
    onItemDrop?: (args: {
        dragData: DragData;
        edge: Edge | null;
        id: string;
        index: number;
        item: TItemType;
        selectedIds: string[];
    }) => void;
    onRangeChanged?: (args: { endIndex: number; startIndex: number }) => void;
    onScroll?: (event: SyntheticEvent) => void;
    onStartReached?: (index: number) => void;
    rowsKey?: string;
    virtuosoRef?: MutableRefObject<ItemTableHandle | undefined>;
}

export interface ItemTableHandle extends VirtuosoHandle {
    deselectAll: () => void;
    selectAll: () => void;
}

export function ItemTable<TDataType, TItemType>(props: ItemTableProps<TDataType, TItemType>) {
    const {
        columns,
        columnOrder,
        onChangeColumnOrder,
        context,
        data,
        disableAutoScroll,
        enableHeader = true,
        enableMultiRowSelection,
        enableDragItem = true,
        enableSingleRowSelection,
        enableStickyHeader,
        getItemId,
        HeaderComponent,
        initialScrollIndex,
        isScrolling,
        itemCount,
        ItemComponent,
        virtuosoRef,
        itemType,
        onEndReached,
        onRangeChanged,
        onItemClick,
        onItemContextMenu,
        onItemDoubleClick,
        onItemDragData,
        onItemDrag,
        onItemDrop,
        onScroll,
        onStartReached,
        rowsKey,
    } = props;

    const tableId = useId();

    const ref = useRef<VirtuosoHandle | null>(null);

    const rowsRef = useRef(null);

    const [scroller, setScroller] = useState<HTMLElement | Window | null>(null);
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
        const { current: root } = rowsRef;

        if (scroller && root) {
            initialize({
                elements: { viewport: scroller as HTMLElement },
                target: root,
            });

            if (!disableAutoScroll) {
                autoScrollForElements({
                    canScroll: (args) => {
                        const data = args.source.data as DragData<unknown>;
                        if (data.type === DragTarget.TABLE_COLUMN) return false;
                        return true;
                    },
                    element: scroller as HTMLElement,
                    getAllowedAxis: () => 'vertical',
                    getConfiguration: () => ({ maxScrollSpeed: 'fast' }),
                });
            }
        }

        return () => osInstance()?.destroy();
    }, [scroller, initialize, osInstance, rowsKey, disableAutoScroll]);

    const { _onMultiSelectionClick, _onSingleSelectionClick, itemSelection, reducers } =
        useItemListInternalState();

    const columnStyles = useMemo(() => {
        const headerSizes = columns.map((column) => column.size);

        const sizes: string[] = [];
        const columnsStyles = headerSizes.map((size) => {
            if (size > 100000) {
                sizes.push(itemListHelpers.table.columnSizeToStyle(size));
                return itemListHelpers.table.columnSizeToStyle(size);
            }

            sizes.push(itemListHelpers.table.columnSizeToStyle(size));
            return itemListHelpers.table.columnSizeToStyle(size);
        });

        const styles = {
            gridTemplateColumns: columnsStyles.join(' '),
        };

        return { sizes, styles };
    }, [columns]);

    useImperativeHandle(virtuosoRef, () => ({
        autoscrollToBottom: () => {
            ref?.current?.autoscrollToBottom();
        },
        deselectAll: () => {
            reducers.setSelection({});
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

            for (const [index, item] of data.entries()) {
                const id = getItemId ? getItemId(index, item as TItemType) : undefined;
                if (id) {
                    selection[id] = true;
                }
            }

            reducers.setSelection(selection);
        },
    }));

    const handleItemClick = useCallback(
        (args: { id: string; index: number; item: TItemType }, e: MouseEvent<HTMLDivElement>) => {
            const { id, index, item } = args;

            e.preventDefault();
            e.stopPropagation();

            if (enableMultiRowSelection) {
                const dataIds = getItemId
                    ? data.map((d) => getItemId(index, d as TItemType))
                    : (data as string[]);

                _onMultiSelectionClick(id, dataIds, index, e);
            } else if (enableSingleRowSelection) {
                _onSingleSelectionClick(id, e);
            }

            onItemClick?.({ data, id, index, item, reducers }, e);
        },
        [
            _onMultiSelectionClick,
            _onSingleSelectionClick,
            data,
            enableMultiRowSelection,
            enableSingleRowSelection,
            getItemId,
            onItemClick,
            reducers,
        ],
    );

    const handleItemDoubleClick = useCallback(
        (args: { id: string; index: number; item: TItemType }, e: MouseEvent<HTMLDivElement>) => {
            const { id, index, item } = args;

            onItemDoubleClick?.({ data, id, index, item, reducers }, e);
        },
        [data, onItemDoubleClick, reducers],
    );

    const handleItemContextMenu = useCallback(
        (
            args: { id: string; index: number; item: TItemType; selectedIds: string[] },
            e: MouseEvent<HTMLDivElement | HTMLButtonElement>,
        ) => {
            const { id, index, item, selectedIds } = args;

            onItemContextMenu?.({ data, id, index, item, reducers, selectedIds }, e);
        },
        [data, onItemContextMenu, reducers],
    );

    return (
        <div
            className={clsx(styles.container, {
                [styles.hasHeader]: enableHeader,
            })}
        >
            {enableHeader && (
                <div className={styles.header} style={columnStyles.styles}>
                    {columns.map((col) => (
                        <TableHeader
                            key={`header-${col.id}`}
                            column={col}
                            columnOrder={columnOrder}
                            columnStyles={columnStyles.styles}
                            setColumnOrder={onChangeColumnOrder}
                            tableId={tableId}
                        />
                    ))}
                </div>
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
                                ? (props) => <HeaderComponent {...props} />
                                : undefined,
                        }}
                        context={context}
                        data={data}
                        endReached={onEndReached}
                        increaseViewportBy={100}
                        initialTopMostItemIndex={initialScrollIndex || 0}
                        isScrolling={isScrolling}
                        itemContent={(i, d, c) => {
                            return (
                                <ItemComponent
                                    columnOrder={columnOrder}
                                    columnStyles={columnStyles}
                                    columns={columns}
                                    data={d as TDataType}
                                    enableDragItem={enableDragItem}
                                    enableExpanded={false}
                                    enableSelection={Boolean(
                                        enableMultiRowSelection || enableSingleRowSelection,
                                    )}
                                    enableStickyHeader={enableStickyHeader}
                                    index={i}
                                    isSelected={Boolean(
                                        itemSelection[d as keyof typeof itemSelection],
                                    )}
                                    itemType={itemType}
                                    libraryId={c.libraryId}
                                    listKey={c.listKey}
                                    listReducers={reducers}
                                    startIndex={c.startIndex}
                                    tableId={tableId}
                                    onChangeColumnOrder={onChangeColumnOrder}
                                    onItemClick={handleItemClick}
                                    onItemContextMenu={handleItemContextMenu}
                                    onItemDoubleClick={handleItemDoubleClick}
                                    onItemDrag={onItemDrag}
                                    onItemDragData={onItemDragData}
                                    onItemDrop={onItemDrop}
                                />
                            );
                        }}
                        overscan={50}
                        rangeChanged={onRangeChanged}
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

export function ItemTableHeader(props: {
    columnOrder?: ItemListColumn[];
    columnStyles?: ItemTableContext['columnStyles'];
    columns: ItemListColumnDefinitions;
    onChangeColumnOrder?: (columnOrder: ItemListColumn[]) => void;
    tableId: string;
}) {
    const { columnStyles, columns, columnOrder, onChangeColumnOrder, tableId } = props;

    if (!columnOrder) return null;

    return (
        <div className={styles.header} style={columnStyles?.styles}>
            {columns.map((column) => (
                <TableHeader
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

export interface ItemTableItemProps<TDataType, TItemType> {
    columnOrder: ItemListColumn[];
    columnStyles: { sizes: string[]; styles: { gridTemplateColumns: string } };
    columns: ItemListColumnDefinitions;
    data: TDataType;
    disableRowDrag?: boolean;
    enableDragItem?: boolean;
    enableDropItem?: (args: { dragData: DragData }) => boolean;
    enableExpanded: boolean;
    enableSelection?: boolean;
    enableStickyHeader?: boolean;
    getItemId?: (index: number, item: TItemType) => string;
    index: number;
    isOffline?: boolean;
    isSelected?: boolean;
    itemType: LibraryItemType;
    libraryId: string;
    listKey: string;
    listReducers: ItemListInternalReducers;
    onChangeColumnOrder?: (columnOrder: ItemListColumn[]) => void;
    onItemClick?: (
        args: { id: string; index: number; item: TItemType },
        e: MouseEvent<HTMLDivElement>,
    ) => void;
    onItemContextMenu?: (
        args: { id: string; index: number; item: TItemType; selectedIds: string[] },
        e: MouseEvent<HTMLDivElement | HTMLButtonElement>,
    ) => void;
    onItemDoubleClick?: (
        args: { id: string; index: number; item: TItemType },
        e: MouseEvent<HTMLDivElement>,
    ) => void;
    onItemDrag?: (args: {
        id: string;
        index: number;
        item: TItemType;
        selectedIds: string[];
    }) => void;
    onItemDragData?: (args: {
        id: string;
        index: number;
        item: TItemType;
        selectedIds: string[];
    }) => DragData;
    onItemDrop?: (args: {
        dragData: DragData;
        edge: Edge | null;
        id: string;
        index: number;
        item: TItemType;
        selectedIds: string[];
    }) => void;
    rowIdProperty?: string;
    startIndex?: number;
    tableId: string;
}
