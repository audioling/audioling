import type { PlayQueueItem, TrackItem } from '/@/app-types';
import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { Text } from '@mantine/core';
import { localize } from '@repo/localization';
import { ServerItemType } from '@repo/shared-types/app-types';
import clsx from 'clsx';
import styles from './column.module.css';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';
import { useCurrentTrack } from '/@/stores/player-store';

function Cell(props: ItemListCellProps) {
    const { data, itemType } = props;

    if (!data) {
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

function DefaultCell({ data }: ItemListCellProps) {
    if (typeof data === 'object' && data) {
        if (
            'name' in data
            && typeof data.name === 'string'
            && 'artists' in data
            && Array.isArray(data.artists)
        ) {
            return (
                <div className={styles.standaloneCombined}>
                    <div className={styles.inner}>
                        <Text>{data.name}</Text>
                        {data.artists.length
                            ? (
                                    <Text variant="secondary">
                                        {data.artists.map(artist => artist.name).join(', ')}
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

function QueueTrackCell({ data }: ItemListCellProps) {
    const { track } = useCurrentTrack();
    const cellItem = data as PlayQueueItem | undefined;
    const isPlaying = track !== undefined && cellItem?._uniqueId === track?._uniqueId;

    if (typeof data === 'object' && data) {
        if (
            'name' in data
            && typeof data.name === 'string'
            && 'artists' in data
            && Array.isArray(data.artists)
        ) {
            return (
                <div className={styles.standaloneCombined}>
                    <div className={styles.inner}>
                        <Text className={clsx({ [styles.playing]: isPlaying })}>{data.name}</Text>
                        {data.artists.length
                            ? (
                                    <Text variant="secondary">
                                        {data.artists.map(artist => artist.name).join(', ')}
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

function TrackCell({ data }: ItemListCellProps) {
    const { track } = useCurrentTrack();
    const cellItem = data as TrackItem | undefined;
    const isPlaying = track !== undefined && cellItem?.id === track?.id;

    if (typeof data === 'object' && data) {
        if (
            'name' in data
            && typeof data.name === 'string'
            && 'artists' in data
            && Array.isArray(data.artists)
        ) {
            return (
                <div className={styles.standaloneCombined}>
                    <div className={styles.inner}>
                        <Text className={clsx({ [styles.playing]: isPlaying })}>{data.name}</Text>
                        {data.artists.length
                            ? (
                                    <Text variant="secondary">
                                        {data.artists.map(artist => artist.name).join(', ')}
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
    header: () => <HeaderCell>{localize.t('app.itemList.columns.name', { context: 'label' })}</HeaderCell>,
    id: 'combined' as ItemListColumn.STANDALONE_COMBINED,
    size: numberToColumnSize(1, 'fr'),
};
