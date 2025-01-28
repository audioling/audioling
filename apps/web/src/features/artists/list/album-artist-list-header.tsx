import { ArtistListSortOptions, type LibraryFeatures } from '@repo/shared-types';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router';
import { getGetApiLibraryIdAlbumArtistsCountQueryKey } from '@/api/openapi-generated/album-artists/album-artists.ts';
import { useArtistListStore } from '@/features/artists/stores/artist-list-store.ts';
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

export function AlbumArtistListHeader({ handleRefresh }: { handleRefresh: () => void }) {
    const { libraryId } = useParams() as { libraryId: string };
    const queryClient = useQueryClient();

    const features = useLibraryFeatures(libraryId);
    const sortOptions = getSortOptions(features);

    const sortBy = useArtistListStore.use.sortBy();
    const sortOrder = useArtistListStore.use.sortOrder();
    const displayType = useArtistListStore.use.displayType();
    const paginationType = useArtistListStore.use.paginationType();
    const folderId = useArtistListStore.use.folderId();
    const columnOrder = useArtistListStore.use.columnOrder();
    const setSortBy = useArtistListStore.use.setSortBy();
    const setSortOrder = useArtistListStore.use.setSortOrder();
    const setDisplayType = useArtistListStore.use.setDisplayType();
    const setPaginationType = useArtistListStore.use.setPaginationType();
    const setFolderId = useArtistListStore.use.setFolderId();
    const setColumnOrder = useArtistListStore.use.setColumnOrder();

    const [searchParams] = useSearchParams();
    const itemCountQueryKey = getGetApiLibraryIdAlbumArtistsCountQueryKey(libraryId, {
        folderId,
        searchTerm: searchParams.get('search') ?? undefined,
        sortBy,
        sortOrder,
    });

    const itemCount = queryClient.getQueryData<number | undefined>(itemCountQueryKey);

    const isFetchingItemCount = useIsFetching({
        queryKey: itemCountQueryKey,
    });

    const isFetching = useIsFetching({ queryKey: [`/api/${libraryId}/album-artists`] });

    return (
        <ListHeader>
            <ListHeader.Left>
                <ListHeader.Title>Artists</ListHeader.Title>
                <ListHeader.ItemCount value={isFetchingItemCount ? 0 : (itemCount ?? 0)} />
            </ListHeader.Left>
            <ListHeader.Right>
                <Group gap="xs">
                    <SearchButton />
                </Group>
            </ListHeader.Right>
            <ListHeader.Footer>
                <ListHeader.Left>
                    <Group gap="xs" wrap="nowrap">
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
                    <ListOptionsButton
                        columnOptions={artistColumnOptions}
                        columns={columnOrder}
                        displayType={displayType}
                        paginationType={paginationType}
                        onChangeColumns={setColumnOrder}
                        onChangeDisplayType={setDisplayType}
                        onChangePaginationType={setPaginationType}
                    />
                </ListHeader.Right>
            </ListHeader.Footer>
        </ListHeader>
    );
}

export const artistColumnOptions = [
    { label: 'Row Index', value: ItemListColumn.ROW_INDEX },
    { label: 'Name', value: ItemListColumn.NAME },
    { label: 'Image', value: ItemListColumn.IMAGE },
    { label: 'Album Count', value: ItemListColumn.ALBUM_COUNT },
    { label: 'Track Count', value: ItemListColumn.TRACK_COUNT },
    { label: 'Duration', value: ItemListColumn.DURATION },
    { label: 'Rating', value: ItemListColumn.RATING },
    { label: 'Favorite', value: ItemListColumn.FAVORITE },
    { label: 'Actions', value: ItemListColumn.ACTIONS },
];

const artistSortLabelMap = {
    [ArtistListSortOptions.ALBUM_COUNT]: 'Album Count',
    [ArtistListSortOptions.DURATION]: 'Duration',
    [ArtistListSortOptions.IS_FAVORITE]: 'Is Favorite',
    [ArtistListSortOptions.NAME]: 'Name',
    [ArtistListSortOptions.RANDOM]: 'Random',
    [ArtistListSortOptions.RATING]: 'Rating',
    [ArtistListSortOptions.TRACK_COUNT]: 'Track Count',
};

function getSortOptions(
    features: LibraryFeatures,
): { label: string; value: ArtistListSortOptions }[] {
    const artistSortFeatures = Object.keys(features)
        .filter((key) => key.includes('albumArtist:list:filter'))
        .filter((key) => features[key as keyof LibraryFeatures]);

    return artistSortFeatures.map((feature) => {
        const option = feature.replace('albumArtist:list:filter:', '') as ArtistListSortOptions;
        return {
            label: artistSortLabelMap[option as keyof typeof artistSortLabelMap],
            value: option,
        };
    });
}
