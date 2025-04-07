import type { ArtistItem } from '/@/app-types';
import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { Text } from '@mantine/core';
import { localize } from '@repo/localization';
import { Fragment } from 'react';
import styles from './column.module.css';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCellLink } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ data }: ItemListCellProps) {
    if (!data) {
        return <CellSkeleton height={20} width={100} />;
    }

    if (typeof data === 'object' && data) {
        if ('albumArtists' in data && Array.isArray(data.albumArtists)) {
            return (
                <Text className={styles.cell} variant="secondary">
                    {data.albumArtists.map((artist, index) => (
                        <Fragment key={artist.id}>
                            <ItemCellLink to={`/artist/${artist.id}`}>
                                {artist.name}
                            </ItemCellLink>
                            {index < (data.albumArtists as ArtistItem[]).length - 1 && ', '}
                        </Fragment>
                    ))}
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
