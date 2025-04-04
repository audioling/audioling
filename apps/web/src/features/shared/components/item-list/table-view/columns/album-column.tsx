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
        if ('album' in item && typeof item.album === 'string') {
            return (
                <ItemCell isSecondary>
                    {item.album}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const albumColumn = {
    cell: Cell,
    header: () => <HeaderCell>{localize.t('app.itemList.columns.album', { context: 'label' })}</HeaderCell>,
    id: 'album' as ItemListColumn.ALBUM,
    size: numberToColumnSize(1, 'fr'),
};
