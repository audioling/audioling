import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { localize } from '@repo/localization';
import { EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

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
                <ItemCell isSecondary justify="center">
                    {item.userRating}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const ratingColumn = {
    cell: Cell,
    header: () => (
        <HeaderCell justify="center">
            {localize.t('app.itemList.columns.rating')}
        </HeaderCell>
    ),
    id: 'rating' as ItemListColumn.RATING,
    size: numberToColumnSize(100, 'px'),
};
