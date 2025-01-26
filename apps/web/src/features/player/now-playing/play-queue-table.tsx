import type { MouseEvent, MutableRefObject } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { LibraryItemType } from '@repo/shared-types';
import type { Row, Table } from '@tanstack/react-table';
import clsx from 'clsx';
import type { PlayQueueItem, TrackItem } from '@/api/api-types.ts';
import { ContextMenuController } from '@/features/controllers/context-menu/context-menu-controller.tsx';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import type { QueueGroupingProperty } from '@/features/player/stores/player-store.tsx';
import {
    PlayType,
    subscribeCurrentTrack,
    subscribePlayerQueue,
    useCurrentTrack,
    usePlayerActions,
} from '@/features/player/stores/player-store.tsx';
import { Center } from '@/features/ui/center/center.tsx';
import type { ItemListColumnOrder } from '@/features/ui/item-list/helpers.ts';
import { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { GroupedItemTable } from '@/features/ui/item-list/item-table/grouped-item-table.tsx';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
import type {
    ItemTableHandle,
    ItemTableRowDrop,
} from '@/features/ui/item-list/item-table/item-table.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import type { DragData } from '@/utils/drag-drop.ts';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';
import styles from './play-queue-table.module.scss';

interface PlayQueueTableProps {
    baseUrl: string;
    groupBy: QueueGroupingProperty | undefined;
    itemTableRef: MutableRefObject<ItemTableHandle<PlayQueueItem> | undefined>;
    libraryId: string;
}

export function PlayQueueTable({ baseUrl, groupBy, libraryId, itemTableRef }: PlayQueueTableProps) {
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

    const { track } = useCurrentTrack();

    const tableContext = useMemo(
        () => ({ baseUrl, currentTrack: track, libraryId, listKey: 'queue' }),
        [baseUrl, track, libraryId],
    );

    const [columnOrder, setColumnOrder] = useState<ItemListColumnOrder>([
        ItemListColumn.ROW_INDEX,
        ItemListColumn.IMAGE,
        ItemListColumn.STANDALONE_COMBINED,
    ]);

    const { columns } = useItemTable<PlayQueueItem>(columnOrder, setColumnOrder);

    const onRowDrop = (
        _row: Row<PlayQueueItem>,
        table: Table<PlayQueueItem | undefined>,
        args: ItemTableRowDrop<PlayQueueItem>,
    ) => {
        const { edge, data, uniqueId } = args;

        if (data.operation?.includes(DragOperation.REORDER)) {
            const items = table
                .getSelectedRowModel()
                .rows.map((row) => row.original)
                .filter((item): item is PlayQueueItem => item !== undefined);

            PlayerController.call({
                cmd: {
                    moveSelectedTo: {
                        edge: edge as 'top' | 'bottom',
                        items: items,
                        uniqueId,
                    },
                },
            });
            return;
        } else if (data.operation?.includes(DragOperation.ADD)) {
            switch (data.type) {
                case DragTarget.ALBUM:
                    PlayerController.call({
                        cmd: {
                            addToQueueByFetch: {
                                id: data.id,
                                itemType: LibraryItemType.ALBUM,
                                type: {
                                    edge,
                                    uniqueId,
                                },
                            },
                        },
                    });
                    break;
                case DragTarget.TRACK:
                case DragTarget.PLAYLIST_TRACK:
                    PlayerController.call({
                        cmd: {
                            addToQueueByData: {
                                data: (data?.item as TrackItem[]) || [],
                                type: {
                                    edge,
                                    uniqueId,
                                },
                            },
                        },
                    });
                    break;
                case DragTarget.PLAYLIST:
                    PlayerController.call({
                        cmd: {
                            addToQueueByFetch: {
                                id: data.id,
                                itemType: LibraryItemType.PLAYLIST,
                                type: { edge, uniqueId },
                            },
                        },
                    });
                    break;
                case DragTarget.GENRE:
                    PlayerController.call({
                        cmd: {
                            addToQueueByFetch: {
                                id: data.id,
                                itemType: LibraryItemType.GENRE,
                                type: { edge, uniqueId },
                            },
                        },
                    });
                    break;
                case DragTarget.ALBUM_ARTIST:
                case DragTarget.ARTIST:
                    PlayerController.call({
                        cmd: {
                            addToQueueByFetch: {
                                id: data.id,
                                itemType: LibraryItemType.ALBUM_ARTIST,
                                type: { edge, uniqueId },
                            },
                        },
                    });
                    break;
            }
        }
    };

    const { onRowClick } = useMultiRowSelection<PlayQueueItem>();

    const onRowDoubleClick = useCallback(
        (_e: MouseEvent<HTMLDivElement>, row: Row<PlayQueueItem | undefined>) => {
            if (!row || !row.original) {
                return;
            }

            itemTableRef.current?.scrollToIndex({
                align: 'start',
                behavior: 'smooth',
                index: row.index,
                offset: -50,
            });

            PlayerController.call({ cmd: { mediaPlay: { id: row.original?._uniqueId } } });
        },
        [itemTableRef],
    );

    const onRowContextMenu = (
        e: MouseEvent<HTMLDivElement>,
        row: Row<PlayQueueItem | undefined>,
        table: Table<PlayQueueItem | undefined>,
    ) => {
        e.preventDefault();
        e.stopPropagation();

        // If row is not selected, select it
        if (!row.getIsSelected()) {
            table.resetRowSelection();
            row.toggleSelected(true);
        }

        ContextMenuController.call({
            cmd: { table, type: 'queue' },
            event: e,
        });
    };

    const getRowId = useCallback((row: PlayQueueItem | undefined, index: number) => {
        return row?._uniqueId ?? index.toString();
    }, []);

    if (data.length === 0) {
        return <EmptyQueue />;
    }

    return (
        <GroupedItemTable<PlayQueueItem>
            columnOrder={columnOrder}
            columns={columns}
            context={tableContext}
            data={data}
            enableHeader={false}
            enableMultiRowSelection={true}
            enableRowSelection={true}
            getRowId={getRowId}
            groups={groups}
            itemCount={data.length}
            itemType={LibraryItemType.TRACK}
            rowIdProperty="_uniqueId"
            virtuosoRef={itemTableRef}
            onChangeColumnOrder={setColumnOrder}
            onRowClick={onRowClick}
            onRowContextMenu={onRowContextMenu}
            onRowDoubleClick={onRowDoubleClick}
            onRowDrop={onRowDrop}
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
            onDrop: (args) => {
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
                    case DragTarget.PLAYLIST_TRACK:
                        PlayerController.call({
                            cmd: {
                                addToQueueByData: {
                                    data: (dragData?.item as TrackItem[]) || [],
                                    type: PlayType.NOW,
                                },
                            },
                        });
                        break;
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
