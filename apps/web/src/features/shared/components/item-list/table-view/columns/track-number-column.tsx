import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { localize } from '@repo/localization';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={30} />;
    }

    if (typeof item === 'object' && item) {
        if ('trackNumber' in item && typeof item.trackNumber === 'number') {
            return (
                <ItemCell isSecondary justify="center">
                    {item.trackNumber}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const trackNumberColumn = {
    cell: Cell,
    header: () => (
        <HeaderCell justify="center">
            {localize.t('app.itemList.columns.trackNumber', { context: 'label' })}
        </HeaderCell>
    ),
    id: 'trackNumber' as ItemListColumn.TRACK_NUMBER,
    size: numberToColumnSize(50, 'px'),
};
