import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { localize } from '@repo/localization';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={40} />;
    }

    if (typeof item === 'object' && item) {
        if ('minReleaseYear' in item && typeof item.minReleaseYear === 'number') {
            return (
                <ItemCell isSecondary>
                    {item.minReleaseYear}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const yearColumn = {
    cell: Cell,
    header: () => (
        <HeaderCell>
            {localize.t('app.itemList.columns.releaseYear', { context: 'label' })}
        </HeaderCell>
    ),
    id: 'year' as ItemListColumn.YEAR,
    size: numberToColumnSize(50, 'px'),
};
