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
import { DragPreview } from '@/features/ui/drag-preview/drag-preview.tsx';
import type { ItemTableRowDrop } from '@/features/ui/item-list/item-table/item-table.tsx';
import {
    dndUtils,
    DragOperation,
    DragTarget,
    libraryItemTypeToDragTarget,
} from '@/utils/drag-drop.ts';
import type { DragData } from '@/utils/drag-drop.ts';
import styles from './table-row.module.scss';

interface TableRowProps<
    T extends { _uniqueId?: string; id: string },
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
    onRowDrop?: (args: ItemTableRowDrop<T>) => void;
    rowId: string;
    table: Table<T | undefined>;
    tableId: string;
}

export function TableRow<
    T extends { _uniqueId?: string; id: string },
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
>(props: TableRowProps<T & { _uniqueId?: string }, C>) {
    const {
        context,
        index,
        itemType,
        onRowClick,
        onRowDoubleClick,
        onRowContextMenu,
        onRowDrop,
        rowId,
        table,
        tableId,
    } = props;
    const ref = useRef<HTMLDivElement>(null);

    const row = table.getRow(rowId);

    const canSelect = row?.getCanSelect();
    const isSelected = row?.getIsSelected();
    const isExpanded = row?.getIsExpanded();

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
                onDragStart: () => {
                    const isSelfSelected = row.getIsSelected();

                    // If attempting to drag a row that is not selected, select it
                    if (!isSelfSelected) {
                        table.resetRowSelection();
                        setTimeout(() => row.toggleSelected(true), 50);
                    }

                    setIsDragging(true);
                },
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
                        table,
                        uniqueId: row.original?._uniqueId || row?.id,
                    });
                    setIsDraggedOver(null);
                },
            }),
        );
    }, [index, itemType, onRowDrop, row, row.id, table]);

    if (!isExpanded) {
        return null;
    }

    return (
        <div className={styles.rowContainer}>
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
                                    baseUrl: context.baseUrl!,
                                    libraryId: context.libraryId!,
                                },
                            })}
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
}
