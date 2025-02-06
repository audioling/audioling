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
        if ('fileName' in item && typeof item.fileName === 'string') {
            return (
                <div className={styles.clampContainer}>
                    <Text isSecondary className={clsx(styles.cell, styles.name)} lineClamp={2}>
                        {item.fileName}
                    </Text>
                </div>
            );
        }
    }

    return <EmptyCell />;
}

export const fileNameColumn = {
    cell: Cell,
    header: () => <Text isUppercase>File Name</Text>,
    id: 'fileName' as ItemListColumn.FILE_NAME,
    size: numberToColumnSize(1, 'fr'),
};
