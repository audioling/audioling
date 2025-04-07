import type { ArtistItem } from '/@/app-types';
import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { Fragment } from 'react';
import { CellSkeleton, EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import { HeaderCell } from '/@/features/shared/components/item-list/table-view/header-cell';
import { ItemCell, ItemCellLink } from '/@/features/shared/components/item-list/table-view/item-cell';
import { numberToColumnSize } from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ data }: ItemListCellProps) {
    if (!data) {
        return <CellSkeleton height={20} width={100} />;
    }

    if (typeof data === 'object' && data) {
        if ('artists' in data && Array.isArray(data.artists)) {
            return (
                <ItemCell isSecondary>
                    {data.artists.map((artist, index) => (
                        <Fragment key={artist.id}>
                            <ItemCellLink to={`/artist/${artist.id}`}>
                                {artist.name}
                            </ItemCellLink>
                            {index < (data.artists as ArtistItem[]).length - 1 && ', '}
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
