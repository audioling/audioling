import { Suspense, useState } from 'react';
import type { LibraryFeatures } from '@repo/shared-types';
import { LibraryItemType, TrackListSortOptions } from '@repo/shared-types';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router';
import stringify from 'safe-stable-stringify';
import type { TrackItem } from '@/api/api-types.ts';
import { fetchTrackListIndex } from '@/api/fetchers/tracks.ts';
import type { GetApiLibraryIdTracksParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { getGetApiLibraryIdTracksCountQueryKey } from '@/api/openapi-generated/tracks/tracks.ts';
import { useLibraryFeatures } from '@/features/authentication/stores/auth-store.ts';
import { ListFolderFilterButton } from '@/features/shared/list-folder-filter-button/list-folder-filter-button.tsx';
import { ListHeader } from '@/features/shared/list-header/list-header.tsx';
import { ListOptionsButton } from '@/features/shared/list-options-button/list-options-button.tsx';
import { ListSortByButton } from '@/features/shared/list-sort-by-button/list-sort-by-button.tsx';
import {
    libraryIndex,
    libraryIndexStatus,
} from '@/features/shared/offline-filters/offline-filter-utils.ts';
import {
    useIndexStatus,
    useOfflineListCountSuspense,
} from '@/features/shared/offline-filters/use-offline-list.ts';
import { RefreshButton } from '@/features/shared/refresh-button/refresh-button.tsx';
import { SearchButton } from '@/features/shared/search-button/search-button.tsx';
import { SortOrderButton } from '@/features/shared/sort-order-button/sort-order-button.tsx';
import { TrackQueryBuilder } from '@/features/tracks/query-builder/track-query-builder.tsx';
import {
    useTrackListStore,
    useTrackListStoreBase,
} from '@/features/tracks/store/track-list-store.ts';
import { Button } from '@/features/ui/button/button.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { ItemListColumn, itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { QueryFilter } from '@/features/ui/query-builder/query-builder.tsx';
import { serializeFilter } from '@/features/ui/query-builder/query-builder.tsx';
import { Tooltip } from '@/features/ui/tooltip/tooltip.tsx';
import { formatDateTime } from '@/utils/format-date.ts';

export function TrackListHeader({ handleRefresh }: { handleRefresh: () => void }) {
    const { libraryId } = useParams() as { libraryId: string };
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const mode = useTrackListStore.use.mode();
    const sortBy = useTrackListStore.use.sortBy();
    const sortOrder = useTrackListStore.use.sortOrder();
    const paginationType = useTrackListStore.use.paginationType();
    const columnOrder = useTrackListStore.use.columnOrder();

    const toggleMode = useTrackListStore.use.toggleMode();
    const setColumnOrder = useTrackListStore.use.setColumnOrder();
    const setPaginationType = useTrackListStore.use.setPaginationType();

    const itemCountQueryKey = getGetApiLibraryIdTracksCountQueryKey(libraryId, {
        searchTerm: searchParams.get('search') ?? undefined,
        sortBy,
        sortOrder,
    });

    const itemCount = queryClient.getQueryData<number | undefined>(itemCountQueryKey);
    const isFetchingItemCount = useIsFetching({ queryKey: itemCountQueryKey });

    const [filter, setFilter] = useState<QueryFilter | undefined>(
        useTrackListStoreBase.getState().queryBuilder,
    );

    const handleSubmitFilter = () => {
        if (!filter) {
            return;
        }

        return filter;
    };

    return (
        <ListHeader>
            <ListHeader.Left>
                <ListHeader.Title>Tracks</ListHeader.Title>
                {mode === 'offline' ? (
                    <OfflineItemCount />
                ) : (
                    <ListHeader.ItemCount value={isFetchingItemCount ? 0 : (itemCount ?? 0)} />
                )}
            </ListHeader.Left>
            <ListHeader.Right>
                <Group gap="xs">
                    <SearchButton />
                </Group>
            </ListHeader.Right>
            <ListHeader.Footer>
                <ListHeader.Left>
                    {mode === 'online' ? (
                        <OnlineLeftHeader handleRefresh={handleRefresh} />
                    ) : (
                        <OfflineLeftHeader
                            itemCount={itemCount}
                            onFilterSubmit={handleSubmitFilter}
                        />
                    )}
                </ListHeader.Left>
                <ListHeader.Right>
                    <Button leftIcon="menu" variant="default" onClick={toggleMode}>
                        {mode === 'online' ? 'Online Mode' : 'Query Mode'}
                    </Button>
                    <ListOptionsButton
                        columnOptions={trackColumnOptions}
                        columns={columnOrder}
                        paginationType={paginationType}
                        onChangeColumns={setColumnOrder}
                        onChangePaginationType={setPaginationType}
                    />
                </ListHeader.Right>
            </ListHeader.Footer>
            {mode === 'offline' && (
                <ListHeader.QueryBuilder>
                    <TrackQueryBuilder
                        defaultFilter={filter}
                        onFilterChange={(filter) => setFilter(filter)}
                    />
                </ListHeader.QueryBuilder>
            )}
        </ListHeader>
    );
}

function OfflineItemCountInner() {
    const { libraryId } = useParams() as { libraryId: string };
    const query = useTrackListStore.use.queryBuilder?.();

    const { data: itemCount } = useOfflineListCountSuspense({
        filter: query || {
            limit: undefined,
            rules: {
                conditions: [],
                groupId: 'root',
                operator: 'AND',
            },
            sortBy: [],
        },
        libraryId,
        type: LibraryItemType.TRACK,
    });

    return <ListHeader.ItemCount value={itemCount ?? 0} />;
}

function OfflineItemCount() {
    return (
        <Suspense fallback={<></>}>
            <OfflineItemCountInner />
        </Suspense>
    );
}

function OfflineLeftHeader({
    itemCount,
    onFilterSubmit,
}: {
    itemCount: number | undefined;
    onFilterSubmit: () => QueryFilter | undefined;
}) {
    const { libraryId } = useParams() as { libraryId: string };
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const sortBy = useTrackListStore.use.sortBy();
    const sortOrder = useTrackListStore.use.sortOrder();
    const [indexing, setIndexing] = useState<boolean | number>(false);

    const [queryError, setQueryError] = useState<Error | null>(null);

    const handleIndexTracks = async () => {
        if (indexing) {
            return libraryIndexStatus.abort(LibraryItemType.TRACK);
        }

        await libraryIndex.buildIndex<TrackItem>(LibraryItemType.TRACK, {
            fetcher: (page, limit) =>
                fetchTrackListIndex(queryClient, libraryId, {
                    limit: limit.toString(),
                    offset: (page * limit).toString(),
                    searchTerm: searchParams.get('search') ?? undefined,
                    sortBy,
                    sortOrder,
                } as GetApiLibraryIdTracksParams),
            onAborted: async () => {
                setIndexing(false);
                await queryClient.invalidateQueries({
                    queryKey: [libraryId, 'index', LibraryItemType.TRACK],
                });
            },
            onFinish: async () => {
                setIndexing(false);
                await queryClient.invalidateQueries({
                    queryKey: [libraryId, 'index', LibraryItemType.TRACK],
                });
            },
            onRecords: async (_records, progress) => {
                setIndexing(progress);
            },
            onStart: async () => {
                setIndexing(true);
                await queryClient.invalidateQueries({
                    queryKey: [libraryId, 'index', LibraryItemType.TRACK],
                });
            },
        });
    };

    const [isQuerying, setIsQuerying] = useState<boolean | 'force' | 'query'>(false);
    const setQueryBuilder = useTrackListStore.use.setQueryBuilder?.();
    const handleQuery = async (options: { force?: boolean } = {}) => {
        if (isQuerying) {
            return;
        }

        setQueryError(null);

        const filter = onFilterSubmit();

        if (!filter) {
            return;
        }

        setIsQuerying(options.force ? 'force' : 'query');

        try {
            const now = performance.now();

            await libraryIndex.runQuery(LibraryItemType.TRACK, filter, {
                force: options.force,
            });

            setIsQuerying(false);

            const offlineListItemCountQueryKey = libraryIndex.getCountQueryKey(
                libraryId,
                LibraryItemType.TRACK,
                stringify(serializeFilter(filter)),
            );

            const offlineListDataQueryKey = itemListHelpers.getDataQueryKey(
                libraryId,
                LibraryItemType.TRACK,
                true,
            );

            await queryClient.invalidateQueries({ queryKey: offlineListItemCountQueryKey });
            await queryClient.invalidateQueries({ queryKey: offlineListDataQueryKey });
            setQueryBuilder?.(filter);

            const end = performance.now();
            console.log(`Time taken: ${(end - now) / 1000} seconds`);
        } catch (error) {
            setIsQuerying(false);
            setQueryError(error as Error);
            console.error(error);
        }
    };

    const { data: indexStatus } = useIndexStatus({ type: LibraryItemType.TRACK });

    const isQueryingDisabled = !indexStatus || indexStatus.status === 'running';

    return (
        <Group gap="xs">
            <Tooltip
                isOpen={Boolean(queryError)}
                label={queryError?.message ?? ''}
                openDelay={0}
                position="bottom"
            >
                <Button
                    disabled={isQuerying === 'force' || isQueryingDisabled}
                    isLoading={isQuerying === 'query'}
                    variant="outline"
                    onClick={() => handleQuery({ force: false })}
                >
                    Submit
                </Button>
            </Tooltip>
            <Tooltip label="Force the query to be refetched" openDelay={0} position="bottom">
                <IconButton
                    disabled={isQuerying === 'query' || isQueryingDisabled}
                    icon="refresh"
                    isLoading={isQuerying === 'force'}
                    variant="outline"
                    onClick={() => handleQuery({ force: true })}
                />
            </Tooltip>

            <Tooltip
                isOpen={Boolean(indexing) || undefined}
                label={
                    indexing
                        ? `Abort - ${
                              typeof indexing === 'number' &&
                              `${((indexing / (itemCount || 0)) * 100).toFixed(2)}%`
                          }`
                        : 'Last indexed: ' +
                          (indexStatus?.lastUpdatedDate
                              ? formatDateTime(indexStatus.lastUpdatedDate)
                              : 'Never')
                }
                openDelay={0}
                position="bottom"
            >
                <IconButton icon="cache" variant="outline" onClick={handleIndexTracks} />
            </Tooltip>
        </Group>
    );
}

function OnlineLeftHeader({ handleRefresh }: { handleRefresh: () => void }) {
    const { libraryId } = useParams() as { libraryId: string };
    const features = useLibraryFeatures(libraryId);
    const sortOptions = getSortOptions(features);
    const folderId = useTrackListStore.use.folderId();
    const sortBy = useTrackListStore.use.sortBy();
    const sortOrder = useTrackListStore.use.sortOrder();

    const setFolderId = useTrackListStore.use.setFolderId();
    const setSortBy = useTrackListStore.use.setSortBy();
    const setSortOrder = useTrackListStore.use.setSortOrder();

    const isFetching = useIsFetching({ queryKey: [`/api/${libraryId}/tracks`] });

    return (
        <Group gap="xs" wrap="nowrap">
            <ListSortByButton options={sortOptions} sort={sortBy} onSortChanged={setSortBy} />
            <ListFolderFilterButton folderId={folderId} onFolderChanged={setFolderId} />
            <SortOrderButton order={sortOrder} onOrderChanged={setSortOrder} />
            <RefreshButton isLoading={Boolean(isFetching)} onRefresh={handleRefresh} />
        </Group>
    );
}

export const trackColumnOptions = [
    { label: 'Row Index', value: ItemListColumn.ROW_INDEX },
    { label: 'Image', value: ItemListColumn.IMAGE },
    { label: 'Name (Combined)', value: ItemListColumn.STANDALONE_COMBINED },
    { label: 'Name', value: ItemListColumn.NAME },
    { label: 'Album', value: ItemListColumn.ALBUM },
    { label: 'Duration', value: ItemListColumn.DURATION },
    { label: 'Disc Number', value: ItemListColumn.DISC_NUMBER },
    { label: 'Artists', value: ItemListColumn.ARTISTS },
    { label: 'Genre', value: ItemListColumn.GENRE },
    { label: 'Release Date', value: ItemListColumn.RELEASE_DATE },
    { label: 'Track Number', value: ItemListColumn.TRACK_NUMBER },
    { label: 'Year', value: ItemListColumn.YEAR },
    { label: 'Last Played', value: ItemListColumn.LAST_PLAYED },
    { label: 'BPM', value: ItemListColumn.BPM },
    { label: 'Quality', value: ItemListColumn.QUALITY },
    { label: 'File Name', value: ItemListColumn.FILE_NAME },
    { label: 'File Path', value: ItemListColumn.FILE_PATH },
    { label: 'File Size', value: ItemListColumn.FILE_SIZE },
    { label: 'Play Count', value: ItemListColumn.PLAY_COUNT },
    { label: 'Rating', value: ItemListColumn.RATING },
    { label: 'Favorite', value: ItemListColumn.FAVORITE },
    { label: 'Actions', value: ItemListColumn.ACTIONS },
];

export const trackSortLabelMap = {
    [TrackListSortOptions.ALBUM]: 'Album',
    [TrackListSortOptions.ALBUM_ARTIST]: 'Album Artist',
    [TrackListSortOptions.ARTIST]: 'Artist',
    [TrackListSortOptions.BPM]: 'BPM',
    [TrackListSortOptions.CHANNELS]: 'Channels',
    [TrackListSortOptions.COMMENT]: 'Comment',
    [TrackListSortOptions.DURATION]: 'Duration',
    [TrackListSortOptions.GENRE]: 'Genre',
    [TrackListSortOptions.ID]: 'Id',
    [TrackListSortOptions.IS_FAVORITE]: 'Is Favorite',
    [TrackListSortOptions.NAME]: 'Name',
    [TrackListSortOptions.PLAY_COUNT]: 'Play Count',
    [TrackListSortOptions.RANDOM]: 'Random',
    [TrackListSortOptions.RATING]: 'Rating',
    [TrackListSortOptions.RECENTLY_ADDED]: 'Recently Added',
    [TrackListSortOptions.RECENTLY_PLAYED]: 'Recently Played',
    [TrackListSortOptions.RELEASE_DATE]: 'Release Date',
    [TrackListSortOptions.YEAR]: 'Year',
};

function getSortOptions(
    features: LibraryFeatures,
): { label: string; value: TrackListSortOptions }[] {
    const trackSortFeatures = Object.keys(features)
        .filter((key) => key.includes('track:list:filter'))
        .filter((key) => features[key as keyof LibraryFeatures]);

    return trackSortFeatures.map((feature) => {
        const option = feature.replace('track:list:filter:', '') as TrackListSortOptions;
        return {
            label: trackSortLabelMap[option],
            value: option,
        };
    });
}
