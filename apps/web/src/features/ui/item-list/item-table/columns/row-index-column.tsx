import type { ColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { SoundBars } from '@/features/ui/icon/sound-bars.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

export function rowIndexColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const isPlaying = row.id === context?.currentTrack?._uniqueId;
            const bpm = context?.currentTrack?.bpm || undefined;

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
                            <SoundBars bpm={bpm} />
                        </>
                    ) : (
                        row.index + 1
                    )}
                </Text>
            );
        },
        header: '#',
        id: 'rowIndex',
        size: itemListHelpers.table.numberToColumnSize(60, 'px'),
    });
}
