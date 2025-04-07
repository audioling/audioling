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
        if ('fileContainer' in data && typeof data.fileContainer === 'string') {
            return (
                <ItemCell isSecondary justify="center">
                    {data.fileContainer}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const qualityColumn = {
    cell: Cell,
    header: () => <HeaderCell>{localize.t('app.itemList.columns.quality', { context: 'label' })}</HeaderCell>,
    id: 'quality' as ItemListColumn.QUALITY,
    size: numberToColumnSize(70, 'px'),
};
