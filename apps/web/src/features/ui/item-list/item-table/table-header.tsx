import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
    draggable,
    dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import {
    attachClosestEdge,
    extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { Header } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';
import type { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';
import type { DragData } from '@/utils/drag-drop.ts';
import styles from './table-header.module.scss';

interface TableHeaderProps<T> {
    columnOrder: ItemListColumn[];
    columnStyles: CSSProperties;
    header: Header<T | undefined, unknown>;
    setColumnOrder: (columnOrder: ItemListColumn[]) => void;
    tableId: string;
}

export function TableHeader<T>(props: TableHeaderProps<T>) {
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
                        id: [header.id],
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
                        id: [header.id],
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
