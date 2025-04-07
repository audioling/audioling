import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { localize } from '@repo/localization';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ data }: ItemListCellProps) {
    if (!data) {
        return <CellSkeleton height={20} width={60} />;
    }

    if (typeof data === 'object' && data) {
        if ('userLastPlayedDate' in data && typeof data.userLastPlayedDate === 'string') {
            return (
                <ItemCell isSecondary>
                    {data.userLastPlayedDate}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const lastPlayedColumn = {
    cell: Cell,
    header: () => <HeaderCell>{localize.t('app.itemList.columns.lastPlayed', { context: 'label' })}</HeaderCell>,
    id: 'lastPlayed' as ItemListColumn.LAST_PLAYED,
    size: numberToColumnSize(100, 'px'),
};
