import type { AlbumItem } from '/@/app-types';
import type { ItemCardProps } from '/@/features/shared/components/item-card/item-card';
import type { ServerItemGridProps } from '/@/features/shared/components/item-list/grid-view/item-list-grid';
import type { AdapterAlbumListQuery } from '@repo/shared-types/adapter-types';
import type { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types/app-types';
import { ServerItemType } from '@repo/shared-types/app-types';
import { Suspense } from 'react';
import { FullPageLoader } from '/@/components/loader/loader';
import { queryAlbumList } from '/@/features/albums/api/get-album-list';
import { useAlbumListCount } from '/@/features/albums/api/get-album-list-count';
import { AlbumGridItem } from '/@/features/albums/components/album-grid-item';
import { albumGridItemLines } from '/@/features/albums/components/album-grid-item-lines';
import { ItemListGrid } from '/@/features/shared/components/item-list/grid-view/item-list-grid';
import { usePaginatedListData } from '/@/features/shared/components/item-list/utils/use-paginated-list-data';

interface AlbumGridParams {
    sortBy: AlbumListSortOptions;
    sortOrder: ListSortOrder;
}

interface PaginatedServerAlbumGridProps extends ServerItemGridProps<AlbumGridParams> {}

export function PaginatedServerAlbumGrid(props: PaginatedServerAlbumGridProps) {
    return (
        <Suspense fallback={<FullPageLoader />}>
            <InnerAlbumGrid {...props} />
        </Suspense>
    );
}

function InnerAlbumGrid({ itemSelectionType, pagination, params, server }: PaginatedServerAlbumGridProps) {
    const { data: itemCount } = useAlbumListCount(server, { query: params });

    const { data } = usePaginatedListData<AdapterAlbumListQuery, any>(server, {
        itemCount,
        pagination,
        params,
        queryFn: queryAlbumList,
        type: ServerItemType.ALBUM,
    });

    return (
        <ItemListGrid<string, {
            lines: ItemCardProps<AlbumItem>['lines'];
        }>
            ItemComponent={AlbumGridItem}
            context={{ lines: albumGridItemLines }}
            data={data}
            displayType="default"
            itemCount={pagination.itemsPerPage}
            itemSelectionType={itemSelectionType}
            itemType={ServerItemType.ALBUM}
        />
    );
}
