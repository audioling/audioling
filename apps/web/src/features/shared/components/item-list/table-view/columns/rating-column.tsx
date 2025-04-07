import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ data }: ItemListCellProps) {
    if (!data) {
        return <EmptyCell />;
    }

    if (typeof data === 'object' && 'userRating' in data && !data.userRating) {
        return <EmptyCell />;
    }

    if (typeof data === 'object' && data) {
        if ('userRating' in data && typeof data.userRating === 'number') {
            return (
                <ItemCell isSecondary justify="center">
                    {data.userRating}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const ratingColumn = {
    cell: Cell,
    header: () => '',
    id: 'rating' as ItemListColumn.RATING,
    size: numberToColumnSize(100, 'px'),
};
