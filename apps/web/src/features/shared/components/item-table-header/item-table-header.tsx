import type { ItemListColumn, ItemListColumnDefinition } from '/@/features/shared/components/item-list/utils/helpers';
import type { DragData } from '/@/utils/drag-drop';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import type { CSSProperties } from 'react';
import {
    attachClosestEdge,
    extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
    draggable,
    dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { Paper } from '@mantine/core';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import styles from './item-table-header.module.css';
import { dndUtils, DragOperation, DragTarget } from '/@/utils/drag-drop';

interface ItemTableHeaderProps {
    column: ItemListColumnDefinition;
    columnOrder: ItemListColumn[];
    columnStyles: CSSProperties;
    setColumnOrder?: (columnOrder: ItemListColumn[]) => void;
    tableId: string;
}

export function ItemTableHeader(props: ItemTableHeaderProps) {
    const { column, columnOrder, columnStyles, setColumnOrder, tableId } = props;
    const ref = useRef(null);

    const [isDragging, setIsDragging] = useState(false);
    const [isDraggedOver, setIsDraggedOver] = useState<Edge | null>(null);

    useEffect(() => {
        if (!ref.current)
            return;

        return combine(
            draggable({
                element: ref.current,
                getInitialData: () => {
                    const data = dndUtils.generateDragData({
                        id: [column.id],
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
                    const data = args.source.data as unknown as DragData;
                    const isSelf = args.source.data.id === column.id;
                    return dndUtils.isDropTarget(data.type, [DragTarget.TABLE_COLUMN]) && !isSelf;
                },
                element: ref.current,
                getData: ({ element, input }) => {
                    const data = dndUtils.generateDragData({
                        id: [column.id],
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

                    const from = args.source.data.id as string[];
                    const to = args.self.data.id as string[];

                    const newColumnOrder = dndUtils.reorderById({
                        edge: closestEdgeOfTarget,
                        idFrom: from[0],
                        idTo: to[0],
                        list: columnOrder,
                    });

                    setColumnOrder?.(newColumnOrder as ItemListColumn[]);
                    setIsDraggedOver(null);
                },
            }),
        );
    }, [columnOrder, column.id, setColumnOrder, tableId]);

    return (
        <Paper
            ref={ref}
            className={clsx(styles.headerCell, {
                [styles.dragging]: isDragging,
                [styles.draggedOverLeft]: isDraggedOver === 'left',
                [styles.draggedOverRight]: isDraggedOver === 'right',
            })}
            style={columnStyles}
        >
            <column.header />
        </Paper>
    );
}
