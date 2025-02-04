import { type LibraryFeatures, PlaylistListSortOptions } from '@repo/shared-types';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router';
import { getGetApiLibraryIdPlaylistsCountQueryKey } from '@/api/openapi-generated/playlists/playlists.ts';
import { useLibraryFeatures } from '@/features/authentication/stores/auth-store.ts';
import { CreatePlaylistModal } from '@/features/playlists/create-playlist/create-playlist-modal.tsx';
import { usePlaylistListStore } from '@/features/playlists/stores/playlist-list-store.ts';
import { ListHeader } from '@/features/shared/list-header/list-header.tsx';
import { ListOptionsButton } from '@/features/shared/list-options-button/list-options-button.tsx';
import { ListSortByButton } from '@/features/shared/list-sort-by-button/list-sort-by-button.tsx';
import { RefreshButton } from '@/features/shared/refresh-button/refresh-button.tsx';
import { SearchButton } from '@/features/shared/search-button/search-button.tsx';
import { SortOrderButton } from '@/features/shared/sort-order-button/sort-order-button.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';
import { ItemListColumn } from '@/features/ui/item-list/helpers.ts';

export function PlaylistListHeader({ handleRefresh }: { handleRefresh: () => void }) {
    const { libraryId } = useParams() as { libraryId: string };
    const queryClient = useQueryClient();

    const features = useLibraryFeatures(libraryId);
    const sortOptions = getSortOptions(features);

    const displayType = usePlaylistListStore.use.displayType();
    const sortBy = usePlaylistListStore.use.sortBy();
    const sortOrder = usePlaylistListStore.use.sortOrder();
    const paginationType = usePlaylistListStore.use.paginationType();
    const columnOrder = usePlaylistListStore.use.columnOrder();
    const setDisplayType = usePlaylistListStore.use.setDisplayType();
    const setSortBy = usePlaylistListStore.use.setSortBy();
    const setSortOrder = usePlaylistListStore.use.setSortOrder();
    const setPaginationType = usePlaylistListStore.use.setPaginationType();
    const setColumnOrder = usePlaylistListStore.use.setColumnOrder();

    const [searchParams] = useSearchParams();
    const itemCountQueryKey = getGetApiLibraryIdPlaylistsCountQueryKey(libraryId, {
        searchTerm: searchParams.get('search') ?? undefined,
        sortBy,
        sortOrder,
    });
    const itemCount = queryClient.getQueryData<number | undefined>(itemCountQueryKey);

    const isFetchingItemCount = useIsFetching({
        queryKey: itemCountQueryKey,
    });

    const isFetching = useIsFetching({ queryKey: [`/api/${libraryId}/playlists`] });

    return (
        <ListHeader>
            <ListHeader.Left>
                <ListHeader.Title>Playlists</ListHeader.Title>
                <ListHeader.ItemCount value={isFetchingItemCount ? 0 : (itemCount ?? 0)} />
            </ListHeader.Left>
            <ListHeader.Right>
                <Group gap="xs">
                    <SearchButton />
                    <IconButtonWithTooltip
                        isCompact
                        icon="add"
                        size="lg"
                        tooltipProps={{ label: 'Create Playlist', openDelay: 500 }}
                        onClick={() => CreatePlaylistModal.call({ libraryId })}
                    />
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
                    <ListOptionsButton
                        columnOptions={playlistColumnOptions}
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

export const playlistColumnOptions = [
    { label: 'Row Index', value: ItemListColumn.ROW_INDEX },
    { label: 'Name', value: ItemListColumn.NAME },
    { label: 'Track Count', value: ItemListColumn.TRACK_COUNT },
    { label: 'Duration', value: ItemListColumn.DURATION },
    { label: 'Actions', value: ItemListColumn.ACTIONS },
];

const playlistSortLabelMap = {
    [PlaylistListSortOptions.NAME]: 'Name',
    [PlaylistListSortOptions.DURATION]: 'Duration',
    [PlaylistListSortOptions.OWNER]: 'Owner',
    [PlaylistListSortOptions.PUBLIC]: 'Public',
    [PlaylistListSortOptions.TRACK_COUNT]: 'Track Count',
    [PlaylistListSortOptions.UPDATED_AT]: 'Updated At',
};

function getSortOptions(
    features: LibraryFeatures,
): { label: string; value: PlaylistListSortOptions }[] {
    const playlistSortFeatures = Object.keys(features)
        .filter((key) => key.includes('playlist:list:filter'))
        .filter((key) => features[key as keyof LibraryFeatures]);

    return playlistSortFeatures.map((feature) => {
        const option = feature.replace('playlist:list:filter:', '') as PlaylistListSortOptions;
        return {
            label: playlistSortLabelMap[option],
            value: option,
        };
    });
}
