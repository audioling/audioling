import { GenreListSortOptions, type LibraryFeatures } from '@repo/shared-types';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router';
import { getGetApiLibraryIdGenresCountQueryKey } from '@/api/openapi-generated/genres/genres.ts';
import { useLibraryFeatures } from '@/features/authentication/stores/auth-store.ts';
import { useGenreListStore } from '@/features/genres/stores/genre-list-store.ts';
import { ListHeader } from '@/features/shared/list-header/list-header.tsx';
import { ListPaginationTypeButton } from '@/features/shared/list-pagination-type-button/list-pagination-type-button.tsx';
import { ListSortByButton } from '@/features/shared/list-sort-by-button/list-sort-by-button.tsx';
import { RefreshButton } from '@/features/shared/refresh-button/refresh-button.tsx';
import { SearchButton } from '@/features/shared/search-button/search-button.tsx';
import { SortOrderButton } from '@/features/shared/sort-order-button/sort-order-button.tsx';
import { Group } from '@/features/ui/group/group.tsx';

export function GenreListHeader({ handleRefresh }: { handleRefresh: () => void }) {
    const { libraryId } = useParams() as { libraryId: string };
    const queryClient = useQueryClient();

    const features = useLibraryFeatures(libraryId);
    const sortOptions = getSortOptions(features);

    const sortBy = useGenreListStore.use.sortBy();
    const sortOrder = useGenreListStore.use.sortOrder();
    const paginationType = useGenreListStore.use.paginationType();
    const setSortBy = useGenreListStore.use.setSortBy();
    const setSortOrder = useGenreListStore.use.setSortOrder();
    const setPaginationType = useGenreListStore.use.setPaginationType();

    const [searchParams] = useSearchParams();
    const itemCountQueryKey = getGetApiLibraryIdGenresCountQueryKey(libraryId, {
        searchTerm: searchParams.get('search') ?? undefined,
        sortBy,
        sortOrder,
    });
    const itemCount = queryClient.getQueryData<number | undefined>(itemCountQueryKey);

    const isFetchingItemCount = useIsFetching({
        queryKey: itemCountQueryKey,
    });

    const isFetching = useIsFetching({ queryKey: [`/api/${libraryId}/genres`] });

    return (
        <ListHeader>
            <ListHeader.Left>
                <ListHeader.Title>Genres</ListHeader.Title>
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
                        <SortOrderButton order={sortOrder} onOrderChanged={setSortOrder} />
                        <RefreshButton isLoading={Boolean(isFetching)} onRefresh={handleRefresh} />
                    </Group>
                </ListHeader.Left>
                <ListHeader.Right>
                    <Group gap="xs" wrap="nowrap">
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

const genreSortLabelMap = {
    [GenreListSortOptions.NAME]: 'Name',
    [GenreListSortOptions.TRACK_COUNT]: 'Track Count',
    [GenreListSortOptions.ALBUM_COUNT]: 'Album Count',
};

function getSortOptions(
    features: LibraryFeatures,
): { label: string; value: GenreListSortOptions }[] {
    const genreSortFeatures = Object.keys(features)
        .filter((key) => key.includes('genre:list:filter'))
        .filter((key) => features[key as keyof LibraryFeatures]);

    return genreSortFeatures.map((feature) => {
        const option = feature.replace('genre:list:filter:', '') as GenreListSortOptions;
        return {
            label: genreSortLabelMap[option],
            value: option,
        };
    });
}
