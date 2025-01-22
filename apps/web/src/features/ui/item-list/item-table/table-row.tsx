import type { MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
    draggable,
    dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import {
    attachClosestEdge,
    extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { LibraryItemType } from '@repo/shared-types';
import type { Row, Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';
import { Fragment } from 'react/jsx-runtime';
import { createRoot } from 'react-dom/client';
import type { PlayQueueItem } from '@/api/api-types.ts';
import { DragPreview } from '@/features/ui/drag-preview/drag-preview.tsx';
import type {
    ItemTableContext,
    ItemTableRowDrop,
} from '@/features/ui/item-list/item-table/item-table.tsx';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import {
    dndUtils,
    DragOperation,
    DragTarget,
    libraryItemTypeToDragTarget,
} from '@/utils/drag-drop.ts';
import type { DragData } from '@/utils/drag-drop.ts';
import styles from './table-row.module.scss';

interface TableRowProps<T> {
    context: ItemTableContext;
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

export function TableRow<T>(props: TableRowProps<T>) {
    return <InnerTableRow {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InnerTableRow = <T,>(props: TableRowProps<T>) => {
    const {
        context,
        enableExpanded,
        index,
        itemType,
        onRowClick,
        onRowDoubleClick,
        onRowContextMenu,
        onRowDrop,
        onRowDrag,
        onRowDragData,
        enableRowDrag,
        rowId,
        table,
        tableId,
    } = props;

    const ref = useRef<HTMLDivElement>(null);

    const row = table.getRow(rowId);

    const canSelect = row?.getCanSelect();
    const isSelected = row?.getIsSelected();
    const isExpanded = row?.getIsExpanded();

    const [isDraggedOver, setIsDraggedOver] = useState<Edge | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const fns = [];

        if (onRowDrag || enableRowDrag) {
            fns.push(
                draggable({
                    element: ref.current,
                    getInitialData: () => {
                        if (onRowDragData) {
                            return onRowDragData(row as Row<T>, table);
                        }

                        const isSelfSelected = row.getIsSelected();

                        if (isSelfSelected) {
                            const selectedRows = table.getSelectedRowModel().rows;

                            const selectedRowIds = [];
                            const selectedItems = [];

                            for (const row of selectedRows) {
                                selectedRowIds.push(row.id);
                                selectedItems.push(row.original);
                            }

                            return dndUtils.generateDragData({
                                id: selectedRowIds,
                                item: selectedItems,
                                operation: [DragOperation.REORDER, DragOperation.ADD],
                                type: libraryItemTypeToDragTarget[
                                    itemType as keyof typeof libraryItemTypeToDragTarget
                                ],
                            });
                        }

                        return dndUtils.generateDragData({
                            id: [row.id],
                            item: [row.original],
                            operation: [DragOperation.REORDER, DragOperation.ADD],
                            type: libraryItemTypeToDragTarget[
                                itemType as keyof typeof libraryItemTypeToDragTarget
                            ],
                        });
                    },
                    onDragStart: () => {
                        const isSelfSelected = row.getIsSelected();

                        // If attempting to drag a row that is not selected, select it
                        if (!isSelfSelected) {
                            table.resetRowSelection();
                            row.toggleSelected(true);
                        }

                        onRowDrag?.(row as Row<T>, table);
                    },
                    onDrop: () => {},
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
            );
        }

        if (onRowDrop) {
            fns.push(
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
                            DragTarget.GENRE,
                        ]);

                        return isTarget;
                    },
                    element: ref.current,
                    getData: ({ input, element }) => {
                        const data = dndUtils.generateDragData({
                            id: [row.id],
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

                        onRowDrop?.(row as Row<T>, table, {
                            data: args.source.data as DragData,
                            edge: closestEdgeOfTarget,
                            id: row.id,
                            index,
                            table,
                            uniqueId: (row.original as PlayQueueItem)?._uniqueId || row?.id,
                        });
                        setIsDraggedOver(null);
                    },
                }),
            );
        }

        return combine(...fns);
    }, [enableRowDrag, index, itemType, onRowDrag, onRowDragData, onRowDrop, row, row.id, table]);

    if (enableExpanded && !isExpanded) {
        return null;
    }

    return (
        <div className={styles.rowContainer}>
            <div
                ref={ref}
                className={clsx(styles.row, {
                    [styles.canSelect]: canSelect,
                    [styles.selected]: isSelected,
                    // [styles.dragging]: isDragging && table.getSelectedRowModel().rows.length === 0,
                    [styles.draggedOverBottom]: isDraggedOver === 'bottom',
                    [styles.draggedOverTop]: isDraggedOver === 'top',
                })}
                style={context.columnStyles?.styles}
                onClick={(e) => onRowClick?.(e, row, table)}
                onContextMenu={(e) => onRowContextMenu?.(e, row, table)}
                onDoubleClick={(e) => onRowDoubleClick?.(e, row, table)}
            >
                {row?.getVisibleCells()?.map((cell) => {
                    return (
                        <Fragment key={`${tableId}-cell-${cell.id}`}>
                            {flexRender(cell.column.columnDef.cell, {
                                ...cell.getContext(),
                                context: {
                                    ...context,
                                },
                            })}
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export function LoaderRow() {
    return (
        <div className={styles.rowContainer}>
            <Skeleton height="var(--table-row-config-comfortable-height)" width="100%" />
        </div>
    );
}
