import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

export function albumArtistsColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const item = context.data || row.original;

            if (typeof item === 'object' && item) {
                if ('albumArtists' in item && Array.isArray(item.albumArtists)) {
                    return (
                        <Text isSecondary className={styles.cell}>
                            {item.albumArtists.map((artist) => artist.name).join(', ')}
                        </Text>
                    );
                }
            }

            return <Skeleton height={20} width={100} />;
        },
        header: 'Album Artists',
        id: 'albumArtists',
        size: itemListHelpers.table.numberToColumnSize(1, 'fr'),
    });
}
