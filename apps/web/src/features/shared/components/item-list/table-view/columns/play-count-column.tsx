import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { localize } from '@repo/localization';
import { EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ data }: ItemListCellProps) {
    if (!data) {
        return <EmptyCell />;
    }

    if (typeof data === 'object' && data) {
        if ('userPlayCount' in data && typeof data.userPlayCount === 'number') {
            return (
                <ItemCell isSecondary justify="center">
                    {data.userPlayCount > 0 ? data.userPlayCount : ''}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const playCountColumn = {
    cell: Cell,
    header: () => (
        <HeaderCell justify="center">
            {localize.t('app.itemList.columns.playCount', { context: 'label' })}
        </HeaderCell>
    ),
    id: 'playCount' as ItemListColumn.PLAY_COUNT,
    size: numberToColumnSize(50, 'px'),
};
