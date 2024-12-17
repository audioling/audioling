import type { ColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

export function nameColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const item = row.original;
            const isPlaying = row.id === context?.currentTrack?._uniqueId;

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

            return <Skeleton height={20} width={100} />;
        },
        header: 'Name',
        id: 'name',
        size: itemListHelpers.table.numberToColumnSize(1, 'fr'),
    });
}
