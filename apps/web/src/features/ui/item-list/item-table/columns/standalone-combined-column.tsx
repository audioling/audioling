import { LibraryItemType } from '@repo/shared-types';
import clsx from 'clsx';
import type { PlayQueueItem, TrackItem } from '@/api/api-types.ts';
import { useCurrentTrack } from '@/features/player/stores/player-store.tsx';
import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { CellSkeleton, EmptyCell } from '@/features/ui/item-list/item-table/columns/shared.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

function Cell(props: ItemListCellProps) {
    if (!props.item) {
        return <CellSkeleton height={20} width={100} />;
    }

    switch (props.itemType) {
        case LibraryItemType.TRACK:
        case LibraryItemType.PLAYLIST_TRACK:
            return <TrackCell {...props} />;
        case LibraryItemType.QUEUE_TRACK:
            return <QueueTrackCell {...props} />;
        default:
            return <DefaultCell {...props} />;
    }
}

function DefaultCell({ item }: ItemListCellProps) {
    if (typeof item === 'object' && item) {
        if (
            'name' in item &&
            typeof item.name === 'string' &&
            'artists' in item &&
            Array.isArray(item.artists)
        ) {
            return (
                <div className={styles.standaloneCombined}>
                    <div className={styles.inner}>
                        <Text>{item.name}</Text>
                        {item.artists.length ? (
                            <Text isSecondary>
                                {item.artists.map((artist) => artist.name).join(', ')}
                            </Text>
                        ) : (
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
            'name' in item &&
            typeof item.name === 'string' &&
            'artists' in item &&
            Array.isArray(item.artists)
        ) {
            return (
                <div className={styles.standaloneCombined}>
                    <div className={styles.inner}>
                        <Text className={clsx({ [styles.playing]: isPlaying })}>{item.name}</Text>
                        {item.artists.length ? (
                            <Text isSecondary>
                                {item.artists.map((artist) => artist.name).join(', ')}
                            </Text>
                        ) : (
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
            'name' in item &&
            typeof item.name === 'string' &&
            'artists' in item &&
            Array.isArray(item.artists)
        ) {
            return (
                <div className={styles.standaloneCombined}>
                    <div className={styles.inner}>
                        <Text className={clsx({ [styles.playing]: isPlaying })}>{item.name}</Text>
                        {item.artists.length ? (
                            <Text isSecondary>
                                {item.artists.map((artist) => artist.name).join(', ')}
                            </Text>
                        ) : (
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
