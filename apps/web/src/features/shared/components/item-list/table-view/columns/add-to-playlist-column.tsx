import { Group, Text } from '@mantine/core';
import styles from './column.module.css';
import { Icon } from '/@/components/icon/icon';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import {
    type ItemListCellProps,
    type ItemListColumn,
    numberToColumnSize,
} from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ data }: ItemListCellProps) {
    if (!data) {
        return <CellSkeleton height={20} width={100} />;
    }

    if (typeof data === 'object' && data) {
        if ('name' in data && typeof data.name === 'string') {
            // const isSkipped = item.name.includes('__duplicate_skip__');
            return (
                <div className={styles.cell}>
                    <Group justify="between">
                        <Text className={styles.text}>
                            {data.name
                                .replace('__duplicate__', '')
                                .replace('__duplicate_skip__', '')}
                        </Text>
                        {data.name.includes('__duplicate') && (
                            <Icon icon="remove" size="lg" />
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
    header: () => <HeaderCell>Name</HeaderCell>,
    id: 'addToPlaylist' as ItemListColumn.ADD_TO_PLAYLIST,
    size: numberToColumnSize(1, 'fr'),
};
