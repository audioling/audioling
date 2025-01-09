import { useCallback, useRef, useState } from 'react';
import type { Table } from '@tanstack/react-table';
import { useParams } from 'react-router';
import { initSimpleImg } from 'react-simple-img';
import type { PlayQueueItem } from '@/api/api-types.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { PlayQueueTable } from '@/features/player/now-playing/play-queue-table.tsx';
import type { QueueGroupingProperty } from '@/features/player/stores/player-store.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import type { ItemTableHandle } from '@/features/ui/item-list/item-table/item-table.tsx';
import { Menu } from '@/features/ui/menu/menu.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './side-play-queue.module.scss';

initSimpleImg({ threshold: 0.05 }, true);

export function SidePlayQueue() {
    const baseUrl = useAuthBaseUrl();
    const { libraryId } = useParams() as { libraryId: string };

    const itemTableRef = useRef<ItemTableHandle<PlayQueueItem> | undefined>(undefined);
    const [groupBy, setGroupBy] = useState<QueueGroupingProperty | undefined>(undefined);

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
                <PlayQueueTable baseUrl={baseUrl} groupBy={groupBy} libraryId={libraryId} />
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
