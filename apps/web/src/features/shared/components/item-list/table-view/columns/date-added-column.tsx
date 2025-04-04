import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { localize } from '@repo/localization';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={100} />;
    }

    if (typeof item === 'object' && item) {
        if ('createdDate' in item && typeof item.createdDate === 'string') {
            return (
                <ItemCell isSecondary>
                    {item.createdDate}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const dateAddedColumn = {
    cell: Cell,
    header: () => <HeaderCell>{localize.t('app.itemList.columns.dateAdded', { context: 'label' })}</HeaderCell>,
    id: 'dateAdded' as ItemListColumn.DATE_ADDED,
    size: numberToColumnSize(100, 'px'),
};
