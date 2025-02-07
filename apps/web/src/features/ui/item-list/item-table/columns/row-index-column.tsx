import { LibraryItemType } from '@repo/shared-types';
import clsx from 'clsx';
import type { PlayQueueItem, TrackItem } from '@/api/api-types.ts';
import {
    PlayerStatus,
    useCurrentTrack,
    usePlayerStatus,
} from '@/features/player/stores/player-store.tsx';
import { Icon } from '@/features/ui/icon/icon.tsx';
import { SoundBars } from '@/features/ui/icon/sound-bars.tsx';
import type { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { type ItemListCellProps, numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

function Cell(props: ItemListCellProps) {
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

function DefaultCell({ index, startIndex }: ItemListCellProps) {
    return (
        <Text isCentered isSecondary className={styles.cell}>
            {index + (startIndex ?? 0) + 1}
        </Text>
    );
}

function TrackCell({ index, startIndex, item }: ItemListCellProps) {
    const { track } = useCurrentTrack();
    const cellItem = item as TrackItem | undefined;
    const isPlaying = track !== undefined && cellItem?.id === track?.id;

    return (
        <Text
            isCentered
            isSecondary
            className={clsx(styles.cell, {
                [styles.playing]: isPlaying,
            })}
        >
            {index + (startIndex ?? 0) + 1}
        </Text>
    );
}

function QueueTrackCell({ index, item }: ItemListCellProps) {
    const { track } = useCurrentTrack();
    const cellItem = item as PlayQueueItem | undefined;
    const isPlaying = track !== undefined && cellItem?._uniqueId === track?._uniqueId;
    const status = usePlayerStatus();

    return (
        <Text
            isCentered
            isSecondary
            className={clsx(styles.cell, {
                [styles.playing]: isPlaying,
            })}
        >
            {!isPlaying ? index + 1 : <SoundBars isPlaying={status === PlayerStatus.PLAYING} />}
        </Text>
    );
}

export const rowIndexColumn = {
    cell: Cell,
    header: () => <Icon icon="hash" />,
    id: 'rowIndex' as ItemListColumn.ROW_INDEX,
    size: numberToColumnSize(60, 'px'),
};
