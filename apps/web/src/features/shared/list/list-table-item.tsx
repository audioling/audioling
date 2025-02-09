import type { MouseEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import { LibraryItemType } from '@repo/shared-types';
import clsx from 'clsx';
import { createRoot } from 'react-dom/client';
import { ContextMenuController } from '@/features/controllers/context-menu/context-menu-controller.tsx';
import { DragPreview } from '@/features/ui/drag-preview/drag-preview.tsx';
import type { ItemListColumnDefinition } from '@/features/ui/item-list/helpers.ts';
import { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import type { ItemTableItemProps } from '@/features/ui/item-list/item-table/item-table.tsx';
import type { DragData } from '@/utils/drag-drop.ts';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';
import styles from './list-item.module.scss';

export function ListTableItem<T>(props: ItemTableItemProps<T, T>) {
    return <InnerContent {...props} />;
}

const InnerContent = <T,>(props: ItemTableItemProps<T, T>) => {
    const {
        columnStyles,
        columns,
        index,
        itemSize,
        data: itemData,
        enableDropItem,
        enableItemBorder,
        enableSelection,
        getItemId,
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

    const id = getItemId?.(index, itemData);

    useEffect(() => {
        if (!ref.current || !id) return;

        const fns = [];

        if (enableDragItem) {
            fns.push(
                draggable({
                    element: ref.current,
                    getInitialData: () => {
                        const isSelfSelected = listReducers.getSelectionById(id);

                        let ids: string[] = [];

                        if (!isSelfSelected) {
                            ids.push(id);
                        } else {
                            ids = listReducers.getOrderedSelection();
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

                        let ids: string[] = [];

                        if (!isSelfSelected) {
                            listReducers.clearAndSetSelectionById(id);
                            ids.push(id);
                        } else {
                            ids = listReducers.getOrderedSelection();
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
                                const isSelfSelected = listReducers.getSelectionById(id);

                                let selectedCount = 0;

                                if (!isSelfSelected) {
                                    selectedCount = 1;
                                } else {
                                    const selected = listReducers.getSelection();
                                    selectedCount = Object.keys(selected).length;
                                }

                                root.render(<DragPreview itemCount={selectedCount} />);
                            },
                        });
                    },
                }),
            );
        }

        if (enableDropItem) {
            fns.push(
                dropTargetForElements({
                    canDrop: (args) => {
                        const data = args.source.data as DragData;
                        return enableDropItem({ dragData: data });
                    },
                    element: ref.current,
                    getData: ({ input, element }) => {
                        const data = dndUtils.generateDragData({
                            id: [id],
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

                        const selectedIds = listReducers.getOrderedSelection();

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
        }

        return combine(...fns);
    }, [
        enableDragItem,
        enableDropItem,
        id,
        index,
        itemData,
        itemType,
        listReducers,
        onItemDrag,
        onItemDragData,
        onItemDrop,
    ]);

    const handleItemContextMenu = useCallback(
        (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();

            if (!id) return;

            const isSelfSelected = listReducers.getSelectionById(id);

            let ids: string[] = [];

            if (!isSelfSelected) {
                listReducers.clearAndSetSelectionById(id);
                ids.push(id);
            } else {
                ids = listReducers.getOrderedSelection();
            }

            onItemContextMenu?.({ id, index, item: itemData, selectedIds: ids }, e);

            switch (itemType) {
                case LibraryItemType.ALBUM:
                    ContextMenuController.call({
                        cmd: {
                            ids,
                            type: 'album',
                        },
                        event: e,
                    });
                    break;
                case LibraryItemType.ALBUM_ARTIST:
                    ContextMenuController.call({
                        cmd: {
                            ids,
                            type: 'albumArtist',
                        },
                        event: e,
                    });
                    break;
                case LibraryItemType.ARTIST:
                    break;
                case LibraryItemType.GENRE:
                    ContextMenuController.call({
                        cmd: {
                            ids,
                            type: 'genre',
                        },
                        event: e,
                    });
                    break;
                case LibraryItemType.PLAYLIST:
                    ContextMenuController.call({
                        cmd: {
                            ids,
                            type: 'playlist',
                        },
                        event: e,
                    });
                    break;
                case LibraryItemType.TRACK:
                    ContextMenuController.call({
                        cmd: {
                            ids,
                            type: 'track',
                        },
                        event: e,
                    });
                    break;
            }
        },
        [id, index, itemData, itemType, listReducers, onItemContextMenu],
    );

    const cellHandlers = useCallback(
        (column: ItemListColumnDefinition) => {
            if (column.id === ItemListColumn.ACTIONS) {
                return {
                    onItemContextMenu: handleItemContextMenu,
                };
            }

            return {};
        },
        [handleItemContextMenu],
    );

    return (
        <div className={styles.rowContainer}>
            <div
                ref={ref}
                className={clsx(styles.row, {
                    [styles.canSelect]: enableSelection,
                    [styles.selected]: isSelected,
                    [styles.draggedOverBottom]: isDraggedOver === 'bottom',
                    [styles.draggedOverTop]: isDraggedOver === 'top',
                    [styles.rowCondensed]: itemSize === 'condensed',
                    [styles.rowComfortable]: itemSize === 'comfortable',
                    [styles.rowBorder]: enableItemBorder,
                })}
                style={columnStyles?.styles}
                onClick={(e) => {
                    if (!id) return;
                    onItemClick?.({ id, index, item: itemData }, e);
                }}
                onContextMenu={handleItemContextMenu}
                onDoubleClick={(e) => {
                    if (!id) return;
                    onItemDoubleClick?.({ id, index, item: itemData }, e);
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {columns.map((column) => {
                    return (
                        <column.cell
                            key={column.id}
                            handlers={cellHandlers(column)}
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
