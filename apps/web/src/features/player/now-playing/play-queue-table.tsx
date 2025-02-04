import type { MouseEvent, MutableRefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/dist/types/internal-types.js';
import { LibraryItemType } from '@repo/shared-types';
import clsx from 'clsx';
import type { PlayQueueItem, TrackItem } from '@/api/api-types.ts';
import { getDbItems } from '@/api/db/app-db-api.ts';
import { ContextMenuController } from '@/features/controllers/context-menu/context-menu-controller.tsx';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import type { QueueGroupingProperty } from '@/features/player/stores/player-store.tsx';
import {
    PlayType,
    subscribeCurrentTrack,
    subscribePlayerQueue,
    usePlayerActions,
} from '@/features/player/stores/player-store.tsx';
import { PlayQueueTableItem } from '@/features/shared/list/play-queue-table-item.tsx';
import { Center } from '@/features/ui/center/center.tsx';
import type { ItemListColumnOrder } from '@/features/ui/item-list/helpers.ts';
import { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { GroupedItemTable } from '@/features/ui/item-list/item-table/grouped-item-table.tsx';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import type { ItemTableHandle } from '@/features/ui/item-list/item-table/item-table.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import type { DragData } from '@/utils/drag-drop.ts';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';
import styles from './play-queue-table.module.scss';

interface PlayQueueTableProps {
    baseUrl: string;
    groupBy: QueueGroupingProperty | undefined;
    itemTableRef: MutableRefObject<ItemTableHandle | undefined>;
    libraryId: string;
}

export function PlayQueueTable({ groupBy, libraryId, itemTableRef }: PlayQueueTableProps) {
    const { getQueue } = usePlayerActions();

    useEffect(() => {
        const setQueue = () => {
            const queue = getQueue(groupBy) || { groups: [], items: [] };

            const data = queue.items.map((item, index) => {
                return { ...item, index };
            });

            setData(data);
            setGroups(queue.groups);
        };

        const unsub = subscribePlayerQueue(() => {
            setQueue();
        });

        const unsubCurrentTrack = subscribeCurrentTrack((e) => {
            if (e.index !== -1) {
                itemTableRef.current?.scrollToIndex({
                    align: 'start',
                    behavior: 'smooth',
                    index: e.index,
                    offset: -50,
                });
            }
        });

        setQueue();

        return () => {
            unsub();
            unsubCurrentTrack();
        };
    }, [getQueue, groupBy, itemTableRef]);

    const [data, setData] = useState<PlayQueueItem[]>([]);
    const [groups, setGroups] = useState<{ count: number; name: string }[]>([]);

    const [columnOrder, setColumnOrder] = useState<ItemListColumnOrder>([
        ItemListColumn.ROW_INDEX,
        ItemListColumn.IMAGE,
        ItemListColumn.STANDALONE_COMBINED,
    ]);

    const { columns } = useItemTable(columnOrder);

    const handleItemDrop = useCallback(
        async (args: {
            dragData: DragData;
            edge: Edge | null;
            id: string;
            index: number;
            item: PlayQueueItem;
            selectedIds: string[];
        }) => {
            const { dragData, edge, id, selectedIds } = args;

            if (dragData.operation?.includes(DragOperation.REORDER)) {
                const items: PlayQueueItem[] = [];

                for (const id of selectedIds) {
                    const item = data.find((item) => item._uniqueId === id);
                    if (item) {
                        items.push(item);
                    }
                }

                PlayerController.call({
                    cmd: {
                        moveSelectedTo: {
                            edge: edge as 'top' | 'bottom',
                            items: items,
                            uniqueId: id,
                        },
                    },
                });
                return;
            }

            if (dragData.operation?.includes(DragOperation.ADD)) {
                switch (dragData.type) {
                    case DragTarget.ALBUM:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: dragData.id,
                                    itemType: LibraryItemType.ALBUM,
                                    type: {
                                        edge,
                                        uniqueId: id,
                                    },
                                },
                            },
                        });
                        break;
                    case DragTarget.TRACK:
                    case DragTarget.PLAYLIST_TRACK: {
                        const ids = dragData.id;
                        const items = await getDbItems(LibraryItemType.TRACK, ids);

                        PlayerController.call({
                            cmd: {
                                addToQueueByData: {
                                    data: items as TrackItem[],
                                    type: {
                                        edge,
                                        uniqueId: id,
                                    },
                                },
                            },
                        });
                        break;
                    }
                    case DragTarget.PLAYLIST:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: dragData.id,
                                    itemType: LibraryItemType.PLAYLIST,
                                    type: { edge, uniqueId: id },
                                },
                            },
                        });
                        break;
                    case DragTarget.GENRE:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: dragData.id,
                                    itemType: LibraryItemType.GENRE,
                                    type: { edge, uniqueId: id },
                                },
                            },
                        });
                        break;
                    case DragTarget.ALBUM_ARTIST:
                    case DragTarget.ARTIST:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: dragData.id,
                                    itemType: LibraryItemType.ALBUM_ARTIST,
                                    type: { edge, uniqueId: id },
                                },
                            },
                        });
                        break;
                }
            }
        },
        [data],
    );

    const handleItemDragData = useCallback(
        (args: { id: string; index: number; item: PlayQueueItem; selectedIds: string[] }) => {
            const items: TrackItem[] = [];

            for (const item of data) {
                if (args.selectedIds.includes(item._uniqueId)) {
                    items.push(item);
                }
            }

            return dndUtils.generateDragData({
                id: args.selectedIds,
                item: items,
                operation: [DragOperation.REORDER],
                type: DragTarget.QUEUE_TRACK,
            });
        },
        [data],
    );

    const handleItemContextMenu = useCallback(
        (
            args: {
                id: string;
                index: number;
                item: PlayQueueItem;
                selectedIds: string[];
            },
            e: MouseEvent<HTMLDivElement | HTMLButtonElement>,
        ) => {
            const items: PlayQueueItem[] = [];

            for (const item of data) {
                if (args.selectedIds.includes(item._uniqueId)) {
                    items.push(item);
                }
            }

            ContextMenuController.call({
                cmd: { items, type: 'queue' },
                event: e,
            });
        },
        [data],
    );

    const handleItemDoubleClick = useCallback(
        (args: { id: string; index: number; item: PlayQueueItem }) => {
            const { id, index } = args;

            itemTableRef.current?.scrollToIndex({
                align: 'start',
                behavior: 'smooth',
                index,
                offset: -50,
            });

            PlayerController.call({ cmd: { mediaPlay: { id } } });
        },
        [itemTableRef],
    );

    const getItemId = useCallback((_index: number, item: PlayQueueItem) => {
        return item._uniqueId;
    }, []);

    if (data.length === 0) {
        return <EmptyQueue />;
    }

    return (
        <GroupedItemTable<PlayQueueItem, PlayQueueItem>
            ItemComponent={PlayQueueTableItem}
            columnOrder={columnOrder}
            columns={columns}
            context={{ libraryId, listKey: 'queue' }}
            data={data}
            enableDragItem={true}
            enableHeader={false}
            enableMultiRowSelection={true}
            getItemId={getItemId}
            groups={groups}
            itemCount={data.length}
            itemType={LibraryItemType.QUEUE_TRACK}
            virtuosoRef={itemTableRef}
            onChangeColumnOrder={setColumnOrder}
            onItemContextMenu={handleItemContextMenu}
            onItemDoubleClick={handleItemDoubleClick}
            onItemDragData={handleItemDragData}
            onItemDrop={handleItemDrop}
        />
    );
}

function EmptyQueue() {
    const ref = useRef<HTMLDivElement>(null);

    const [isDraggedOver, setIsDraggedOver] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        return dropTargetForElements({
            canDrop: (args) => {
                const data = args.source.data as DragData<unknown>;
                return dndUtils.isDropTarget(data.type, [
                    DragTarget.ALBUM,
                    DragTarget.ALBUM_ARTIST,
                    DragTarget.ARTIST,
                    DragTarget.PLAYLIST,
                    DragTarget.TRACK,
                    DragTarget.PLAYLIST_TRACK,
                    DragTarget.GENRE,
                ]);
            },
            element: ref.current,
            onDragEnter: () => setIsDraggedOver(true),
            onDragLeave: () => setIsDraggedOver(false),
            onDrop: async (args) => {
                const type = dndUtils.dropType({
                    data: args.source.data as DragData<unknown>,
                });

                const dragData = args.source.data as DragData<unknown>;

                switch (type) {
                    case DragTarget.ALBUM:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: dragData.id,
                                    itemType: LibraryItemType.ALBUM,
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                    case DragTarget.TRACK:
                    case DragTarget.PLAYLIST_TRACK: {
                        const ids = dragData.id;
                        const items = await getDbItems(LibraryItemType.TRACK, ids);

                        PlayerController.call({
                            cmd: {
                                addToQueueByData: {
                                    data: (items as (TrackItem | undefined)[]).filter(
                                        (item) => item !== undefined,
                                    ) as TrackItem[],
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                    }
                    case DragTarget.PLAYLIST:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: dragData.id,
                                    itemType: LibraryItemType.PLAYLIST,
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                    case DragTarget.GENRE:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: dragData.id,
                                    itemType: LibraryItemType.GENRE,
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                    case DragTarget.ALBUM_ARTIST:
                    case DragTarget.ARTIST:
                        PlayerController.call({
                            cmd: {
                                addToQueueByFetch: {
                                    id: dragData.id,
                                    itemType: LibraryItemType.ALBUM_ARTIST,
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
                }

                setIsDraggedOver(false);
            },
        });
    }, [ref]);

    const classNames = clsx(styles.emptyQueue, {
        [styles.isDraggedOver]: isDraggedOver,
    });

    return (
        <Center ref={ref} className={classNames}>
            <Text>No items in queue</Text>
        </Center>
    );
}
