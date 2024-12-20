import type { MouseEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import type { Row, Table } from '@tanstack/react-table';
import { useParams } from 'react-router';
import type { PlayQueueItem, TrackItem } from '@/api/api-types.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { ContextMenuController } from '@/features/controllers/context-menu/context-menu-controller.tsx';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import type { QueueGroupingProperty } from '@/features/player/stores/player-store.tsx';
import {
    subscribePlayerQueue,
    useCurrentTrack,
    usePlayerActions,
} from '@/features/player/stores/player-store.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { ItemListColumn, type ItemListColumnOrder } from '@/features/ui/item-list/helpers.ts';
import type { GroupedItemTableHandle } from '@/features/ui/item-list/item-table/grouped-item-table.tsx';
import { GroupedItemTable } from '@/features/ui/item-list/item-table/grouped-item-table.tsx';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
import type { ItemTableRowDrop } from '@/features/ui/item-list/item-table/item-table.tsx';
import { Menu } from '@/features/ui/menu/menu.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import { DragOperation, DragTarget } from '@/utils/drag-drop.ts';
import styles from './side-play-queue.module.scss';

interface SidePlayQueueTableItemContext {
    baseUrl: string;
    currentTrack: PlayQueueItem | undefined;
    libraryId: string;
}

export function SidePlayQueue() {
    const baseUrl = useAuthBaseUrl();
    const { libraryId } = useParams() as { libraryId: string };

    const { getQueue } = usePlayerActions();

    const [groupBy, setGroupBy] = useState<QueueGroupingProperty | undefined>(undefined);

    useEffect(() => {
        const setQueue = () => {
            const queue = getQueue(groupBy) || { groups: [], items: [] };

            setData((prevData) => {
                const newData = [...prevData];
                queue.items.forEach((item, index) => {
                    newData[index] = item;
                });
                return newData;
            });

            setGroups(queue.groups);
        };

        const unsub = subscribePlayerQueue(() => {
            setQueue();
        });

        setQueue();

        return () => unsub();
    }, [getQueue, groupBy]);

    const [data, setData] = useState<PlayQueueItem[]>([]);
    const [groups, setGroups] = useState<{ count: number; name: string }[]>([]);

    const { track } = useCurrentTrack();

    const tableContext = useMemo(
        () => ({ baseUrl, currentTrack: track, libraryId }),
        [baseUrl, track, libraryId],
    );

    const [columnOrder, setColumnOrder] = useState<ItemListColumnOrder>([
        ItemListColumn.ROW_INDEX,
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
                    PlayerController.call({
                        cmd: {
                            addToQueueByData: {
                                data: (data.metadata?.items as TrackItem[]) || [],
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
            }
        }
    };

    const { onRowClick } = useMultiRowSelection<PlayQueueItem>();

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

    const itemTableRef = useRef<GroupedItemTableHandle<PlayQueueItem> | undefined>(undefined);

    return (
        <div className={styles.container}>
            <Group align="center" className={styles.header} gap="sm" justify="between">
                <Text>Queue</Text>
                <QueueControls
                    groupBy={groupBy}
                    table={itemTableRef.current?.getTable() ?? undefined}
                    onGroupBy={setGroupBy}
                />
            </Group>
            <div className={styles.content}>
                <GroupedItemTable<PlayQueueItem, SidePlayQueueTableItemContext>
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
                    itemTableRef={itemTableRef}
                    itemType={LibraryItemType.TRACK}
                    rowIdProperty="_uniqueId"
                    onChangeColumnOrder={setColumnOrder}
                    onRowClick={onRowClick}
                    onRowContextMenu={onRowContextMenu}
                    onRowDrop={onRowDrop}
                />
            </div>
        </div>
    );
}

SidePlayQueue.displayName = 'SidePlayQueue';

export function QueueControls({
    table,
    onGroupBy,
    groupBy,
}: {
    groupBy: QueueGroupingProperty | undefined;
    onGroupBy: (value: QueueGroupingProperty | undefined) => void;
    table?: Table<PlayQueueItem | undefined>;
}) {
    const handleClear = useCallback(() => {
        PlayerController.call({ cmd: { clearQueue: null } });
    }, []);

    const handleClearSelected = useCallback(() => {
        if (!table) {
            return;
        }

        PlayerController.call({
            cmd: {
                clearSelected: {
                    items: table
                        .getSelectedRowModel()
                        .rows.map((row) => row.original)
                        .filter((item): item is PlayQueueItem => item !== undefined),
                },
            },
        });
    }, [table]);

    const handleSelect = useCallback(
        (value: boolean) => {
            if (!table) {
                return;
            }

            table.getRowModel().rows.forEach((row) => {
                row.toggleSelected(value);
            });
        },
        [table],
    );

    const handleMoveToTop = useCallback(() => {
        if (!table) {
            return;
        }

        const rows = table.getSelectedRowModel().rows;

        PlayerController.call({
            cmd: {
                moveSelectedToTop: {
                    items: rows
                        .map((row) => row.original)
                        .filter((item): item is PlayQueueItem => item !== undefined),
                },
            },
        });
    }, [table]);

    const handleMoveToBottom = useCallback(() => {
        if (!table) {
            return;
        }

        const rows = table.getSelectedRowModel().rows;

        PlayerController.call({
            cmd: {
                moveSelectedToBottom: {
                    items: rows
                        .map((row) => row.original)
                        .filter((item): item is PlayQueueItem => item !== undefined),
                },
            },
        });
    }, [table]);

    const handleMoveToNext = useCallback(() => {
        if (!table) {
            return;
        }

        const rows = table.getSelectedRowModel().rows;

        PlayerController.call({
            cmd: {
                moveSelectedToNext: {
                    items: rows
                        .map((row) => row.original)
                        .filter((item): item is PlayQueueItem => item !== undefined),
                },
            },
        });
    }, [table]);

    const handleGroupBy = useCallback(
        (value: QueueGroupingProperty | undefined) => {
            onGroupBy(value);
        },
        [onGroupBy],
    );

    return (
        <Group gap="sm" justify="center">
            <Menu>
                <Menu.Target>
                    <IconButton icon="ellipsisHorizontal" size="sm" />
                </Menu.Target>
                <Menu.Content>
                    <Menu.Item onSelect={() => handleSelect(true)}>Select all</Menu.Item>
                    <Menu.Item onSelect={() => handleSelect(false)}>Select none</Menu.Item>
                    <Menu.Divider />
                    <Menu.Submenu>
                        <Menu.SubmenuTarget>
                            <Menu.Item rightIcon="arrowRightS">Remove</Menu.Item>
                        </Menu.SubmenuTarget>
                        <Menu.SubmenuContent>
                            <Menu.Item onSelect={handleClearSelected}>Selected</Menu.Item>
                            <Menu.Item onSelect={handleClear}>All</Menu.Item>
                        </Menu.SubmenuContent>
                    </Menu.Submenu>
                    <Menu.Submenu>
                        <Menu.SubmenuTarget>
                            <Menu.Item rightIcon="arrowRightS">Shuffle</Menu.Item>
                        </Menu.SubmenuTarget>
                        <Menu.SubmenuContent>
                            <Menu.Item>Selected</Menu.Item>
                            <Menu.Item>All</Menu.Item>
                        </Menu.SubmenuContent>
                    </Menu.Submenu>
                    <Menu.Submenu>
                        <Menu.SubmenuTarget>
                            <Menu.Item rightIcon="arrowRightS">Move to</Menu.Item>
                        </Menu.SubmenuTarget>
                        <Menu.SubmenuContent>
                            <Menu.Item leftIcon="arrowRightS" onSelect={handleMoveToNext}>
                                Next
                            </Menu.Item>
                            <Menu.Item leftIcon="arrowUpToLine" onSelect={handleMoveToTop}>
                                Top
                            </Menu.Item>
                            <Menu.Item leftIcon="arrowDownToLine" onSelect={handleMoveToBottom}>
                                Bottom
                            </Menu.Item>
                        </Menu.SubmenuContent>
                    </Menu.Submenu>
                    <Menu.Divider />
                    <Menu.Submenu>
                        <Menu.SubmenuTarget>
                            <Menu.Item rightIcon="arrowRightS">Group By</Menu.Item>
                        </Menu.SubmenuTarget>
                        <Menu.SubmenuContent>
                            <Menu.Item
                                isSelected={groupBy === undefined}
                                onSelect={() => handleGroupBy(undefined)}
                            >
                                None
                            </Menu.Item>
                            <Menu.Item
                                isSelected={groupBy === 'album'}
                                onSelect={() => handleGroupBy('album')}
                            >
                                Album
                            </Menu.Item>
                            <Menu.Item
                                disabled
                                isSelected={groupBy === 'artists'}
                                onSelect={() => handleGroupBy('artists')}
                            >
                                Artist
                            </Menu.Item>
                            <Menu.Item
                                disabled
                                isSelected={groupBy === 'genres'}
                                onSelect={() => handleGroupBy('genres')}
                            >
                                Genre
                            </Menu.Item>
                        </Menu.SubmenuContent>
                    </Menu.Submenu>
                </Menu.Content>
            </Menu>
        </Group>
    );
}
