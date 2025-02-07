import type { MutableRefObject } from 'react';
import { useCallback, useRef } from 'react';
import { useParams } from 'react-router';
import { initSimpleImg } from 'react-simple-img';
import type { PlayQueueItem } from '@/api/api-types.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { PlayQueueTable } from '@/features/player/now-playing/play-queue-table.tsx';
import type { QueueGroupingProperty } from '@/features/player/stores/player-store.tsx';
import { useSettingsStore } from '@/features/settings/store/settings-store.ts';
import { trackColumnOptions } from '@/features/tracks/list/track-list-header.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import type { ItemListColumnOrder } from '@/features/ui/item-list/helpers.ts';
import type { ItemTableHandle } from '@/features/ui/item-list/item-table/item-table.tsx';
import { Menu } from '@/features/ui/menu/menu.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './side-play-queue.module.scss';

initSimpleImg({ threshold: 0.05 }, true);

export function SidePlayQueue() {
    const baseUrl = useAuthBaseUrl();
    const { libraryId } = useParams() as { libraryId: string };

    const itemTableRef = useRef<ItemTableHandle | undefined>(undefined);

    const columnOrder = useSettingsStore.use.player().sideQueue.columnOrder;
    const groupBy = useSettingsStore.use.player().sideQueue.groupBy;
    const setSettings = useSettingsStore.use.setState();

    const setGroupBy = (value: QueueGroupingProperty | undefined) => {
        setSettings(['player', 'sideQueue', 'groupBy'], value);
    };

    const setColumnOrder = (columnOrder: ItemListColumnOrder) => {
        setSettings(['player', 'sideQueue', 'columnOrder'], columnOrder);
    };

    return (
        <div className={styles.container}>
            <Group align="center" className={styles.header} gap="sm" justify="between">
                <Text isNoSelect>Queue</Text>
                <QueueControls
                    columnOrder={columnOrder}
                    groupBy={groupBy}
                    itemTableRef={itemTableRef}
                    items={[]}
                    setColumnOrder={setColumnOrder}
                    onGroupBy={setGroupBy}
                />
            </Group>
            <div className={styles.content}>
                <PlayQueueTable
                    baseUrl={baseUrl}
                    columnOrder={columnOrder}
                    groupBy={groupBy}
                    itemTableRef={itemTableRef}
                    libraryId={libraryId}
                    setColumnOrder={setColumnOrder}
                />
            </div>
        </div>
    );
}

SidePlayQueue.displayName = 'SidePlayQueue';

export function QueueControls({
    columnOrder,
    setColumnOrder,
    groupBy,
    itemTableRef,
    items,
    onGroupBy,
}: {
    columnOrder: ItemListColumnOrder;
    groupBy: QueueGroupingProperty | undefined;
    itemTableRef: MutableRefObject<ItemTableHandle | undefined>;
    items: PlayQueueItem[];
    onGroupBy: (value: QueueGroupingProperty | undefined) => void;
    setColumnOrder: (columnOrder: ItemListColumnOrder) => void;
}) {
    const handleClear = useCallback(() => {
        PlayerController.call({ cmd: { clearQueue: null } });
    }, []);

    const handleClearSelected = useCallback(() => {
        PlayerController.call({
            cmd: {
                clearSelected: {
                    items,
                },
            },
        });
    }, [items]);

    const handleSelectAll = useCallback(() => {
        itemTableRef.current?.selectAll();
    }, [itemTableRef]);

    const handleMoveToTop = useCallback(() => {
        PlayerController.call({
            cmd: {
                moveSelectedToTop: {
                    items,
                },
            },
        });
    }, [items]);

    const handleMoveToBottom = useCallback(() => {
        PlayerController.call({
            cmd: {
                moveSelectedToBottom: {
                    items,
                },
            },
        });
    }, [items]);

    const handleMoveToNext = useCallback(() => {
        PlayerController.call({
            cmd: {
                moveSelectedToNext: {
                    items,
                },
            },
        });
    }, [items]);

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
                    <Menu.Item onSelect={handleSelectAll}>Select all</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item leftIcon="remove" onSelect={handleClearSelected}>
                        Remove selected
                    </Menu.Item>
                    <Menu.Item leftIcon="remove" onSelect={handleClear}>
                        Remove all
                    </Menu.Item>
                    <Menu.Divider />
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
                            <Menu.Item leftIcon="arrowDownToLine" onSelect={handleMoveToBottom}>
                                Bottom
                            </Menu.Item>
                            <Menu.Item leftIcon="arrowUpToLine" onSelect={handleMoveToTop}>
                                Top
                            </Menu.Item>
                        </Menu.SubmenuContent>
                    </Menu.Submenu>
                    <Menu.Divider />
                    <Menu.Submenu>
                        <Menu.SubmenuTarget>
                            <Menu.Item rightIcon="arrowRightS">Columns</Menu.Item>
                        </Menu.SubmenuTarget>
                        <Menu.SubmenuContent>
                            {trackColumnOptions.map((option) => (
                                <Menu.Item
                                    key={`sort-${option.value}`}
                                    isSelected={columnOrder.includes(option.value)}
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        const uniqueColumns = [
                                            ...new Set([...columnOrder, option.value]),
                                        ];

                                        if (columnOrder.includes(option.value)) {
                                            setColumnOrder(
                                                uniqueColumns.filter((c) => c !== option.value),
                                            );
                                        } else {
                                            setColumnOrder(uniqueColumns);
                                        }
                                    }}
                                >
                                    {option.label}
                                </Menu.Item>
                            ))}
                        </Menu.SubmenuContent>
                    </Menu.Submenu>
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
