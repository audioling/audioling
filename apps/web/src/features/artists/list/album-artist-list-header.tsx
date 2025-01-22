import { ArtistListSortOptions, type LibraryFeatures } from '@repo/shared-types';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router';
import { getGetApiLibraryIdAlbumArtistsCountQueryKey } from '@/api/openapi-generated/album-artists/album-artists.ts';
import { useArtistListStore } from '@/features/artists/stores/artist-list-store.ts';
import { useLibraryFeatures } from '@/features/authentication/stores/auth-store.ts';
import { ListDisplayTypeButton } from '@/features/shared/display-type-button/list-display-type-button.tsx';
import { ListFolderFilterButton } from '@/features/shared/list-folder-filter-button/list-folder-filter-button.tsx';
import { ListHeader } from '@/features/shared/list-header/list-header.tsx';
import { ListPaginationTypeButton } from '@/features/shared/list-pagination-type-button/list-pagination-type-button.tsx';
import { ListSortByButton } from '@/features/shared/list-sort-by-button/list-sort-by-button.tsx';
import { RefreshButton } from '@/features/shared/refresh-button/refresh-button.tsx';
import { SearchButton } from '@/features/shared/search-button/search-button.tsx';
import { SortOrderButton } from '@/features/shared/sort-order-button/sort-order-button.tsx';
import { Group } from '@/features/ui/group/group.tsx';

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

    const setSortBy = useArtistListStore.use.setSortBy();
    const setSortOrder = useArtistListStore.use.setSortOrder();
    const setDisplayType = useArtistListStore.use.setDisplayType();
    const setPaginationType = useArtistListStore.use.setPaginationType();
    const setFolderId = useArtistListStore.use.setFolderId();

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
                    <Group gap="xs" wrap="nowrap">
                        <ListDisplayTypeButton
                            displayType={displayType}
                            onChangeDisplayType={setDisplayType}
                        />
                        <ListPaginationTypeButton
                            paginationType={paginationType}
                            onChangePaginationType={setPaginationType}
                        />
                    </Group>
                </ListHeader.Right>
            </ListHeader.Footer>
        </ListHeader>
    );
}

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
        .filter((key) => key.includes('artist:list:filter'))
        .filter((key) => features[key as keyof LibraryFeatures]);

    return artistSortFeatures.map((feature) => {
        const option = feature.replace('artist:list:filter:', '') as ArtistListSortOptions;
        return {
            label: artistSortLabelMap[option as keyof typeof artistSortLabelMap],
            value: option,
        };
    });
}
