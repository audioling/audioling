import { ItemImage } from '@/features/shared/item-image/item-image.tsx';
import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import styles from './column.module.scss';

function Cell({ item }: ItemListCellProps) {
    if (typeof item === 'object' && item) {
        if ('imageUrl' in item) {
            return (
                <div className={styles.cell}>
                    <ItemImage
                        className={styles.image}
                        size="table"
                        src={item.imageUrl as string | string[]}
                    />
                </div>
            );
        }
    }

    return (
        <div className={styles.cell}>
            <Skeleton containerClassName={styles.skeletonImage} height="100%" />
        </div>
    );
}

export const imageColumn = {
    cell: Cell,
    header: () => '',
    id: 'image' as ItemListColumn.IMAGE,
    size: numberToColumnSize(60, 'px'),
};
