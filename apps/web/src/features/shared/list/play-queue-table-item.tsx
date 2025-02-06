import { useEffect, useRef, useState } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
    draggable,
    dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import {
    attachClosestEdge,
    extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import clsx from 'clsx';
import { createRoot } from 'react-dom/client';
import type { PlayQueueItem } from '@/api/api-types.ts';
import { DragPreview } from '@/features/ui/drag-preview/drag-preview.tsx';
import type { ItemTableItemProps } from '@/features/ui/item-list/item-table/item-table.tsx';
import type { DragData } from '@/utils/drag-drop.ts';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';
import styles from './list-item.module.scss';

export function PlayQueueTableItem(props: ItemTableItemProps<PlayQueueItem, PlayQueueItem>) {
    return <InnerContent {...props} />;
}

const InnerContent = (props: ItemTableItemProps<PlayQueueItem, PlayQueueItem>) => {
    const {
        columnStyles,
        // columnOrder,
        columns,
        // enableExpanded,
        index,
        data: itemData,
        enableSelection,
        isSelected,
        itemType,
        listReducers,
        onItemClick,
        onItemDoubleClick,
        onItemContextMenu,
        onItemDrop,
        onItemDrag,
        onItemDragData,
        enableDragItem,
    } = props;

    const ref = useRef<HTMLDivElement>(null);

    const [isHovered, setIsHovered] = useState(false);
    const [isDraggedOver, setIsDraggedOver] = useState<Edge | null>(null);

    const id = itemData._uniqueId;

    useEffect(() => {
        if (!ref.current) return;

        const fns = [];

        if (enableDragItem) {
            fns.push(
                draggable({
                    element: ref.current,
                    getInitialData: () => {
                        const isSelfSelected = listReducers.getSelectionById(id);

                        const ids: string[] = [];

                        if (!isSelfSelected) {
                            ids.push(id);
                        } else {
                            const selected = listReducers.getSelection();
                            ids.push(...Object.keys(selected));
                        }

                        if (onItemDragData) {
                            return onItemDragData({ id, index, item: itemData, selectedIds: ids });
                        }

                        return dndUtils.generateDragData({
                            id: ids,
                            item: [itemData],
                            operation: [DragOperation.ADD],
                            type: DragTarget.TRACK,
                        });
                    },
                    onDragStart: () => {
                        const isSelfSelected = listReducers.getSelectionById(id);

                        const ids: string[] = [];

                        if (!isSelfSelected) {
                            listReducers.clearAndSetSelectionById(id);
                            ids.push(id);
                        } else {
                            const selected = listReducers.getSelection();
                            ids.push(...Object.keys(selected));
                        }

                        onItemDrag?.({ id, index, item: itemData, selectedIds: ids });
                    },
                    onDrop: () => {},
                    onGenerateDragPreview: (data) => {
                        disableNativeDragPreview({ nativeSetDragImage: data.nativeSetDragImage });
                        setCustomNativeDragPreview({
                            nativeSetDragImage: data.nativeSetDragImage,
                            render: ({ container }) => {
                                const root = createRoot(container);
                                const selectedCount = 1;
                                root.render(<DragPreview itemCount={selectedCount} />);
                            },
                        });
                    },
                }),
            );
        }

        fns.push(
            dropTargetForElements({
                canDrop: (args) => {
                    const data = args.source.data as DragData;
                    const isTarget = dndUtils.isDropTarget(data.type, [
                        DragTarget.ALBUM,
                        DragTarget.ALBUM_ARTIST,
                        DragTarget.ARTIST,
                        DragTarget.PLAYLIST,
                        DragTarget.PLAYLIST_TRACK,
                        DragTarget.TRACK,
                        DragTarget.QUEUE_TRACK,
                        DragTarget.GENRE,
                    ]);

                    return isTarget;
                },
                element: ref.current,
                getData: ({ input, element }) => {
                    const data = dndUtils.generateDragData({
                        id: [itemData._uniqueId],
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

                    const data = args.source.data as DragData;
                    const edge = closestEdgeOfTarget;

                    const selectedIds = Object.keys(listReducers.getSelection());

                    onItemDrop?.({
                        dragData: data,
                        edge,
                        id,
                        index,
                        item: itemData,
                        selectedIds: selectedIds,
                    });
                    setIsDraggedOver(null);
                },
            }),
        );

        return combine(...fns);
    }, [
        enableDragItem,
        id,
        index,
        itemData,
        itemType,
        listReducers,
        onItemDrag,
        onItemDragData,
        onItemDrop,
    ]);

    const handleItemContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const isSelfSelected = listReducers.getSelectionById(id);

        const ids: string[] = [];

        if (!isSelfSelected) {
            listReducers.clearAndSetSelectionById(id);
            ids.push(id);
        } else {
            const selected = listReducers.getSelection();
            ids.push(...Object.keys(selected));
        }

        onItemContextMenu?.({ id, index, item: itemData, selectedIds: ids }, e);
    };

    return (
        <div className={styles.rowContainer}>
            <div
                ref={ref}
                className={clsx(styles.row, {
                    [styles.canSelect]: enableSelection,
                    [styles.selected]: isSelected,
                    [styles.draggedOverBottom]: isDraggedOver === 'bottom',
                    [styles.draggedOverTop]: isDraggedOver === 'top',
                })}
                style={columnStyles?.styles}
                onClick={(e) =>
                    onItemClick?.(
                        {
                            id: itemData._uniqueId,
                            index,
                            item: itemData,
                        },
                        e,
                    )
                }
                onContextMenu={handleItemContextMenu}
                onDoubleClick={(e) => onItemDoubleClick?.({ id, index, item: itemData }, e)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {columns.map((column) => {
                    return (
                        <column.cell
                            key={column.id}
                            index={index}
                            isHovered={isHovered}
                            item={itemData}
                            itemType={itemType}
                        />
                    );
                })}
            </div>
        </div>
    );
};
