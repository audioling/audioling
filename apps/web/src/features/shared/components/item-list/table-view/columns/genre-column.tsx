import type { GenreItem } from '/@/app-types';
import type { ItemListCellProps, ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { localize } from '@repo/localization';
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
        if ('genres' in data && Array.isArray(data.genres)) {
            return (
                <ItemCell isSecondary lineClamp={2}>
                    {data.genres.map((genre, index) => (
                        <Fragment key={genre.id}>
                            <ItemCellLink to={`/genre/${genre.id}`}>
                                {genre.name}
                            </ItemCellLink>
                            {index < (data.genres as GenreItem[]).length - 1 && ', '}
                        </Fragment>
                    ))}
                </ItemCell>
            );
        }
    }

    return <EmptyCell />;
}

export const genreColumn = {
    cell: Cell,
    header: () => <HeaderCell>{localize.t('app.itemList.columns.genre', { context: 'label' })}</HeaderCell>,
    id: 'genre' as ItemListColumn.GENRE,
    size: numberToColumnSize(1, 'fr'),
};
