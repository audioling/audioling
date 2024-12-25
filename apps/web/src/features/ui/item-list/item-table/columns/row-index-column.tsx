import { memo } from 'react';
import type { ColumnHelper, Row } from '@tanstack/react-table';
import clsx from 'clsx';
import type { PlayQueueItem } from '@/api/api-types.ts';
import { PlayerStatus, usePlayerStore } from '@/features/player/stores/player-store.tsx';
import { SoundBars } from '@/features/ui/icon/sound-bars.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

export function rowIndexColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: MemoizedCell,
        header: '#',
        id: 'rowIndex',
        size: itemListHelpers.table.numberToColumnSize(60, 'px'),
    });
}

function Cell<T>({
    row,
    context,
}: {
    context: { currentTrack: PlayQueueItem | undefined };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    row: Row<T | any>;
}) {
    const isPlaying = row.id === context?.currentTrack?._uniqueId;
    const bpm = context?.currentTrack?.bpm || undefined;
    const status = usePlayerStore.use.player().status;

    return (
        <Text
            isCentered
            isSecondary
            className={clsx(styles.cell, {
                [styles.playing]: isPlaying,
            })}
        >
            {isPlaying ? (
                <>
                    <SoundBars bpm={bpm} isPlaying={status === PlayerStatus.PLAYING} />
                </>
            ) : (
                row.index + 1
            )}
        </Text>
    );
}

const MemoizedCell = memo(Cell);
