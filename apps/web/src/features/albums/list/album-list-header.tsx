import type { LibraryFeatures } from '@repo/shared-types';
import { AlbumListSortOptions } from '@repo/shared-types';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router';
import { getGetApiLibraryIdAlbumsCountQueryKey } from '@/api/openapi-generated/albums/albums.ts';
import { useAlbumListStore } from '@/features/albums/stores/album-list-store.ts';
import { useLibraryFeatures } from '@/features/authentication/stores/auth-store.ts';
import { ListFolderFilterButton } from '@/features/shared/list-folder-filter-button/list-folder-filter-button.tsx';
import { ListHeader } from '@/features/shared/list-header/list-header.tsx';
import { ListOptionsButton } from '@/features/shared/list-options-button/list-options-button.tsx';
import { ListSortByButton } from '@/features/shared/list-sort-by-button/list-sort-by-button.tsx';
import { RefreshButton } from '@/features/shared/refresh-button/refresh-button.tsx';
import { SearchButton } from '@/features/shared/search-button/search-button.tsx';
import { SortOrderButton } from '@/features/shared/sort-order-button/sort-order-button.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { ItemListColumn } from '@/features/ui/item-list/helpers.ts';

export function AlbumListHeader({ handleRefresh }: { handleRefresh: () => void }) {
    const { libraryId } = useParams() as { libraryId: string };
    const queryClient = useQueryClient();

    const features = useLibraryFeatures(libraryId);
    const sortOptions = getSortOptions(features);

    const sortBy = useAlbumListStore.use.sortBy();
    const sortOrder = useAlbumListStore.use.sortOrder();
    const displayType = useAlbumListStore.use.displayType();
    const paginationType = useAlbumListStore.use.paginationType();
    const folderId = useAlbumListStore.use.folderId();
    const columnOrder = useAlbumListStore.use.columnOrder();

    const setSortBy = useAlbumListStore.use.setSortBy();
    const setSortOrder = useAlbumListStore.use.setSortOrder();
    const setDisplayType = useAlbumListStore.use.setDisplayType();
    const setPaginationType = useAlbumListStore.use.setPaginationType();
    const setFolderId = useAlbumListStore.use.setFolderId();
    const setColumnOrder = useAlbumListStore.use.setColumnOrder();

    const [searchParams] = useSearchParams();
    const itemCountQueryKey = getGetApiLibraryIdAlbumsCountQueryKey(libraryId, {
        folderId,
        searchTerm: searchParams.get('search') ?? undefined,
        sortBy,
        sortOrder,
    });

    const itemCount = queryClient.getQueryData<number | undefined>(itemCountQueryKey);

    const isFetchingItemCount = useIsFetching({
        queryKey: itemCountQueryKey,
    });

    const isFetching = useIsFetching({ queryKey: [`/api/${libraryId}/albums`] });

    return (
        <ListHeader>
            <ListHeader.Left>
                <ListHeader.Title>Albums</ListHeader.Title>
                <ListHeader.ItemCount value={isFetchingItemCount ? 0 : (itemCount ?? 0)} />
            </ListHeader.Left>
            <ListHeader.Right>
                <Group gap="xs">
                    <SearchButton />
                </Group>
            </ListHeader.Right>
            <ListHeader.Footer>
                <ListHeader.Left>
                    <Group gap="xs" h="100%" wrap="nowrap">
                        <ListSortByButton
                            options={sortOptions}
                            sort={sortBy}
                            onSortChanged={setSortBy}
                        />
                        <ListFolderFilterButton folderId={folderId} onFolderChanged={setFolderId} />
                        <SortOrderButton order={sortOrder} onOrderChanged={setSortOrder} />
                        <RefreshButton isLoading={Boolean(isFetching)} onRefresh={handleRefresh} />
                    </Group>
                </ListHeader.Left>
                <ListHeader.Right>
                    <Group gap="xs" wrap="nowrap">
                        <ListOptionsButton
                            columnOptions={albumColumnOptions}
                            columns={columnOrder}
                            displayType={displayType}
                            paginationType={paginationType}
                            onChangeColumns={setColumnOrder}
                            onChangeDisplayType={setDisplayType}
                            onChangePaginationType={setPaginationType}
                        />
                    </Group>
                </ListHeader.Right>
            </ListHeader.Footer>
        </ListHeader>
    );
}

export const albumColumnOptions = [
    { label: 'Row Index', value: ItemListColumn.ROW_INDEX },
    { label: 'Image', value: ItemListColumn.IMAGE },
    { label: 'Name', value: ItemListColumn.NAME },
    { label: 'Artists', value: ItemListColumn.ARTISTS },
    { label: 'Genre', value: ItemListColumn.GENRE },
    { label: 'Release Date', value: ItemListColumn.RELEASE_DATE },
    { label: 'Track Count', value: ItemListColumn.TRACK_COUNT },
    { label: 'Year', value: ItemListColumn.YEAR },
    { label: 'Rating', value: ItemListColumn.RATING },
    { label: 'Favorite', value: ItemListColumn.FAVORITE },
    { label: 'Actions', value: ItemListColumn.ACTIONS },
];

const albumSortLabelMap = {
    [AlbumListSortOptions.ALBUM_ARTIST]: 'Album Artist',
    [AlbumListSortOptions.ARTIST]: 'Artist',
    [AlbumListSortOptions.COMMUNITY_RATING]: 'Community Rating',
    [AlbumListSortOptions.CRITIC_RATING]: 'Critic Rating',
    [AlbumListSortOptions.DATE_ADDED]: 'Date Added',
    [AlbumListSortOptions.DATE_PLAYED]: 'Date Played',
    [AlbumListSortOptions.DURATION]: 'Duration',
    [AlbumListSortOptions.IS_FAVORITE]: 'Is Favorite',
    [AlbumListSortOptions.NAME]: 'Name',
    [AlbumListSortOptions.PLAY_COUNT]: 'Play Count',
    [AlbumListSortOptions.RANDOM]: 'Random',
    [AlbumListSortOptions.RATING]: 'Rating',
    [AlbumListSortOptions.RELEASE_DATE]: 'Release Date',
    [AlbumListSortOptions.TRACK_COUNT]: 'Track Count',
    [AlbumListSortOptions.YEAR]: 'Year',
};

function getSortOptions(
    features: LibraryFeatures,
): { label: string; value: AlbumListSortOptions }[] {
    const albumSortFeatures = Object.keys(features)
        .filter((key) => key.includes('album:list:filter'))
        .filter((key) => features[key as keyof LibraryFeatures]);

    return albumSortFeatures.map((feature) => {
        const option = feature.replace('album:list:filter:', '') as AlbumListSortOptions;
        return {
            label: albumSortLabelMap[option],
            value: option,
        };
    });
}
