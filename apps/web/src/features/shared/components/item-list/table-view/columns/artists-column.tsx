import type { ArtistItem } from '/@/app-types';
import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { Fragment } from 'react';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell, ItemCellLink } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ item }: ItemListCellProps) {
    if (!item) {
        return <CellSkeleton height={20} width={100} />;
    }

    if (typeof item === 'object' && item) {
        if ('artists' in item && Array.isArray(item.artists)) {
            return (
                <ItemCell isSecondary>
                    {item.artists.map((artist, index) => (
                        <Fragment key={artist.id}>
                            <ItemCellLink to={`/artist/${artist.id}`}>
                                {artist.name}
                            </ItemCellLink>
                            {index < (item.artists as ArtistItem[]).length - 1 && ', '}
                        </Fragment>
                    ))}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const artistsColumn = {
    cell: Cell,
    header: () => <HeaderCell>Artists</HeaderCell>,
    id: 'artists' as ItemListColumn.ARTISTS,
    size: numberToColumnSize(1, 'fr'),
};
