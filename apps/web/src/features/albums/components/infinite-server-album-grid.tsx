import type { AlbumItem } from '/@/app-types';
import type { ItemCardProps } from '/@/features/shared/components/item-card/item-card';
import type { AdapterAlbumListQuery } from '@repo/shared-types/adapter-types';
import type { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types/app-types';
import type { ServerItemGridProps } from '../../shared/components/item-list/grid-view/item-list-grid';
import { ServerItemType } from '@repo/shared-types/app-types';
import { Suspense } from 'react';
import { ItemListGrid } from '../../shared/components/item-list/grid-view/item-list-grid';
import { useInfiniteListData } from '../../shared/components/item-list/utils/use-infinite-list-data';
import { useListContext } from '../../shared/context/list-context';
import { FullPageLoader } from '/@/components/loader/loader';
import { queryAlbumList } from '/@/features/albums/api/get-album-list';
import { useAlbumListCount } from '/@/features/albums/api/get-album-list-count';
import { AlbumGridItem } from '/@/features/albums/components/album-grid-item';
import { albumGridItemLines } from '/@/features/albums/components/album-grid-item-lines';

interface AlbumGridParams {
    sortBy: AlbumListSortOptions;
    sortOrder: ListSortOrder;
}

interface InfiniteServerAlbumGridProps extends ServerItemGridProps<AlbumGridParams> {}

export function InfiniteServerAlbumGrid(props: InfiniteServerAlbumGridProps) {
    return (
        <Suspense fallback={<FullPageLoader />}>
            <InnerAlbumGrid {...props} />
        </Suspense>
    );
}

function InnerAlbumGrid({ itemSelectionType, pagination, params, server }: InfiniteServerAlbumGridProps) {
    const { data: itemCount } = useAlbumListCount(server, { query: params });
    const { key } = useListContext();

    const { data, handleRangeChanged } = useInfiniteListData<AdapterAlbumListQuery, any>(server, {
        itemCount,
        key,
        pagination,
        params,
        queryFn: queryAlbumList,
        type: ServerItemType.ALBUM,
    });

    return (
        <ItemListGrid<string, { lines: ItemCardProps<AlbumItem>['lines'] }>
            ItemComponent={AlbumGridItem}
            context={{ lines: albumGridItemLines }}
            data={data}
            displayType="default"
            itemCount={itemCount}
            itemSelectionType={itemSelectionType}
            itemType={ServerItemType.ALBUM}
            onRangeChanged={handleRangeChanged}
        />
    );
}
