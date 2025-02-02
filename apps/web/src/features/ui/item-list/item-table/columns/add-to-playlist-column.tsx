import { Group } from '@/features/ui/group/group.tsx';
import { Icon } from '@/features/ui/icon/icon.tsx';
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
        if ('name' in item && typeof item.name === 'string') {
            const isSkipped = item.name.includes('__duplicate_skip__');
            return (
                <div className={styles.cell}>
                    <Group justify="between">
                        <Text isEllipsis style={{ maxWidth: '80%' }}>
                            {item.name
                                .replace('__duplicate__', '')
                                .replace('__duplicate_skip__', '')}
                        </Text>
                        {item.name.includes('__duplicate') && (
                            <Icon icon="remove" size="lg" state={isSkipped ? 'error' : 'warn'} />
                        )}
                    </Group>
                </div>
            );
        }
    }

    return <EmptyCell />;
}

export const addToPlaylistColumn = {
    cell: Cell,
    header: () => <Text isUppercase>Name</Text>,
    id: 'addToPlaylist' as ItemListColumn.ADD_TO_PLAYLIST,
    size: numberToColumnSize(1, 'fr'),
};
