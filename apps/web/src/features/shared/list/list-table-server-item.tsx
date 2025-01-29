import { memo, useEffect, useRef, useState } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { LibraryItemType } from '@repo/shared-types';
import { useQuery } from '@tanstack/react-query';
import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';
import { Fragment } from 'react/jsx-runtime';
import { createRoot } from 'react-dom/client';
import type {
    AlbumArtistItem,
    AlbumItem,
    GenreItem,
    PlaylistItem,
    TrackItem,
} from '@/api/api-types.ts';
import { ContextMenuController } from '@/features/controllers/context-menu/context-menu-controller.tsx';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import { DragPreview } from '@/features/ui/drag-preview/drag-preview.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import {
    ItemTableHeader,
    type ItemTableItemProps,
} from '@/features/ui/item-list/item-table/item-table.tsx';
import type { ItemQueryData, ListQueryData } from '@/hooks/use-list.ts';
import { dndUtils, DragOperation, DragTarget, DragTargetMap } from '@/utils/drag-drop.ts';
import styles from './list-item.module.scss';

export function ListTableServerItem(props: ItemTableItemProps<string>) {
    return <MemoizedListTableServerItem {...props} />;
}

function InnerContent<T>(props: ItemTableItemProps<string>) {
    const {
        context,
        data: uniqueId,
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
        table,
        tableId,
    } = props;

    const ref = useRef<HTMLDivElement>(null);

    const row = table.getRow(index.toString());

    const canSelect = row?.getCanSelect();
    const isSelected = row?.getIsSelected();
    const isExpanded = row?.getIsExpanded();
    const [isHovered, setIsHovered] = useState(false);

    const { data: list } = useQuery<ListQueryData>({
        enabled: false,
        queryKey: itemListHelpers.getListQueryKey(context.libraryId, context.listKey, itemType),
    });

    const { data: itemData } = useQuery<ItemQueryData>({
        enabled: false,
        queryKey: itemListHelpers.getDataQueryKey(context.libraryId, itemType),
    });

    useEffect(() => {
        if (!ref.current) return;

        const fns = [];

        if (enableRowDrag) {
            fns.push(
                draggable({
                    element: ref.current,
                    getInitialData: () => {
                        const isSelfSelected = row.getIsSelected();

                        const dragTarget = DragTargetMap[itemType as keyof typeof DragTargetMap] as
                            | DragTarget
                            | undefined;

                        if (isSelfSelected) {
                            const selectedRowUniqueIds = table
                                .getSelectedRowModel()
                                .rows.map((row) => row.original)
                                .filter((id): id is string => id !== undefined);

                            const ids = selectedRowUniqueIds
                                .map((uniqueId) => list?.[uniqueId])
                                .filter((id): id is string => id !== undefined);

                            const items = ids
                                .map((id) => itemData?.[id])
                                .filter((item): item is T => item !== undefined);

                            return dndUtils.generateDragData({
                                id: ids,
                                item: items,
                                operation: [DragOperation.ADD],
                                type: dragTarget ?? DragTarget.UNKNOWN,
                            });
                        }

                        const id = list?.[uniqueId as string] as string;
                        const item = itemData?.[id];

                        return dndUtils.generateDragData({
                            id: [id],
                            item: item ? [item] : [],
                            operation: [DragOperation.ADD],
                            type: dragTarget ?? DragTarget.UNKNOWN,
                        });
                    },
                    onDragStart: () => {
                        const isSelfSelected = row.getIsSelected();

                        // If attempting to drag a row that is not selected, select it
                        if (!isSelfSelected) {
                            table.resetRowSelection();
                            row.toggleSelected(true);
                        }

                        const ids: string[] = [];

                        if (isSelfSelected) {
                            const selectedRowUniqueIds = table
                                .getSelectedRowModel()
                                .rows.map((row) => row.original)
                                .filter((id): id is string => id !== undefined);

                            selectedRowUniqueIds
                                .map((uniqueId) => list?.[uniqueId])
                                .filter((id): id is string => id !== undefined)
                                .forEach((id) => {
                                    ids.push(id);
                                });
                        } else {
                            ids.push(list?.[uniqueId as string] as string);
                        }

                        switch (itemType) {
                            case LibraryItemType.ALBUM:
                                PrefetchController.call({
                                    cmd: { tracksByAlbumId: { id: ids } },
                                });
                                break;
                            case LibraryItemType.ALBUM_ARTIST:
                                PrefetchController.call({
                                    cmd: { tracksByAlbumArtistId: { id: ids } },
                                });
                                break;
                            case LibraryItemType.ARTIST:
                                break;
                            case LibraryItemType.GENRE:
                                PrefetchController.call({
                                    cmd: { tracksByGenreId: { id: ids } },
                                });
                                break;
                            case LibraryItemType.PLAYLIST:
                                PrefetchController.call({
                                    cmd: { tracksByPlaylistId: { id: ids } },
                                });
                                break;
                            case LibraryItemType.TRACK:
                                break;
                        }
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

        return combine(...fns);
    }, [
        enableRowDrag,
        index,
        itemData,
        itemType,
        list,
        onRowDrag,
        onRowDragData,
        onRowDrop,
        row,
        row.id,
        table,
        uniqueId,
    ]);

    const handleRowContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const isSelfSelected = row.getIsSelected();

        // If attempting to drag a row that is not selected, select it
        if (!isSelfSelected) {
            table.resetRowSelection();
            row.toggleSelected(true);
        }

        const ids: string[] = [];
        const items: unknown[] = [];

        if (isSelfSelected) {
            table
                .getSelectedRowModel()
                .rows.map((row) => row.original)
                .filter((id): id is string => id !== undefined)
                .forEach((id) => {
                    ids.push(id);
                    items.push(itemData?.[list?.[id] as string] as string) as T;
                });
        } else {
            ids.push(list?.[uniqueId as string] as string);
            items.push(itemData?.[list?.[uniqueId as string] as string] as T);
        }

        switch (itemType) {
            case LibraryItemType.ALBUM:
                ContextMenuController.call({
                    cmd: {
                        items: items as AlbumItem[],
                        type: 'album',
                    },
                    event: e,
                });
                break;
            case LibraryItemType.ALBUM_ARTIST:
                ContextMenuController.call({
                    cmd: {
                        items: items as AlbumArtistItem[],
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
                        items: items as GenreItem[],
                        type: 'genre',
                    },
                    event: e,
                });
                break;
            case LibraryItemType.PLAYLIST:
                ContextMenuController.call({
                    cmd: {
                        items: items as PlaylistItem[],
                        type: 'playlist',
                    },
                    event: e,
                });
                break;
            case LibraryItemType.TRACK:
                ContextMenuController.call({
                    cmd: {
                        items: items as TrackItem[],
                        type: 'track',
                    },
                    event: e,
                });
                break;
        }

        onRowContextMenu?.(e, row, table, []);
    };

    if (context.componentProps.enableStickyHeader && index === 0) {
        return (
            <ItemTableHeader
                columnOrder={context.columnOrder}
                columnStyles={context.columnStyles}
                headers={context.headers}
                tableId={tableId}
                onChangeColumnOrder={context.onChangeColumnOrder}
            />
        );
    }

    const item = itemData?.[list?.[uniqueId as string] as string] as T | undefined;

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
                })}
                style={context.columnStyles?.styles}
                onClick={(e) => onRowClick?.(e, row, table)}
                onContextMenu={handleRowContextMenu}
                onDoubleClick={(e) => onRowDoubleClick?.(e, row, table)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {row?.getVisibleCells()?.map((cell) => {
                    return (
                        <Fragment key={`${tableId}-cell-${cell.id}`}>
                            {flexRender(cell.column.columnDef.cell, {
                                ...cell.getContext(),
                                context: {
                                    ...context,
                                    data: item,
                                    isHovered,
                                },
                            })}
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
}

const MemoizedListTableServerItem = memo(InnerContent, (prev, next) => {
    const isSelectionDifferent =
        prev.table.getSelectedRowModel().rows.length !==
        next.table.getSelectedRowModel().rows.length;

    return isSelectionDifferent;
});
