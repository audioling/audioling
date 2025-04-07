import type { AlbumItem } from '/@/app-types';
import type { ItemGridComponent } from '/@/features/shared/components/item-list/grid-view/item-list-grid';
import type { InnerServerGridItemProps } from '/@/features/shared/components/item-list/grid-view/server-grid-item';
import { memo } from 'react';
import { albumListItemProps } from '/@/features/albums/components/album-list-item';
import { InnerServerGridItem } from '/@/features/shared/components/item-list/grid-view/server-grid-item';

function InnerAlbumGridItemBase<T extends AlbumItem>({
    context,
    data,
    index,
}: InnerServerGridItemProps<T>) {
    return (
        <InnerServerGridItem
            context={context}
            data={data}
            index={index}
            {...albumListItemProps}
        />
    );
}

export const InnerAlbumGridItem = memo(InnerAlbumGridItemBase);

export const AlbumGridItem: ItemGridComponent = (index, data, context) => {
    return (
        <InnerAlbumGridItem
            context={context}
            data={data as string | undefined}
            index={index}
        />
    );
};
