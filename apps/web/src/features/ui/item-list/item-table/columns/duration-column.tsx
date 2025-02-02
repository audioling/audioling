import { Icon } from '@/features/ui/icon/icon.tsx';
import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { CellSkeleton, EmptyCell } from '@/features/ui/item-list/item-table/columns/shared.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import { formatDuration } from '@/utils/format-duration.ts';
import styles from './column.module.scss';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={40} />;
    }

    if (typeof item === 'object' && item) {
        if ('duration' in item && typeof item.duration === 'number') {
            return (
                <Text isCentered isSecondary className={styles.cell}>
                    {formatDuration(item.duration)}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const durationColumn = {
    cell: Cell,
    header: () => (
        <Text isCentered>
            <Icon icon="duration" />
        </Text>
    ),
    id: 'duration' as ItemListColumn.DURATION,
    size: numberToColumnSize(60, 'px'),
};
