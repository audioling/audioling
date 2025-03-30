import type { AlbumItem } from '/@/app-types';
import type { ItemListTableComponent } from '/@/features/shared/components/item-list/table-view/item-list-table';
import type { InnerServerTableItemProps } from '/@/features/shared/components/item-list/table-view/server-table-item';
import { memo } from 'react';
import { InnerServerTableItem } from '/@/features/shared/components/item-list/table-view/server-table-item';

function InnerAlbumTableItemBase<T extends AlbumItem>({
    context,
    data,
    index,
}: InnerServerTableItemProps<T>) {
    return (
        <InnerServerTableItem
            context={context}
            data={data}
            index={index}
        />
    );
}

export const InnerAlbumTableItem = memo(InnerAlbumTableItemBase);

export const AlbumTableItem: ItemListTableComponent = (index, data, context) => {
    return (
        <InnerAlbumTableItem
            context={context}
            data={data as string | undefined}
            index={index}
        />
    );
};
