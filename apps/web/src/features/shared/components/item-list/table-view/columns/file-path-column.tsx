import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { localize } from '@repo/localization';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ data }: ItemListCellProps) {
    if (!data) {
        return <CellSkeleton height={20} width={100} />;
    }

    if (typeof data === 'object' && data) {
        if ('filePath' in data && typeof data.filePath === 'string') {
            return (
                <ItemCell isSecondary>
                    {data.filePath}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const filePathColumn = {
    cell: Cell,
    header: () => <HeaderCell>{localize.t('app.itemList.columns.filePath', { context: 'label' })}</HeaderCell>,
    id: 'filePath' as ItemListColumn.FILE_PATH,
    size: numberToColumnSize(1, 'fr'),
};
