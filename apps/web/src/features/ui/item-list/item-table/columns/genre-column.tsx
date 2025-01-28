import type { ColumnHelper } from '@tanstack/react-table';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

export function genreColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const item = context.data || row.original;

            if (!item) {
                return <Skeleton height={20} width={100} />;
            }

            if (typeof item === 'object' && item) {
                if ('genres' in item && Array.isArray(item.genres)) {
                    return (
                        <div className={styles.cell}>
                            <Text isSecondary lineClamp={2}>
                                {item.genres.map((genre) => genre.name).join(', ')}
                            </Text>
                        </div>
                    );
                }
            }

            return <div className={styles.cell}>&nbsp;</div>;
        },
        header: 'Genre',
        id: 'genre',
        size: itemListHelpers.table.numberToColumnSize(1, 'fr'),
    });
}
