import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { Text } from '@mantine/core';
import { localize } from '@repo/localization';
import styles from './column.module.css';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={100} />;
    }

    if (typeof item === 'object' && item) {
        if ('albumArtists' in item && Array.isArray(item.albumArtists)) {
            return (
                <Text className={styles.cell} variant="secondary">
                    {item.albumArtists.map(artist => artist.name).join(', ')}
                </Text>
            );
        }
    }

    return <EmptyCell />;
}

export const albumArtistsColumn = {
    cell: Cell,
    header: () => <HeaderCell>{localize.t('app.itemList.columns.albumArtists')}</HeaderCell>,
    id: 'albumArtists' as ItemListColumn.ALBUM_ARTISTS,
    size: numberToColumnSize(1, 'fr'),
};
