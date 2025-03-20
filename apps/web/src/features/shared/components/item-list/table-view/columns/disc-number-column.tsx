import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={30} />;
    }

    if (typeof item === 'object' && item) {
        if ('discNumber' in item && typeof item.discNumber === 'string') {
            return (
                <ItemCell isSecondary justify="center">
                    {item.discNumber}
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
            Disc
        </HeaderCell>
    ),
    id: 'discNumber' as ItemListColumn.DISC_NUMBER,
    size: numberToColumnSize(50, 'px'),
};
