import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { localize } from '@repo/localization';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={60} />;
    }

    if (typeof item === 'object' && item) {
        if ('releaseDate' in item && typeof item.releaseDate === 'string') {
            return (
                <ItemCell isSecondary>
                    {item.releaseDate}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const releaseDateColumn = {
    cell: Cell,
    header: () => <HeaderCell>{localize.t('app.itemList.columns.releaseDate', { context: 'label' })}</HeaderCell>,
    id: 'releaseDate' as ItemListColumn.RELEASE_DATE,
    size: numberToColumnSize(100, 'px'),
};
