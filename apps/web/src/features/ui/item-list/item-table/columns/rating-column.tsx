import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { EmptyCell } from '@/features/ui/item-list/item-table/columns/shared.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <EmptyCell />;
    }

    if (typeof item === 'object' && 'userRating' in item && !item.userRating) {
        return <EmptyCell />;
    }

    if (typeof item === 'object' && item) {
        if ('userRating' in item && typeof item.userRating === 'number') {
            return (
                <Text isCentered isSecondary className={styles.cell}>
                    {item.userRating}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const ratingColumn = {
    cell: Cell,
    header: () => (
        <Text isCentered isUppercase>
            Rating
        </Text>
    ),
    id: 'rating' as ItemListColumn.RATING,
    size: numberToColumnSize(100, 'px'),
};
