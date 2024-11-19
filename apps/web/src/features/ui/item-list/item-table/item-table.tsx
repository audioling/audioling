import type { CSSProperties, MouseEvent, SyntheticEvent } from 'react';
import { Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
    draggable,
    dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import {
    attachClosestEdge,
    extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { LibraryItemType } from '@repo/shared-types';
import type { DisplayColumnDef, Header, Row, Table } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import { createRoot } from 'react-dom/client';
import { Virtuoso } from 'react-virtuoso';
import { ItemContextMenu } from '@/features/shared/item-context-menu/item-context-menu.tsx';
import { DragPreview } from '@/features/ui/drag-preview/drag-preview.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import {
    dndUtils,
    DragOperation,
    DragTarget,
    libraryItemTypeToDragTarget,
} from '@/utils/drag-drop.ts';
import type { DragData } from '@/utils/drag-drop.ts';
import styles from './item-table.module.scss';

export interface TableItemProps<T, C extends { baseUrl: string; libraryId: string }> {
    context?: C;
    data: T | undefined;
    index: number;
}

export type ItemTableRowDrop = {
    data: DragData;
    edge: Edge | null;
    id: string;
    index: number;
};

interface ItemTableProps<T, C extends { baseUrl: string; libraryId: string }> {
    columnOrder: ItemListColumn[];
    columns: DisplayColumnDef<T | undefined>[];
    context: C;
    data: Map<number, T>;
    initialScrollIndex?: number;
    isHeaderVisible?: boolean;
    isScrolling?: (isScrolling: boolean) => void;
    itemCount: number;
    itemType: LibraryItemType;
    onChangeColumnOrder: (columnOrder: ItemListColumn[]) => void;
    onEndReached?: (index: number) => void;
    onRangeChanged?: (args: { endIndex: number; startIndex: number }) => void;
    onRowDrop?: (args: ItemTableRowDrop) => void;
    onScroll?: (event: SyntheticEvent) => void;
    onStartReached?: (index: number) => void;
}

export function ItemTable<
    T extends { id: string },
    C extends { baseUrl: string; libraryId: string },
>(props: ItemTableProps<T, C>) {
    const {
        columns,
        columnOrder,
        onChangeColumnOrder,
        context,
        data,
        initialScrollIndex,
        isHeaderVisible = true,
        isScrolling,
        itemCount,
        itemType,
        onEndReached,
        onRangeChanged,
        onRowDrop,
        onScroll,
        onStartReached,
    } = props;

    const tableId = useId();

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

            autoScrollForElements({
                element: scroller as HTMLElement,
                getAllowedAxis: () => 'vertical',
                getConfiguration: () => ({ maxScrollSpeed: 'fast' }),
            });
        }

        return () => osInstance()?.destroy();
    }, [scroller, initialize, osInstance]);

    const tableData = useMemo(() => {
        return Array.from({ length: itemCount }, (_, index) => data.get(index));
    }, [data, itemCount]);

    const table = useReactTable({
        columns,
        data: tableData,
        enableMultiRowSelection: true,
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            columnOrder,
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

    const [lastSelectedId, setLastSelectedId] = useState<number | null>(null);

    const handleRowClick = useCallback(
        (e: MouseEvent<HTMLDivElement>, row: Row<T | undefined>) => {
            e.stopPropagation();

            if (e.shiftKey) {
                const { rows, rowsById } = table.getRowModel();

                const currentIndex = row.index;
                const rowsToToggle = itemListHelpers.table.getRowRange(
                    rows,
                    currentIndex,
                    Number(lastSelectedId),
                );
                const isCellSelected = rowsById[row.id].getIsSelected();
                rowsToToggle.forEach((_row) => _row.toggleSelected(!isCellSelected));
            } else if (e.ctrlKey) {
                row.toggleSelected();
            } else {
                table.resetRowSelection();
                row.toggleSelected();
            }

            setLastSelectedId(row.index);
        },
        [lastSelectedId, table],
    );

    const handleRowContextMenu = useCallback(
        (e: MouseEvent<HTMLDivElement>, row: Row<T | undefined>) => {
            e.stopPropagation();

            e.currentTarget.dispatchEvent(
                new MouseEvent('contextmenu', {
                    bubbles: true,
                    clientX: e.currentTarget.getBoundingClientRect().x,
                    clientY: e.currentTarget.getBoundingClientRect().y,
                }),
            );

            table.resetRowSelection();
            row.toggleSelected();
        },
        [table],
    );

    return (
        <>
            <div
                className={clsx(styles.container, {
                    [styles.noHeader]: !isHeaderVisible,
                })}
            >
                {isHeaderVisible && (
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
                <div ref={rowsRef} className={styles.rows} data-overlayscrollbars-initialize="">
                    <Virtuoso
                        context={tableContext}
                        endReached={onEndReached}
                        increaseViewportBy={100}
                        initialTopMostItemIndex={initialScrollIndex || 0}
                        isScrolling={isScrolling}
                        itemContent={(index, _data, context) => (
                            <TableRow
                                context={context}
                                index={index}
                                itemType={itemType}
                                table={table}
                                tableId={tableId}
                                onRowClick={handleRowClick}
                                onRowContextMenu={handleRowContextMenu}
                                onRowDrop={onRowDrop}
                            />
                        )}
                        rangeChanged={onRangeChanged}
                        scrollerRef={setScroller}
                        startReached={onStartReached}
                        style={{ overflow: 'hidden' }}
                        totalCount={itemCount}
                        onScroll={onScroll}
                    />
                </div>
            </div>
            <ItemContextMenu />
        </>
    );
}

interface TableHeaderProps<T> {
    columnOrder: ItemListColumn[];
    columnStyles: CSSProperties;
    header: Header<T | undefined, unknown>;
    setColumnOrder: (columnOrder: ItemListColumn[]) => void;
    tableId: string;
}

function TableHeader<T>(props: TableHeaderProps<T>) {
    const { columnOrder, header, columnStyles, setColumnOrder, tableId } = props;
    const ref = useRef(null);

    const [isDragging, setIsDragging] = useState(false);
    const [isDraggedOver, setIsDraggedOver] = useState<Edge | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        return combine(
            draggable({
                element: ref.current,
                getInitialData: () => {
                    const data = dndUtils.generateDragData({
                        id: header.id,
                        operation: [DragOperation.REORDER],
                        type: DragTarget.TABLE_COLUMN,
                    });
                    return data;
                },
                onDragStart: () => {
                    setIsDragging(true);
                },
                onDrop: () => {
                    setIsDragging(false);
                },
                onGenerateDragPreview: (data) => {
                    disableNativeDragPreview({ nativeSetDragImage: data.nativeSetDragImage });
                },
            }),
            dropTargetForElements({
                canDrop: (args) => {
                    const data = args.source.data as DragData;
                    const isSelf = args.source.data.id === header.id;
                    return dndUtils.isDropTarget(data.type, [DragTarget.TABLE_COLUMN]) && !isSelf;
                },
                element: ref.current,
                getData: ({ input, element }) => {
                    const data = dndUtils.generateDragData({
                        id: header.id,
                        operation: [DragOperation.REORDER],
                        type: DragTarget.TABLE_COLUMN,
                    });

                    return attachClosestEdge(data, {
                        allowedEdges: ['left', 'right'],
                        element,
                        input,
                    });
                },
                onDrag: (args) => {
                    const closestEdgeOfTarget: Edge | null = extractClosestEdge(args.self.data);
                    setIsDraggedOver(closestEdgeOfTarget);
                },
                onDragLeave: () => {
                    setIsDraggedOver(null);
                },
                onDrop: (args) => {
                    const closestEdgeOfTarget: Edge | null = extractClosestEdge(args.self.data);

                    const newColumnOrder = dndUtils.reorderById({
                        edge: closestEdgeOfTarget,
                        idFrom: args.source.data.id as string,
                        idTo: args.self.data.id as string,
                        list: columnOrder,
                    });

                    setColumnOrder(newColumnOrder as ItemListColumn[]);
                    setIsDraggedOver(null);
                },
            }),
        );
    }, [columnOrder, header.id, setColumnOrder, tableId]);

    return (
        <div
            ref={ref}
            className={clsx(styles.headerCell, {
                [styles.dragging]: isDragging,
                [styles.draggedOverLeft]: isDraggedOver === 'left',
                [styles.draggedOverRight]: isDraggedOver === 'right',
            })}
            style={columnStyles}
        >
            {flexRender(header.column.columnDef.header, header.getContext())}
        </div>
    );
}

interface TableRowProps<
    T,
    C extends {
        baseUrl: string;
        columnStyles: {
            sizes: string[];
            styles: {
                gridTemplateColumns: string;
            };
        };
        libraryId: string;
    },
> {
    context: C;
    index: number;
    itemType: LibraryItemType;
    onRowClick: (e: MouseEvent<HTMLDivElement>, row: Row<T | undefined>) => void;
    onRowContextMenu: (e: MouseEvent<HTMLDivElement>, row: Row<T | undefined>) => void;
    onRowDrop?: (args: ItemTableRowDrop) => void;
    table: Table<T | undefined>;
    tableId: string;
}

function TableRow<
    T,
    C extends {
        baseUrl: string;
        columnStyles: {
            sizes: string[];
            styles: {
                gridTemplateColumns: string;
            };
        };
        libraryId: string;
    },
>(props: TableRowProps<T, C>) {
    const { context, index, itemType, onRowClick, onRowContextMenu, onRowDrop, table, tableId } =
        props;
    const ref = useRef<HTMLDivElement>(null);
    const row = table.getRow(index.toString());

    const canSelect = row?.getCanSelect();
    const isSelected = row?.getIsSelected();

    const [isDragging, setIsDragging] = useState(false);
    const [isDraggedOver, setIsDraggedOver] = useState<Edge | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        return combine(
            draggable({
                element: ref.current,
                getInitialData: () => {
                    const selectedRowIds = table.getSelectedRowModel().rows.map((row) => row.id);
                    return dndUtils.generateDragData({
                        id: selectedRowIds,
                        operation: [DragOperation.REORDER, DragOperation.ADD],
                        type: libraryItemTypeToDragTarget[
                            itemType as keyof typeof libraryItemTypeToDragTarget
                        ],
                    });
                },
                onDragStart: () => setIsDragging(true),
                onDrop: () => setIsDragging(false),
                onGenerateDragPreview: (data) => {
                    disableNativeDragPreview({ nativeSetDragImage: data.nativeSetDragImage });
                    setCustomNativeDragPreview({
                        nativeSetDragImage: data.nativeSetDragImage,
                        render: ({ container }) => {
                            const root = createRoot(container);
                            const selectedCount = table.getSelectedRowModel().rows.length || 1;
                            root.render(<DragPreview itemCount={selectedCount} />);
                        },
                    });
                },
            }),
            dropTargetForElements({
                canDrop: (args) => {
                    if (!onRowDrop) {
                        return false;
                    }

                    const data = args.source.data as DragData;
                    const isTarget = dndUtils.isDropTarget(data.type, [
                        DragTarget.ALBUM,
                        DragTarget.ALBUM_ARTIST,
                        DragTarget.ARTIST,
                        DragTarget.PLAYLIST,
                        DragTarget.TRACK,
                    ]);

                    return isTarget;
                },
                element: ref.current,
                getData: ({ input, element }) => {
                    const data = dndUtils.generateDragData({
                        id: row.id,
                        operation: [DragOperation.REORDER],
                        type: DragTarget.TRACK,
                    });

                    return attachClosestEdge(data, {
                        allowedEdges: ['bottom', 'top'],
                        element,
                        input,
                    });
                },
                onDrag: (args) => {
                    const closestEdgeOfTarget: Edge | null = extractClosestEdge(args.self.data);

                    setIsDraggedOver(closestEdgeOfTarget);
                },
                onDragLeave: () => {
                    setIsDraggedOver(null);
                },
                onDrop: (args) => {
                    const closestEdgeOfTarget: Edge | null = extractClosestEdge(args.self.data);

                    onRowDrop?.({
                        data: args.source.data as DragData,
                        edge: closestEdgeOfTarget,
                        id: row.id,
                        index,
                    });
                    setIsDraggedOver(null);
                },
            }),
        );
    }, [index, itemType, onRowDrop, row.id, table]);

    return (
        <div
            ref={ref}
            className={clsx(styles.row, {
                [styles.canSelect]: canSelect,
                [styles.selected]: isSelected,
                [styles.dragging]: isDragging && table.getSelectedRowModel().rows.length === 0,
                [styles.draggedOverBottom]: isDraggedOver === 'bottom',
                [styles.draggedOverTop]: isDraggedOver === 'top',
            })}
            style={context.columnStyles.styles}
            onClick={(e) => onRowClick(e, row)}
            onContextMenu={(e) => onRowContextMenu(e, row)}
        >
            {row?.getVisibleCells()?.map((cell) => {
                return (
                    <Fragment key={`${tableId}-cell-${cell.id}`}>
                        {flexRender(cell.column.columnDef.cell, {
                            ...cell.getContext(),
                            context: {
                                baseUrl: context.baseUrl!,
                                libraryId: context.libraryId!,
                            },
                        })}
                    </Fragment>
                );
            })}
        </div>
    );
}
