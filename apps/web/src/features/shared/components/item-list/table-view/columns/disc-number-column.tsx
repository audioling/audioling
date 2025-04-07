import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { localize } from '@repo/localization';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ data }: ItemListCellProps) {
    if (!data) {
        return <CellSkeleton height={20} width={30} />;
    }

    if (typeof data === 'object' && data) {
        if ('discNumber' in data && typeof data.discNumber === 'string') {
            return (
                <ItemCell isSecondary justify="center">
                    {data.discNumber}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const discNumberColumn = {
    cell: Cell,
    header: () => (
        <HeaderCell justify="center">
            {localize.t('app.itemList.columns.discNumber', { context: 'label' })}
        </HeaderCell>
    ),
    id: 'discNumber' as ItemListColumn.DISC_NUMBER,
    size: numberToColumnSize(50, 'px'),
};
