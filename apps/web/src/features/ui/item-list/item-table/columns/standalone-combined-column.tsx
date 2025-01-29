import type { ColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

export function standaloneCombinedColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const item = context.data || row.original;
            const isPlaying = row.id === context?.currentTrack?._uniqueId;

            if (!item) {
                return <Skeleton height={20} width={100} />;
            }

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
                                <Text className={clsx({ [styles.playing]: isPlaying })}>
                                    {item.name}
                                </Text>
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

            return <div className={styles.cell}>&nbsp;</div>;
        },
        header: 'Name',
        id: 'combined',
        size: itemListHelpers.table.numberToColumnSize(1, 'fr'),
    });
}
