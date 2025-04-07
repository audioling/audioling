import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { Icon } from '/@/components/icon/icon';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';
import { formatDuration } from '/@/utils/format-duration';

function Cell({ data }: ItemListCellProps) {
    if (!data) {
        return <CellSkeleton height={20} width={40} />;
    }

    if (typeof data === 'object' && data) {
        if ('duration' in data && typeof data.duration === 'number') {
            return (
                <ItemCell isSecondary justify="center">
                    {formatDuration(data.duration)}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const durationColumn = {
    cell: Cell,
    header: () => (
        <HeaderCell justify="center">
            <Icon icon="duration" />
        </HeaderCell>
    ),
    id: 'duration' as ItemListColumn.DURATION,
    size: numberToColumnSize(60, 'px'),
};
