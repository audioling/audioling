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
        if ('fileName' in data && typeof data.fileName === 'string') {
            return (
                <ItemCell isSecondary>
                    {data.fileName}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const fileNameColumn = {
    cell: Cell,
    header: () => <HeaderCell>{localize.t('app.itemList.columns.fileName', { context: 'label' })}</HeaderCell>,
    id: 'fileName' as ItemListColumn.FILE_NAME,
    size: numberToColumnSize(1, 'fr'),
};
