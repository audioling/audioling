import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import type { QueryFunction, QueryKey } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid/non-secure';
import { useLocation } from 'react-router';
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
    listKey: string;
    pagination: ItemListPaginationState;
    params: Record<string, unknown>;
    type: LibraryItemType;
}) {
    const { libraryId, listKey, pagination, params, type } = args;

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
            const listQueryKey = itemListHelpers.getListQueryKey(libraryId, listKey, type);

            const dataWithUniqueId = data.map((item: { id: string }) => ({
                data: item,
                id: item.id,
                uniqueId: nanoid(),
            }));

            queryClient.setQueryData(dataQueryKey, (prev: ItemQueryData | undefined) => {
                const updates: ItemQueryData = {
                    ...prev,
                };

                for (const item of dataWithUniqueId) {
                    updates[item.id] = item.data;
                }
                return updates;
            });

            queryClient.setQueryData(listQueryKey, (prev: ListQueryData | undefined) => {
                const updates: ListQueryData = {
                    ...prev,
                };

                for (const item of dataWithUniqueId) {
                    updates[item.uniqueId] = item.id;
                }
                return updates;
            });

            setData(dataWithUniqueId.map((item: { uniqueId: string }) => item.uniqueId));
        };

        fetchData();
    }, [
        libraryId,
        listKey,
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
    listKey: string;
    pagination: ItemListPaginationState;
    params: Record<string, unknown>;
    pathParams?: Record<string, unknown>;
    type: LibraryItemType;
}) {
    const { itemCount, libraryId, listKey, pagination, params, type, pathParams } = args;

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

    const listQueryKey = itemListHelpers.getListQueryKey(libraryId, listKey, type);
    const dataQueryKey = itemListHelpers.getDataQueryKey(libraryId, type);

    const handleRangeChanged = useCallback(
        async (event: { endIndex: number; startIndex: number }) => {
            const { startIndex, endIndex } = event;

            if (!query) return;

            const pagesToLoad = itemListHelpers.getPagesToLoad(queryClient, {
                endIndex,
                listQueryKey,
                loadedPages: loadedPages,
                pageSize: pagination.itemsPerPage,
                startIndex,
            });

            if (pagesToLoad.length > 0) {
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

                    const { data } = await queryClient.fetchQuery({
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        queryFn: fn as QueryFunction<any, any>,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        queryKey: query.queryKey(fetchParams as any),
                    });

                    const dataWithUniqueId = data.map((item: { id: string }) => ({
                        data: item,
                        id: item.id,
                        uniqueId: nanoid(),
                    }));

                    queryClient.setQueryData(listQueryKey, (prev: ListQueryData | undefined) => {
                        const updates: ListQueryData = {
                            ...prev,
                        };

                        for (const item of dataWithUniqueId) {
                            updates[item.uniqueId] = item.id;
                        }

                        return updates;
                    });

                    queryClient.setQueryData(dataQueryKey, (prev: ItemQueryData | undefined) => {
                        const updates: ItemQueryData = {
                            ...prev,
                        };

                        for (const item of dataWithUniqueId) {
                            updates[item.id] = item.data;
                        }
                        return updates;
                    });

                    setData((prevData) => {
                        const newData = [...prevData];
                        const startIndex = currentOffset;
                        dataWithUniqueId.forEach((item: { uniqueId: string }, index: number) => {
                            newData[startIndex + index] = item.uniqueId;
                        });
                        return newData;
                    });
                }
            }
        },
        [dataQueryKey, listQueryKey, pagination.itemsPerPage, params, query, queryClient],
    );

    return { data, handleRangeChanged, setData };
}
