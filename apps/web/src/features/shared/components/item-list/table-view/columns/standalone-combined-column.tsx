import type { PlayQueueItem, TrackItem } from '/@/app-types';
import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { Text } from '@mantine/core';
import { ServerItemType } from '@repo/shared-types/app-types';
import clsx from 'clsx';
import styles from './column.module.css';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';
import { useCurrentTrack } from '/@/stores/player-store';

function Cell(props: ItemListCellProps) {
    const { item, itemType } = props;

    if (!item) {
        return <CellSkeleton height={20} width={100} />;
    }

    switch (itemType) {
        case ServerItemType.TRACK:
        case ServerItemType.PLAYLIST_TRACK:
            return <TrackCell {...props} />;
        case ServerItemType.QUEUE_TRACK:
            return <QueueTrackCell {...props} />;
        default:
            return <DefaultCell {...props} />;
    }
}

function DefaultCell({ item }: ItemListCellProps) {
    if (typeof item === 'object' && item) {
        if (
            'name' in item
            && typeof item.name === 'string'
            && 'artists' in item
            && Array.isArray(item.artists)
        ) {
            return (
                <div className={styles.standaloneCombined}>
                    <div className={styles.inner}>
                        <Text>{item.name}</Text>
                        {item.artists.length
                            ? (
                                    <Text isSecondary>
                                        {item.artists.map(artist => artist.name).join(', ')}
                                    </Text>
                                )
                            : (
                                    <Text>&nbsp;</Text>
                                )}
                    </div>
                </div>
            );
        }
    }

    return <EmptyCell />;
}

function QueueTrackCell({ item }: ItemListCellProps) {
    const { track } = useCurrentTrack();
    const cellItem = item as PlayQueueItem | undefined;
    const isPlaying = track !== undefined && cellItem?._uniqueId === track?._uniqueId;

    if (typeof item === 'object' && item) {
        if (
            'name' in item
            && typeof item.name === 'string'
            && 'artists' in item
            && Array.isArray(item.artists)
        ) {
            return (
                <div className={styles.standaloneCombined}>
                    <div className={styles.inner}>
                        <Text className={clsx({ [styles.playing]: isPlaying })}>{item.name}</Text>
                        {item.artists.length
                            ? (
                                    <Text isSecondary>
                                        {item.artists.map(artist => artist.name).join(', ')}
                                    </Text>
                                )
                            : (
                                    <Text>&nbsp;</Text>
                                )}
                    </div>
                </div>
            );
        }
    }

    return <EmptyCell />;
}

function TrackCell({ item }: ItemListCellProps) {
    const { track } = useCurrentTrack();
    const cellItem = item as TrackItem | undefined;
    const isPlaying = track !== undefined && cellItem?.id === track?.id;

    if (typeof item === 'object' && item) {
        if (
            'name' in item
            && typeof item.name === 'string'
            && 'artists' in item
            && Array.isArray(item.artists)
        ) {
            return (
                <div className={styles.standaloneCombined}>
                    <div className={styles.inner}>
                        <Text className={clsx({ [styles.playing]: isPlaying })}>{item.name}</Text>
                        {item.artists.length
                            ? (
                                    <Text isSecondary>
                                        {item.artists.map(artist => artist.name).join(', ')}
                                    </Text>
                                )
                            : (
                                    <Text>&nbsp;</Text>
                                )}
                    </div>
                </div>
            );
        }
    }

    return <EmptyCell />;
}

export const standaloneCombinedColumn = {
    cell: Cell,
    header: () => <Text isUppercase>Name</Text>,
    id: 'combined' as ItemListColumn.STANDALONE_COMBINED,
    size: numberToColumnSize(1, 'fr'),
};
