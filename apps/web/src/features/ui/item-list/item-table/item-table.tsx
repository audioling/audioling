import type { ElementType, MouseEvent, MutableRefObject, SyntheticEvent } from 'react';
import { useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { LibraryItemType } from '@repo/shared-types';
import type {
    DisplayColumnDef,
    ExpandedState,
    Row,
    RowSelectionState,
    Table,
} from '@tanstack/react-table';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
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
import type { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { TableHeader } from '@/features/ui/item-list/item-table/table-header.tsx';
import type { DragData } from '@/utils/drag-drop.ts';
import styles from './item-table.module.scss';

export interface ItemTableContext {
    columnStyles?: { sizes: string[]; styles: { gridTemplateColumns: string } };
    currentTrack?: PlayQueueItem;
    data?: unknown;
    libraryId: string;
    listKey: string;
}

export interface TableItemProps<T> {
    context?: ItemTableContext;
    data: T | undefined;
    index: number;
}

export type ItemTableRowDrop<T> = {
    data: DragData;
    edge: Edge | null;
    id: string;
    index: number;
    table: Table<T | undefined>;
    uniqueId: string;
};

export type ItemTableRowDragData<T> = {
    data: DragData;
    edge: Edge | null;
    id: string;
    index: number;
    table: Table<T | undefined>;
    uniqueId: string;
};

export interface ItemTableItemProps<T> {
    context: ItemTableContext;
    data: T;
    disableRowDrag?: boolean;
    enableExpanded: boolean;
    enableRowDrag?: boolean;
    index: number;
    itemType: LibraryItemType;
    onRowClick?: (
        e: MouseEvent<HTMLDivElement>,
        row: Row<T | undefined>,
        table: Table<T | undefined>,
    ) => void;
    onRowContextMenu?: (
        e: MouseEvent<HTMLDivElement>,
        row: Row<T | undefined>,
        table: Table<T | undefined>,
    ) => void;
    onRowDoubleClick?: (
        e: MouseEvent<HTMLDivElement>,
        row: Row<T | undefined>,
        table: Table<T | undefined>,
    ) => void;
    onRowDrag?: (row: Row<T>, table: Table<T | undefined>) => void;
    onRowDragData?: (row: Row<T>, table: Table<T | undefined>) => DragData;
    onRowDrop?: (row: Row<T>, table: Table<T | undefined>, args: ItemTableRowDrop<T>) => void;
    rowId: string;
    table: Table<T | undefined>;
    tableId: string;
}

export interface ItemTableProps<T> {
    HeaderComponent?: ElementType;
    ItemComponent: React.ComponentType<ItemTableItemProps<T>>;
    columnOrder: ItemListColumn[];
    columns: DisplayColumnDef<T | undefined>[];
    context: ItemTableContext;
    data: (T | undefined)[];
    disableAutoScroll?: boolean;
    enableHeader?: boolean;
    enableMultiRowSelection?: boolean;
    enableRowDrag?: boolean;
    enableRowSelection?: boolean;
    getRowId?: (
        originalRow: T | undefined,
        index: number,
        parent?: Row<T | undefined> | undefined,
    ) => string;
    initialScrollIndex?: number;
    isScrolling?: (isScrolling: boolean) => void;
    itemCount: number;
    itemType: LibraryItemType;
    onChangeColumnOrder: (columnOrder: ItemListColumn[]) => void;
    onEndReached?: (index: number) => void;
    onRangeChanged?: (args: { endIndex: number; startIndex: number }) => void;
    onRowClick?: (
        e: MouseEvent<HTMLDivElement>,
        row: Row<T | undefined>,
        table: Table<T | undefined>,
    ) => void;
    onRowContextMenu?: (
        e: MouseEvent<HTMLDivElement>,
        row: Row<T | undefined>,
        table: Table<T | undefined>,
    ) => void;
    onRowDoubleClick?: (
        e: MouseEvent<HTMLDivElement>,
        row: Row<T | undefined>,
        table: Table<T | undefined>,
    ) => void;
    onRowDrag?: (row: Row<T>, table: Table<T | undefined>) => void;
    onRowDragData?: (row: Row<T>, table: Table<T | undefined>) => DragData;
    onRowDrop?: (row: Row<T>, table: Table<T | undefined>, args: ItemTableRowDrop<T>) => void;
    onScroll?: (event: SyntheticEvent) => void;
    onStartReached?: (index: number) => void;
    rowIdProperty?: string;
    rowsKey?: string;
    virtuosoRef?: MutableRefObject<ItemTableHandle<T> | undefined>;
}

export interface ItemTableHandle<T> extends VirtuosoHandle {
    getTable: () => Table<T | undefined>;
}

export function ItemTable<T>(props: ItemTableProps<T>) {
    const {
        columns,
        columnOrder,
        onChangeColumnOrder,
        context,
        data,
        disableAutoScroll,
        enableHeader = true,
        enableMultiRowSelection,
        enableRowDrag = true,
        enableRowSelection,
        HeaderComponent,
        getRowId,
        initialScrollIndex,
        isScrolling,
        itemCount,
        ItemComponent,
        virtuosoRef,
        itemType,
        onEndReached,
        onRangeChanged,
        onRowClick,
        onRowContextMenu,
        onRowDoubleClick,
        onRowDragData,
        onRowDrag,
        onRowDrop,
        onScroll,
        onStartReached,
        rowIdProperty,
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
                    element: scroller as HTMLElement,
                    getAllowedAxis: () => 'vertical',
                    getConfiguration: () => ({ maxScrollSpeed: 'fast' }),
                });
            }
        }

        return () => osInstance()?.destroy();
    }, [scroller, initialize, osInstance, rowsKey, disableAutoScroll]);

    const [selection, setSelection] = useState<RowSelectionState>({});
    const [expanded, setExpanded] = useState<ExpandedState>(true);

    const tableData = useMemo(() => {
        setExpanded(true);
        return data;
    }, [data]);

    const table = useReactTable({
        columns,
        data: tableData,
        enableMultiRowSelection,
        enableRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getRowId: getRowId || ((_row, index) => index.toString()),
        getSortedRowModel: getSortedRowModel(),
        onExpandedChange: setExpanded,
        onRowSelectionChange: setSelection,
        state: {
            columnOrder,
            expanded,
            rowSelection: selection,
        },
    });

    const headers = table.getFlatHeaders();

    const columnStyles = useMemo(() => {
        const headerSizes = headers.map((header) => header.getSize());

        const sizes: string[] = [];
        const columns = headerSizes.map((size) => {
            if (size > 100000) {
                sizes.push(itemListHelpers.table.columnSizeToStyle(size));
                return itemListHelpers.table.columnSizeToStyle(size);
            }

            sizes.push(itemListHelpers.table.columnSizeToStyle(size));
            return itemListHelpers.table.columnSizeToStyle(size);
        });

        const styles = {
            gridTemplateColumns: columns.join(' '),
        };

        return { sizes, styles };
    }, [headers]);

    const tableContext = useMemo(() => ({ ...context, columnStyles }), [context, columnStyles]);

    useImperativeHandle(virtuosoRef, () => ({
        autoscrollToBottom: () => {
            ref?.current?.autoscrollToBottom();
        },
        getState: (stateCb: StateCallback) => {
            ref?.current?.getState(stateCb);
        },
        getTable: () => table,
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
    }));

    return (
        <div
            className={clsx(styles.container, {
                [styles.noHeader]: !enableHeader,
            })}
        >
            {enableHeader && (
                <div className={styles.header} style={columnStyles.styles}>
                    {headers.map((header) => (
                        <TableHeader
                            key={`header-${header.id}`}
                            columnOrder={columnOrder}
                            columnStyles={columnStyles.styles}
                            header={header}
                            setColumnOrder={onChangeColumnOrder}
                            tableId={tableId}
                        />
                    ))}
                </div>
            )}
            <ComponentErrorBoundary>
                <div ref={rowsRef} className={styles.rows} data-overlayscrollbars-initialize="">
                    <Virtuoso
                        ref={ref}
                        components={{
                            Header: HeaderComponent
                                ? (props) => <HeaderComponent {...props} />
                                : undefined,
                        }}
                        context={tableContext}
                        data={data}
                        endReached={onEndReached}
                        increaseViewportBy={100}
                        initialTopMostItemIndex={initialScrollIndex || 0}
                        isScrolling={isScrolling}
                        itemContent={(index, d, context) => {
                            return (
                                <ItemComponent
                                    context={context}
                                    data={d as T}
                                    enableExpanded={false}
                                    enableRowDrag={enableRowDrag}
                                    index={index}
                                    itemType={itemType}
                                    rowId={
                                        getRowId && rowIdProperty
                                            ? (data[index]?.[rowIdProperty as keyof T] as string)
                                            : index.toString()
                                    }
                                    table={table}
                                    tableId={tableId}
                                    onRowClick={onRowClick}
                                    onRowContextMenu={onRowContextMenu}
                                    onRowDoubleClick={onRowDoubleClick}
                                    onRowDrag={onRowDrag}
                                    onRowDragData={onRowDragData}
                                    onRowDrop={onRowDrop}
                                />
                            );
                        }}
                        overscan={50}
                        rangeChanged={onRangeChanged}
                        scrollerRef={setScroller}
                        startReached={onStartReached}
                        style={{ overflow: 'hidden' }}
                        totalCount={itemCount}
                        onScroll={onScroll}
                    />
                </div>
            </ComponentErrorBoundary>
        </div>
    );
}
