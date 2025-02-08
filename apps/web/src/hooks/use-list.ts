import type { Dispatch, MouseEvent } from 'react';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import type { QueryFunction, QueryKey } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router';
import type { AppDbType } from '@/api/db/app-db.ts';
import { appDb, appDbTypeMap } from '@/api/db/app-db.ts';
import {
    getApiLibraryIdAlbumArtists,
    getGetApiLibraryIdAlbumArtistsQueryKey,
    usePostApiLibraryIdAlbumArtistsCountInvalidate,
} from '@/api/openapi-generated/album-artists/album-artists.ts';
import {
    getApiLibraryIdAlbums,
    getGetApiLibraryIdAlbumsQueryKey,
    usePostApiLibraryIdAlbumsCountInvalidate,
} from '@/api/openapi-generated/albums/albums.ts';
import type {
    GetApiLibraryIdAlbumArtistsParams,
    GetApiLibraryIdAlbumsParams,
    GetApiLibraryIdGenresParams,
    GetApiLibraryIdPlaylistsIdTracksParams,
    GetApiLibraryIdPlaylistsParams,
    GetApiLibraryIdTracksParams,
} from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import {
    getApiLibraryIdGenres,
    getGetApiLibraryIdGenresQueryKey,
} from '@/api/openapi-generated/genres/genres.ts';
import {
    getApiLibraryIdPlaylists,
    getApiLibraryIdPlaylistsIdTracks,
    getGetApiLibraryIdPlaylistsIdTracksQueryKey,
    getGetApiLibraryIdPlaylistsQueryKey,
    usePostApiLibraryIdPlaylistsCountInvalidate,
} from '@/api/openapi-generated/playlists/playlists.ts';
import {
    getApiLibraryIdTracks,
    getGetApiLibraryIdTracksQueryKey,
    usePostApiLibraryIdTracksCountInvalidate,
} from '@/api/openapi-generated/tracks/tracks.ts';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import { debounce } from '@/utils/debounce.ts';
import { randomString } from '@/utils/random-string.ts';
import { safeStringify } from '@/utils/stringify.ts';

interface UseListInitializeProps {
    setListId: (key: string, listId: string) => void;
}

export function useListInitialize({ setListId }: UseListInitializeProps) {
    const location = useLocation();
    const id = randomString(12);

    useEffect(() => {
        setListId(location.pathname, id);
    }, [id, location.pathname, setListId]);

    return id;
}

export function useListKey(args: Record<string, unknown>) {
    const location = useLocation();

    const key = safeStringify({
        ...args,
        location: location.pathname,
    });

    return key;
}

interface UseRefreshListProps {
    itemType: LibraryItemType;
    libraryId: string;
    queryKey: QueryKey;
}

export function useRefreshList({ queryKey, libraryId, itemType }: UseRefreshListProps) {
    const location = useLocation();
    const queryClient = useQueryClient();

    const [listId, setListId] = useState<string>(
        itemListHelpers.generateListId(libraryId, location.pathname),
    );

    const invalidateAlbumCount = usePostApiLibraryIdAlbumsCountInvalidate();
    const invalidateTrackCount = usePostApiLibraryIdTracksCountInvalidate();
    const invalidateAlbumArtistCount = usePostApiLibraryIdAlbumArtistsCountInvalidate();
    const invalidatePlaylistCount = usePostApiLibraryIdPlaylistsCountInvalidate();

    const handleRefresh = async () => {
        switch (itemType) {
            case LibraryItemType.ALBUM:
                await invalidateAlbumCount.mutateAsync({ libraryId });
                break;
            case LibraryItemType.TRACK:
                await invalidateTrackCount.mutateAsync({ libraryId });
                break;
            case LibraryItemType.ARTIST:
                await invalidateAlbumArtistCount.mutateAsync({ libraryId });
                break;
            case LibraryItemType.ALBUM_ARTIST:
                await invalidateAlbumArtistCount.mutateAsync({ libraryId });
                break;
            case LibraryItemType.PLAYLIST:
                await invalidatePlaylistCount.mutateAsync({ libraryId });
                break;
        }

        // Invalidate the list fetch query
        await queryClient.invalidateQueries({ queryKey });

        queryClient.removeQueries({
            exact: false,
            queryKey: [libraryId, 'list', itemType],
        });

        setListId(itemListHelpers.generateListId(libraryId, location.pathname));
    };

    return { handleRefresh, listId };
}

interface UseListPaginationProps {
    pagination: ItemListPaginationState;
    setPagination: (pagination: ItemListPaginationState) => void;
}

export function useListPagination({ pagination, setPagination }: UseListPaginationProps) {
    const onFirstPage = useCallback(
        () => setPagination({ ...pagination, currentPage: 0 }),
        [pagination, setPagination],
    );

    const onLastPage = useCallback(
        () => setPagination({ ...pagination, currentPage: 0 }),
        [pagination, setPagination],
    );

    const onNextPage = useCallback(
        () => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 }),
        [pagination, setPagination],
    );

    const onPageChange = useCallback(
        (page: number) => setPagination({ ...pagination, currentPage: page }),
        [pagination, setPagination],
    );

    const onPreviousPage = useCallback(
        () => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 }),
        [pagination, setPagination],
    );

    return { onFirstPage, onLastPage, onNextPage, onPageChange, onPreviousPage };
}

export type ListQueryData = Record<string, string>;

export type ItemQueryData = Record<string, unknown>;

export function usePaginatedListData(args: {
    libraryId: string;
    pagination: ItemListPaginationState;
    params: Record<string, unknown>;
    type: LibraryItemType;
}) {
    const { libraryId, pagination, params, type } = args;

    const queryClient = useQueryClient();
    const [data, setData] = useState<(string | undefined)[]>(
        itemListHelpers.getInitialData(pagination.itemsPerPage),
    );

    const query = useMemo(() => {
        const fetchParams = {
            ...params,
            limit: pagination.itemsPerPage.toString(),
            offset: ((pagination.currentPage - 1) * pagination.itemsPerPage).toString(),
        };

        if (type === LibraryItemType.ALBUM) {
            return {
                queryFn: () =>
                    getApiLibraryIdAlbums(libraryId, fetchParams as GetApiLibraryIdAlbumsParams),
                queryKey: getGetApiLibraryIdAlbumsQueryKey(
                    libraryId,
                    fetchParams as GetApiLibraryIdAlbumsParams,
                ),
            };
        }

        if (type === LibraryItemType.ALBUM_ARTIST) {
            return {
                queryFn: () =>
                    getApiLibraryIdAlbumArtists(
                        libraryId,
                        fetchParams as GetApiLibraryIdAlbumArtistsParams,
                    ),
                queryKey: getGetApiLibraryIdAlbumArtistsQueryKey(
                    libraryId,
                    fetchParams as GetApiLibraryIdAlbumArtistsParams,
                ),
            };
        }

        if (type === LibraryItemType.GENRE) {
            return {
                queryFn: () =>
                    getApiLibraryIdGenres(libraryId, fetchParams as GetApiLibraryIdGenresParams),
                queryKey: getGetApiLibraryIdGenresQueryKey(
                    libraryId,
                    fetchParams as GetApiLibraryIdGenresParams,
                ),
            };
        }

        if (type === LibraryItemType.PLAYLIST) {
            return {
                queryFn: () =>
                    getApiLibraryIdPlaylists(
                        libraryId,
                        fetchParams as GetApiLibraryIdPlaylistsParams,
                    ),
                queryKey: getGetApiLibraryIdPlaylistsQueryKey(
                    libraryId,
                    fetchParams as GetApiLibraryIdPlaylistsParams,
                ),
            };
        }

        if (type === LibraryItemType.TRACK) {
            return {
                queryFn: () =>
                    getApiLibraryIdTracks(libraryId, fetchParams as GetApiLibraryIdTracksParams),
                queryKey: getGetApiLibraryIdTracksQueryKey(
                    libraryId,
                    fetchParams as GetApiLibraryIdTracksParams,
                ),
            };
        }

        return null;
    }, [pagination, params, type, libraryId]);

    useEffect(() => {
        const fetchData = async () => {
            if (!query) return;

            const { data } = await queryClient.fetchQuery({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                queryFn: query.queryFn as QueryFunction<any, any>,
                queryKey: query.queryKey,
            });

            const dataQueryKey = itemListHelpers.getDataQueryKey(libraryId, type);

            queryClient.setQueryData(dataQueryKey, (prev: ItemQueryData | undefined) => {
                const updates: ItemQueryData = {
                    ...prev,
                };

                for (const item of data) {
                    updates[item.id] = item;
                }
                return updates;
            });

            setData(data.map((item: { id: string }) => item.id));
        };

        fetchData();
    }, [
        libraryId,
        pagination.currentPage,
        pagination.itemsPerPage,
        params,
        query,
        queryClient,
        type,
    ]);

    return { data, setData };
}

export function useInfiniteListData(args: {
    itemCount: number;
    libraryId: string;
    maxLoadedPages?: number;
    pagination: ItemListPaginationState;
    params: Record<string, unknown>;
    pathParams?: Record<string, unknown>;
    type: LibraryItemType;
}) {
    const { itemCount, libraryId, pagination, params, type, pathParams, maxLoadedPages = 3 } = args;

    const queryClient = useQueryClient();

    const [data, setData] = useState<(string | undefined)[]>(
        itemListHelpers.getInitialData(itemCount),
    );

    const loadedPages = useRef<Record<number, boolean>>({});

    useEffect(() => {
        loadedPages.current = itemListHelpers.getPageMap(itemCount, pagination.itemsPerPage);
    }, [itemCount, pagination.itemsPerPage]);

    const query = useMemo(() => {
        if (type === LibraryItemType.ALBUM) {
            return {
                queryFn: (params: GetApiLibraryIdAlbumsParams) => () =>
                    getApiLibraryIdAlbums(libraryId, params),
                queryKey: (params: GetApiLibraryIdAlbumsParams) =>
                    getGetApiLibraryIdAlbumsQueryKey(libraryId, params),
            };
        }

        if (type === LibraryItemType.ALBUM_ARTIST) {
            return {
                queryFn: (params: GetApiLibraryIdAlbumArtistsParams) => () =>
                    getApiLibraryIdAlbumArtists(libraryId, params),
                queryKey: (params: GetApiLibraryIdAlbumArtistsParams) =>
                    getGetApiLibraryIdAlbumArtistsQueryKey(libraryId, params),
            };
        }

        if (type === LibraryItemType.GENRE) {
            return {
                queryFn: (params: GetApiLibraryIdGenresParams) => () =>
                    getApiLibraryIdGenres(libraryId, params),
                queryKey: (params: GetApiLibraryIdGenresParams) =>
                    getGetApiLibraryIdGenresQueryKey(libraryId, params),
            };
        }

        if (type === LibraryItemType.PLAYLIST) {
            return {
                queryFn: (params: GetApiLibraryIdPlaylistsParams) => () =>
                    getApiLibraryIdPlaylists(libraryId, params),
                queryKey: (params: GetApiLibraryIdPlaylistsParams) =>
                    getGetApiLibraryIdPlaylistsQueryKey(libraryId, params),
            };
        }

        if (type === LibraryItemType.TRACK) {
            return {
                queryFn: (params: GetApiLibraryIdTracksParams) => () =>
                    getApiLibraryIdTracks(libraryId, params),
                queryKey: (params: GetApiLibraryIdTracksParams) =>
                    getGetApiLibraryIdTracksQueryKey(libraryId, params),
            };
        }

        if (type === LibraryItemType.PLAYLIST_TRACK) {
            return {
                queryFn: (params: GetApiLibraryIdPlaylistsIdTracksParams) => () =>
                    getApiLibraryIdPlaylistsIdTracks(libraryId, pathParams?.id as string, params),
                queryKey: (params: GetApiLibraryIdPlaylistsIdTracksParams) =>
                    getGetApiLibraryIdPlaylistsIdTracksQueryKey(
                        libraryId,
                        pathParams?.id as string,
                        params,
                    ),
            };
        }

        return null;
    }, [libraryId, pathParams?.id, type]);

    const dataQueryKey = itemListHelpers.getDataQueryKey(libraryId, type);

    const lastStartIndex = useRef(0);

    const handleRangeChanged = useCallback(
        async (event: { endIndex: number; startIndex: number }) => {
            const { startIndex, endIndex } = event;

            if (!query) return;

            const scrollingUp = startIndex < lastStartIndex.current;
            lastStartIndex.current = startIndex;

            const pagesToLoad = itemListHelpers.getPagesToLoad({
                endIndex,
                loadedPages: loadedPages,
                pageSize: pagination.itemsPerPage,
                startIndex,
            });

            if (pagesToLoad.length > 0) {
                const currentLoadedPages = Object.entries(loadedPages.current)
                    .filter(([, isLoaded]) => isLoaded)
                    .map(([page]) => Number(page));

                if (currentLoadedPages.length + pagesToLoad.length > maxLoadedPages) {
                    const currentPageRange = {
                        end: Math.ceil(endIndex / pagination.itemsPerPage),
                        start: Math.floor(startIndex / pagination.itemsPerPage),
                    };

                    const sortedPages = currentLoadedPages.sort((a, b) => {
                        // Calculate distances from both edges of viewport
                        const aStartDist = Math.abs(a - currentPageRange.start);
                        const aEndDist = Math.abs(a - currentPageRange.end);
                        const bStartDist = Math.abs(b - currentPageRange.start);
                        const bEndDist = Math.abs(b - currentPageRange.end);

                        // Get the minimum distance for each page
                        const aMinDist = Math.min(aStartDist, aEndDist);
                        const bMinDist = Math.min(bStartDist, bEndDist);

                        if (aMinDist !== bMinDist) {
                            return bMinDist - aMinDist; // Sort by distance, furthest first
                        }

                        // If distances are equal, use scroll direction to break tie
                        if (scrollingUp) {
                            return b - a; // When scrolling up, prefer unloading higher numbered pages
                        } else {
                            return a - b; // When scrolling down, prefer unloading lower numbered pages
                        }
                    });

                    const pagesToUnloadCount =
                        currentLoadedPages.length + pagesToLoad.length - maxLoadedPages;
                    const pagesToUnload = sortedPages.slice(0, pagesToUnloadCount);

                    queueMicrotask(() => {
                        pagesToUnload.forEach((page) => {
                            delete loadedPages.current[page];
                            const startIdx = page * pagination.itemsPerPage;
                            const endIdx = startIdx + pagination.itemsPerPage;

                            const unloadedIds = data
                                .slice(startIdx, endIdx)
                                .filter((id): id is string => id !== undefined);

                            queryClient.setQueryData(
                                dataQueryKey,
                                (prev: ItemQueryData | undefined) => {
                                    if (!prev) return prev;
                                    const updates = { ...prev };
                                    unloadedIds.forEach((id) => {
                                        delete updates[id];
                                    });
                                    return updates;
                                },
                            );
                        });
                    });
                }

                for (const page of pagesToLoad) {
                    loadedPages.current[page] = true;

                    const currentOffset = page * pagination.itemsPerPage;
                    const fetchParams = {
                        ...params,
                        limit: pagination.itemsPerPage.toString(),
                        offset: currentOffset.toString(),
                    };

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const fn = query.queryFn(fetchParams as any);

                    const { data: pageData } = await queryClient.fetchQuery({
                        gcTime: 0,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        queryFn: fn as QueryFunction<any, any>,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        queryKey: query.queryKey(fetchParams as any),
                        staleTime: 0,
                    });

                    // Queue the data updates in a microtask
                    queueMicrotask(() => {
                        queryClient.setQueryData(
                            dataQueryKey,
                            (prev: ItemQueryData | undefined) => {
                                const updates: ItemQueryData = {
                                    ...prev,
                                };

                                for (const item of pageData) {
                                    updates[item.id] = item;
                                }

                                return updates;
                            },
                        );

                        setData((prevData) => {
                            const newData = [...prevData];
                            const startIndex = currentOffset;
                            pageData.forEach((item: { id: string }, index: number) => {
                                newData[startIndex + index] = item.id;
                            });
                            return newData;
                        });

                        appDb?.setBatch(
                            appDbTypeMap[type as keyof typeof appDbTypeMap] as AppDbType,
                            pageData.map((item: { id: string }) => ({
                                key: item.id,
                                value: item,
                            })),
                        );
                    });
                }
            }
        },
        [
            query,
            pagination.itemsPerPage,
            maxLoadedPages,
            data,
            queryClient,
            dataQueryKey,
            params,
            type,
        ],
    );

    const debouncedHandleRangeChanged = debounce(handleRangeChanged, 100);

    return { data, handleRangeChanged: debouncedHandleRangeChanged, setData };
}

export type ItemListInternalReducers = {
    _itemExpandedReducer: Dispatch<SelectionStateAction>;
    _itemSelectionReducer: Dispatch<SelectionStateAction>;
    addSelection: (id: string) => void;
    clearAndSetGroupCollapsedById: (id: string) => void;
    clearAndSetSelectionById: (id: string) => void;
    clearGroupCollapsed: () => void;
    clearSelection: () => void;
    getGroupCollapsed: () => Record<string, boolean>;
    getGroupCollapsedById: (id: string) => boolean;
    getSelection: () => Record<string, boolean>;
    getSelectionById: (id: string) => boolean;
    removeSelectionById: (id: string) => void;
    setGroupCollapsed: (values: Record<string, boolean>) => void;
    setGroupCollapsedById: (id: string, expanded: boolean) => void;
    setSelection: (values: Record<string, boolean>) => void;
    setSelectionById: (id: string, selected: boolean) => void;
    toggleSelectionById: (id: string) => void;
};

export interface ItemListInternalState {
    _onMultiSelectionClick: (
        id: string,
        dataIds: string[],
        index: number,
        e: MouseEvent<HTMLDivElement>,
    ) => void;
    _onSingleSelectionClick: (id: string, e: MouseEvent<HTMLDivElement>) => void;
    groupCollapsed: Record<string, boolean>;
    itemExpanded: Record<string, boolean>;
    itemSelection: Record<string, boolean>;
    reducers: ItemListInternalReducers;
}

type SelectionStateAction =
    | {
          id: string;
          type: 'addById';
      }
    | {
          type: 'clear';
      }
    | {
          id: string;
          type: 'clearAndSetById';
      }
    | {
          id: string;
          type: 'removeById';
      }
    | {
          type: 'set';
          values: Record<string, boolean>;
      }
    | {
          id: string;
          type: 'setById';
          value: boolean;
      }
    | {
          id: string;
          type: 'toggleById';
      };

function selectionStateReducer(
    state: Record<string, boolean>,
    action: SelectionStateAction,
): Record<string, boolean> {
    switch (action.type) {
        case 'addById': {
            return { ...state, [action.id]: true };
        }

        case 'clear': {
            return {};
        }

        case 'clearAndSetById': {
            return { [action.id]: true };
        }

        case 'set': {
            return { ...state, ...action.values };
        }

        case 'setById': {
            return { ...state, [action.id]: action.value };
        }

        case 'removeById': {
            const newState = { ...state };
            delete newState[action.id];
            return newState;
        }

        case 'toggleById': {
            return { ...state, [action.id]: !state[action.id] };
        }
    }
}

export function useItemListInternalState(): ItemListInternalState {
    const [itemSelection, dispatchItemSelection] = useReducer(selectionStateReducer, {});
    const [itemExpanded, dispatchItemExpanded] = useReducer(selectionStateReducer, {});
    const [groupCollapsed, dispatchGroupCollapsed] = useReducer(selectionStateReducer, {});

    const lastSelectedIndex = useRef<number | null>(null);

    const _onMultiSelectionClick = (
        id: string,
        dataIds: string[],
        index: number,
        e: MouseEvent<HTMLDivElement>,
    ) => {
        // If SHIFT is pressed, toggle the range selection
        if (e.shiftKey) {
            const currentIndex = index;

            if (currentIndex === -1) return;

            const itemsToToggle = itemListHelpers.table.getItemRange(
                dataIds,
                currentIndex,
                Number(lastSelectedIndex.current),
            );

            if (itemsToToggle.length > 0) {
                dispatchItemSelection({
                    type: 'set',
                    values: itemsToToggle.reduce(
                        (acc, item) => {
                            acc[item as string] = true;
                            return acc;
                        },
                        {} as Record<string, boolean>,
                    ),
                });
            }

            // If CTRL is pressed, toggle the selection
        } else if (e.ctrlKey) {
            dispatchItemSelection({
                id,
                type: 'toggleById',
            });

            // If no modifier key is pressed, replace the selection with the new item or toggle if already selected
        } else {
            const isSelfSelected = itemSelection[id];

            if (isSelfSelected && Object.keys(itemSelection).length === 1) {
                dispatchItemSelection({
                    type: 'clear',
                });
            } else {
                dispatchItemSelection({
                    id,
                    type: 'clearAndSetById',
                });
            }
        }

        lastSelectedIndex.current = index;
    };

    const _onSingleSelectionClick = (id: string) => {
        const isSelfSelected = itemSelection[id];

        if (isSelfSelected && Object.keys(itemSelection).length === 1) {
            dispatchItemSelection({
                type: 'clear',
            });
        } else {
            dispatchItemSelection({
                id,
                type: 'clearAndSetById',
            });
        }
    };

    const reducers = {
        _itemExpandedReducer: dispatchItemExpanded,
        _itemSelectionReducer: dispatchItemSelection,
        addSelection: (id: string) => {
            dispatchItemSelection({ id, type: 'addById' });
        },
        clearAndSetGroupCollapsedById: (id: string) => {
            dispatchGroupCollapsed({ id, type: 'clearAndSetById' });
        },
        clearAndSetSelectionById: (id: string) => {
            dispatchItemSelection({ id, type: 'clearAndSetById' });
        },
        clearGroupCollapsed: () => {
            dispatchGroupCollapsed({ type: 'clear' });
        },
        clearSelection: () => {
            dispatchItemSelection({ type: 'clear' });
        },
        getGroupCollapsed: () => {
            return groupCollapsed;
        },
        getGroupCollapsedById: (id: string) => {
            return groupCollapsed[id];
        },
        getSelection: () => {
            return itemSelection;
        },
        getSelectionById: (id: string) => {
            return itemSelection[id];
        },
        removeSelectionById: (id: string) => {
            dispatchItemSelection({ id, type: 'removeById' });
        },
        setGroupCollapsed: (values: Record<string, boolean>) => {
            dispatchGroupCollapsed({ type: 'set', values });
        },
        setGroupCollapsedById: (id: string, expanded: boolean) => {
            dispatchGroupCollapsed({ id, type: 'setById', value: expanded });
        },
        setSelection: (values: Record<string, boolean>) => {
            dispatchItemSelection({ type: 'set', values });
        },
        setSelectionById: (id: string, selected: boolean) => {
            dispatchItemSelection({ id, type: 'setById', value: selected });
        },
        toggleSelectionById: (id: string) => {
            dispatchItemSelection({ id, type: 'toggleById' });
        },
    };

    return {
        _onMultiSelectionClick,
        _onSingleSelectionClick,
        groupCollapsed,
        itemExpanded,
        itemSelection,
        reducers,
    };
}
