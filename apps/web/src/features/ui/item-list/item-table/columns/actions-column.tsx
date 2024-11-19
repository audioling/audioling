import type { ColumnHelper } from '@tanstack/react-table';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import styles from './column.module.scss';

export function actionsColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: () => {
            return (
                <div className={styles.cell}>
                    <IconButton icon="ellipsisHorizontal" size="sm" />
                </div>
            );
        },
        header: '',
        id: 'actions',
        size: itemListHelpers.table.numberToColumnSize(50, 'px'),
    });
}
