import { useEffect, useMemo, useState } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useParams } from 'react-router-dom';
import type { PlayQueueItem } from '@/api/api-types.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { subscribePlayerQueue, usePlayerActions } from '@/features/player/stores/player-store.tsx';
import { Button } from '@/features/ui/button/button.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { ItemListColumn, type ItemListColumnOrder } from '@/features/ui/item-list/helpers.ts';
import { GroupedItemTable } from '@/features/ui/item-list/item-table/grouped-item-table.tsx';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
import type { ItemTableRowDrop } from '@/features/ui/item-list/item-table/item-table.tsx';
import { Menu } from '@/features/ui/menu/menu.tsx';
import { DragOperation, DragTarget } from '@/utils/drag-drop.ts';
import styles from './side-play-queue.module.scss';

interface SidePlayQueueTableItemContext {
    baseUrl: string;
    libraryId: string;
}

export function SidePlayQueue() {
    const baseUrl = useAuthBaseUrl();
    const { libraryId } = useParams() as { libraryId: string };

    const { getQueue } = usePlayerActions();

    useEffect(() => {
        const setQueue = () => {
            const queue = getQueue();

            setData(() => {
                const newData = new Map();
                queue.items.forEach((item, index) => {
                    newData.set(index, item);
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
    }, [getQueue]);

    const [data, setData] = useState<Map<number, PlayQueueItem>>(new Map());
    const [groups, setGroups] = useState<{ count: number; name: string }[]>([]);

    const tableContext = useMemo(() => ({ baseUrl, libraryId }), [baseUrl, libraryId]);

    const [columnOrder, setColumnOrder] = useState<ItemListColumnOrder>([
        ItemListColumn.STANDALONE_COMBINED,
        ItemListColumn.DURATION,
    ]);

    const { columns } = useItemTable<PlayQueueItem>(columnOrder, setColumnOrder);

    const onRowDrop = (args: ItemTableRowDrop) => {
        const { edge, data, uniqueId } = args;

        // TODO: Handle reorder operations
        if (data.operation?.includes(DragOperation.ADD)) {
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
                // case DragTarget.TRACK:
                //     PlayerController.call({
                //         cmd: {
                //             addToQueueByFetch: {
                //                 id: data.id,
                //                 itemType: LibraryItemType.TRACK,
                //                 type: {
                //                     edge: 'bottom',
                //                     uniqueId: data.id,
                //                 },
                //             },
                //         },
                //     });
                //     break;
            }
        }
    };

    const { onRowClick } = useMultiRowSelection<PlayQueueItem>();

    return (
        <GroupedItemTable<PlayQueueItem, SidePlayQueueTableItemContext>
            columnOrder={columnOrder}
            columns={columns}
            context={tableContext}
            data={data}
            enableHeader={false}
            enableMultiRowSelection={true}
            enableRowSelection={true}
            groups={groups}
            itemCount={data.size}
            itemType={LibraryItemType.TRACK}
            onChangeColumnOrder={setColumnOrder}
            onRowClick={onRowClick}
            onRowDrop={onRowDrop}
        />
    );
}

export function SidePlayQueueContainer() {
    return (
        <div className={styles.container}>
            <Group className={styles.header} gap="sm" justify="between">
                <Button size="md" variant="default">
                    Queue
                </Button>
                <QueueControls />
            </Group>
            <div className={styles.content}>
                <SidePlayQueue />
            </div>
        </div>
    );
}

export function QueueControls() {
    const handleClear = () => {
        PlayerController.call({ cmd: { clearQueue: null } });
    };

    return (
        <Group gap="sm" justify="center" p="sm">
            <Menu>
                <Menu.Target>
                    <IconButton icon="ellipsisHorizontal" size="sm" />
                </Menu.Target>
                <Menu.Content>
                    <Menu.Item>Select all</Menu.Item>
                    <Menu.Item>Deselect all</Menu.Item>
                    <Menu.Item>Move selected to top</Menu.Item>
                    <Menu.Item>Move selected to bottom</Menu.Item>
                    <Menu.Item>Move selected to next</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item>Clear selected</Menu.Item>
                    <Menu.Item onSelect={handleClear}>Clear all</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item>Shuffle selected</Menu.Item>
                    <Menu.Item>Shuffle all</Menu.Item>
                    <Menu.Divider />
                    <Menu.Submenu>
                        <Menu.SubmenuTarget>
                            <Menu.Item rightIcon="arrowRightS">Group By</Menu.Item>
                        </Menu.SubmenuTarget>
                        <Menu.SubmenuContent>
                            <Menu.Item>None</Menu.Item>
                            <Menu.Item>Album</Menu.Item>
                            <Menu.Item>Artist</Menu.Item>
                            <Menu.Item>Genre</Menu.Item>
                        </Menu.SubmenuContent>
                    </Menu.Submenu>
                </Menu.Content>
            </Menu>
        </Group>
    );
}
