import type { AlbumItem } from '/@/app-types';
import type { ItemCardProps } from '/@/features/shared/components/item-card/item-card';
import type { ServerItemListProps } from '/@/features/shared/components/item-list/types';
import type { AdapterAlbumListQuery } from '@repo/shared-types/adapter-types';
import type { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types/app-types';
import { ServerItemType } from '@repo/shared-types/app-types';
import { Suspense } from 'react';
import { FullPageLoader } from '/@/components/loader/loader';
import { queryAlbumList } from '/@/features/albums/api/get-album-list';
import { useAlbumListCount } from '/@/features/albums/api/get-album-list-count';
import { albumGridItemLines } from '/@/features/albums/components/album-grid-item-lines';
import { AlbumTableItem } from '/@/features/albums/components/album-table-item';
import { ItemListTable } from '/@/features/shared/components/item-list/table-view/item-list-table';
import { ItemListColumn, itemListHelpers } from '/@/features/shared/components/item-list/utils/helpers';
import { useInfiniteListData } from '/@/features/shared/components/item-list/utils/use-infinite-list-data';
import { useListContext } from '/@/features/shared/context/list-context';

interface AlbumTableParams {
    sortBy: AlbumListSortOptions;
    sortOrder: ListSortOrder;
}

interface InfiniteServerAlbumTableProps extends ServerItemListProps<AlbumTableParams> {}

export function InfiniteServerAlbumTable(props: InfiniteServerAlbumTableProps) {
    return (
        <Suspense fallback={<FullPageLoader />}>
            <InnerAlbumTable {...props} />
        </Suspense>
    );
}

function InnerAlbumTable({
    itemSelectionType,
    pagination,
    params,
    server,
}: InfiniteServerAlbumTableProps) {
    const { key } = useListContext();

    const { data: itemCount } = useAlbumListCount(server, { query: params });
    const columns = itemListHelpers.table.getColumns([
        ItemListColumn.ROW_INDEX,
        ItemListColumn.IMAGE,
        ItemListColumn.NAME,
        ItemListColumn.DURATION,
        ItemListColumn.PLAY_COUNT,
        ItemListColumn.ACTIONS,
    ]);

    const { data, handleRangeChanged } = useInfiniteListData<AdapterAlbumListQuery, any>(server, {
        itemCount,
        key,
        pagination,
        params,
        queryFn: queryAlbumList,
        type: ServerItemType.ALBUM,
    });

    return (
        <ItemListTable<string, { lines: ItemCardProps<AlbumItem>['lines'] }>
            ItemComponent={AlbumTableItem}
            columns={columns}
            context={{ lines: albumGridItemLines }}
            data={data}
            itemCount={itemCount}
            itemSelectionType={itemSelectionType}
            itemType={ServerItemType.ALBUM}
            onRangeChanged={handleRangeChanged}
        />
    );
}
