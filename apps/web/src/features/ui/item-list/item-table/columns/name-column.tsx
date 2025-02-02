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
        if ('name' in item && typeof item.name === 'string') {
            return (
                <div
                    style={{ display: 'flex', flexDirection: 'column', gap: 'var(--base-gap-sm)' }}
                >
                    <Text className={styles.cell}>{item.name}</Text>
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
        if ('name' in item && typeof item.name === 'string') {
            return (
                <Text
                    className={clsx(styles.cell, {
                        [styles.playing]: isPlaying,
                    })}
                >
                    {item.name}
                </Text>
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
        if ('name' in item && typeof item.name === 'string') {
            return (
                <Text
                    className={clsx(styles.cell, {
                        [styles.playing]: isPlaying,
                    })}
                >
                    {item.name}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const nameColumn = {
    cell: Cell,
    header: () => <Text isUppercase>Name</Text>,
    id: 'name' as ItemListColumn.NAME,
    size: numberToColumnSize(1, 'fr'),
};
