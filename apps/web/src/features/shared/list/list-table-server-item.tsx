import { useEffect, useRef, useState } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { LibraryItemType } from '@repo/shared-types';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { createRoot } from 'react-dom/client';
import type {
    AlbumArtistItem,
    AlbumItem,
    GenreItem,
    PlaylistItem,
    TrackItem,
} from '@/api/api-types.ts';
import { getDbItem } from '@/api/db/app-db-api.ts';
import type { AppDbType } from '@/api/db/app-db.ts';
import { ContextMenuController } from '@/features/controllers/context-menu/context-menu-controller.tsx';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import { DragPreview } from '@/features/ui/drag-preview/drag-preview.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import {
    ItemTableHeader,
    type ItemTableItemProps,
} from '@/features/ui/item-list/item-table/item-table.tsx';
import type { ItemQueryData } from '@/hooks/use-list.ts';
import { dndUtils, DragOperation, DragTarget, DragTargetMap } from '@/utils/drag-drop.ts';
import styles from './list-item.module.scss';

export function ListTableServerItem<TItemType>(props: ItemTableItemProps<string, TItemType>) {
    return <InnerContent {...props} />;
}

function InnerContent<TItemType>(props: ItemTableItemProps<string, TItemType>) {
    const {
        columnOrder,
        columnStyles,
        columns,
        data: id,
        enableDragItem,
        enableSelection,
        enableStickyHeader,
        libraryId,
        listReducers,
        index,
        isSelected,
        itemType,
        onChangeColumnOrder,
        onItemClick,
        onItemDoubleClick,
        onItemContextMenu,
        startIndex,
        tableId,
    } = props;

    const ref = useRef<HTMLDivElement>(null);

    const [isHovered, setIsHovered] = useState(false);

    const { data: itemData } = useQuery<ItemQueryData>({
        enabled: false,
        queryKey: itemListHelpers.getDataQueryKey(libraryId, itemType),
    });

    const item = itemData?.[id as string] as TItemType | undefined;

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

                        const dragTarget = DragTargetMap[itemType as keyof typeof DragTargetMap] as
                            | DragTarget
                            | undefined;

                        const items = ids.map((id) =>
                            getDbItem(itemType as AppDbType, id),
                        ) as TItemType[];

                        return dndUtils.generateDragData({
                            id: ids,
                            item: items,
                            operation: [DragOperation.ADD],
                            type: dragTarget ?? DragTarget.UNKNOWN,
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

        return combine(...fns);
    }, [enableDragItem, id, index, itemData, itemType, listReducers]);

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

        const items = ids.map((id) => getDbItem(itemType as AppDbType, id)) as TItemType[];

        onItemContextMenu?.({ id, index, item: item as TItemType, selectedIds: ids }, e);

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
    };

    if (enableStickyHeader && index === 0) {
        return (
            <ItemTableHeader
                columnOrder={columnOrder}
                columnStyles={columnStyles}
                columns={columns}
                tableId={tableId}
                onChangeColumnOrder={onChangeColumnOrder}
            />
        );
    }

    return (
        <div className={styles.rowContainer}>
            <div
                ref={ref}
                className={clsx(styles.row, {
                    [styles.canSelect]: enableSelection,
                    [styles.selected]: isSelected,
                })}
                style={columnStyles?.styles}
                onClick={(e) => onItemClick?.({ id, index, item: item as TItemType }, e)}
                onContextMenu={handleItemContextMenu}
                onDoubleClick={(e) =>
                    onItemDoubleClick?.({ id, index, item: item as TItemType }, e)
                }
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {columns.map((column) => {
                    return (
                        <column.cell
                            key={column.id}
                            index={index}
                            isHovered={isHovered}
                            item={item as TItemType | undefined}
                            itemType={itemType}
                            startIndex={startIndex}
                        />
                    );
                })}
            </div>
        </div>
    );
}
