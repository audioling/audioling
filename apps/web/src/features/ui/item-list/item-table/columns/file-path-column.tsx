import clsx from 'clsx';
import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { CellSkeleton, EmptyCell } from '@/features/ui/item-list/item-table/columns/shared.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import styles from './column.module.scss';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={100} />;
    }

    if (typeof item === 'object' && item) {
        if ('filePath' in item && typeof item.filePath === 'string') {
            return (
                <div className={styles.clampContainer}>
                    <Text isSecondary className={clsx(styles.cell, styles.name)} lineClamp={2}>
                        {item.filePath}
                    </Text>
                </div>
            );
        }
    }

    return <EmptyCell />;
}

export const filePathColumn = {
    cell: Cell,
    header: () => <Text isUppercase>File Path</Text>,
    id: 'filePath' as ItemListColumn.FILE_PATH,
    size: numberToColumnSize(1, 'fr'),
};
