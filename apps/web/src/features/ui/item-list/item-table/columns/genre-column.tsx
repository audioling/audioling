import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { CellSkeleton } from '@/features/ui/item-list/item-table/columns/shared.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={100} />;
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
}

export const genreColumn = {
    cell: Cell,
    header: () => <Text isUppercase>Genre</Text>,
    id: 'genre' as ItemListColumn.GENRE,
    size: numberToColumnSize(1, 'fr'),
};
