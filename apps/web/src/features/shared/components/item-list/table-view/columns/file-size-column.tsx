import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { localize } from '@repo/localization';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';
import { formatSize } from '/@/utils/format-size';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={50} />;
    }

    if (typeof item === 'object' && item) {
        if ('fileSize' in item && typeof item.fileSize === 'number') {
            return (
                <ItemCell isSecondary justify="center">
                    {formatSize(item.fileSize)}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const fileSizeColumn = {
    cell: Cell,
    header: () => (
        <HeaderCell justify="center">
            {localize.t('app.itemList.columns.fileSize', { context: 'label' })}
        </HeaderCell>
    ),
    id: 'fileSize' as ItemListColumn.FILE_SIZE,
    size: numberToColumnSize(80, 'px'),
};
