import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { localize } from '@repo/localization';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={50} />;
    }

    if (typeof item === 'object' && item) {
        if ('albumCount' in item && typeof item.albumCount === 'number') {
            return (
                <ItemCell isSecondary justify="center">
                    {item.albumCount}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const albumCountColumn = {
    cell: Cell,
    header: () => (
        <HeaderCell justify="center">
            {localize.t('app.itemList.columns.albumCount', { context: 'label' })}
        </HeaderCell>
    ),
    id: 'albumCount' as ItemListColumn.ALBUM_COUNT,
    size: numberToColumnSize(100, 'px'),
};
