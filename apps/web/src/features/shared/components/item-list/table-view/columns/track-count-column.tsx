import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { localize } from '@repo/localization';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton isCentered height={20} width={30} />;
    }

    if (typeof item === 'object' && item) {
        if ('trackCount' in item && typeof item.trackCount === 'number') {
            return (
                <ItemCell isSecondary justify="center">
                    {item.trackCount}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const trackCountColumn = {
    cell: Cell,
    header: () => (
        <HeaderCell justify="center">
            {localize.t('app.itemList.columns.trackCount')}
        </HeaderCell>
    ),
    id: 'trackCount' as ItemListColumn.TRACK_COUNT,
    size: numberToColumnSize(60, 'px'),
};
