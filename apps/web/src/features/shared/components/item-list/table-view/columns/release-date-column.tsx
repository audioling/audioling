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
        if ('releaseDate' in data && typeof data.releaseDate === 'string') {
            return (
                <ItemCell isSecondary>
                    {data.releaseDate}
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
