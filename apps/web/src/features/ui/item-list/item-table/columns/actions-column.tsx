import type { ColumnHelper } from '@tanstack/react-table';
import { Button } from '@/features/ui/button/button.tsx';
import { Icon } from '@/features/ui/icon/icon.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import styles from './column.module.scss';

export function actionsColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: () => {
            return (
                <div className={styles.cell}>
                    <Button
                        isCompact
                        variant="default"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('hello');
                        }}
                    >
                        <Icon icon="ellipsisHorizontal" />
                    </Button>
                </div>
            );
        },
        header: '',
        id: 'actions',
        size: itemListHelpers.table.numberToColumnSize(50, 'px'),
    });
}
