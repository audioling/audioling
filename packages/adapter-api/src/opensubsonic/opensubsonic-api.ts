import type { OpenSubsonicApiClient as OS } from '@audioling/open-subsonic-api-client';
import type {
    AdapterAlbumListQuery,
    AdapterAPI,
    AdapterArtistListQuery,
    AdapterGenre,
    AdapterPlaylist,
    AdapterPlaylistListQuery,
    AdapterPlaylistTrack,
    AdapterPlaylistTrackListQuery,
    AdapterTrack,
    AdapterTrackListQuery,
    AdapterUser,
} from '@repo/shared-types/adapter-types';
import type { AuthServer } from '@repo/shared-types/app-types';
import type { FetchOptions } from 'ofetch';
import { localize } from '@repo/localization';
import { AlbumListSortOptions, ServerItemType } from '@repo/shared-types/app-types';
import dayjs from 'dayjs';
import md5 from 'md5';
import { ofetch } from 'ofetch';
import { generateRandomString, helpers } from '../helpers.js';
import { osUtils } from './utils.js';

type ResponseType<T extends (...args: any) => any> =
    Extract<Awaited<ReturnType<T>>, { status: 200 }>['body']['subsonic-response'];

type RawResponseType<T extends (...args: any) => any> = Extract<Awaited<ReturnType<T>>, { status: 200 }>['body'];

type QueryParams<T extends (...args: any) => any> = Required<Parameters<T>>[0]['query'];

type AlbumSortType = Parameters<
    OS['getAlbumList2']['os']['1']['get']
>[0]['query']['type'];

export const adapter: Partial<AdapterAPI> = {};

function serializeCredential(username: string, credential: Record<string, string>, type: string) {
    switch (type) {
        case 'apiKey':
            return `{ apiKey: ${credential.apiKey} }`;
        case 'plaintext':
            return `{ u: ${username}, p: ${credential.password} }`;
        case 'token':
            return `{ u: ${username}, s: ${credential.s}, t: ${credential.t} }`;
        default:
            throw new Error(`Invalid credential type: ${type}`);
    }
}

function deserializeCredential(credential: string): Record<string, string> {
    return JSON.parse(credential);
}

function fetchClient<TResponseType>(url: string, server: AuthServer, options?: FetchOptions<'json'>) {
    return ofetch<TResponseType>(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        onRequest({ options }) {
            const query = options?.query ?? {};
            query.c = import.meta.env.VITE_APP_NAME;
            query.v = '1.16.1';
            query.f = 'json';

            if (server.user) {
                const deserializedCredential = deserializeCredential(server.user?.credential);

                Object.entries(deserializedCredential).forEach(([key, value]) => {
                    query[key] = value;
                });
            }
        },
        parseResponse: (response) => {
            return (response as any)['subsonic-response'];
        },
        responseType: 'json',
    });
}

adapter._getCoverArtUrl = ({ id, size }, server) => {
    const credentialParams = '';

    if (!server.user) {
        throw new Error(localize.t('errors.userNotFound'));
    }

    return (
        `${server.baseUrl}/rest/getCoverArt.view`
        + `?id=${id}`
        + `&${credentialParams}`
        + `&u=${server.user.username}`
        + `&v=$1.16.1`
        + `&size=${size}`
        + `&c=${import.meta.env.VITE_APP_NAME}`
    );
};

adapter._getStreamUrl = ({ id }, server) => {
    const credentialParams = '';

    if (!server.user) {
        throw new Error(localize.t('errors.userNotFound'));
    }

    return (
        `${server.baseUrl}/rest/stream.view`
        + `?id=${id}`
        + `&${credentialParams}`
        + `&u=${server.user.username}`
        + `&v=$1.16.1`
        + `&c=${import.meta.env.VITE_APP_NAME}`
    );
};

adapter.album = {
    getAlbumDetail: async (request, server) => {
        const url = `${server.baseUrl}/rest/getAlbum.view`;

        const query: QueryParams<OS['getAlbum']['os']['1']['get']> = {
            id: request.query.id,
        };

        const res = await fetchClient<ResponseType<OS['getAlbum']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (res.status !== 'ok') {
            return [{ code: Number(res.status), message: res as unknown as string }, null];
        }

        const album = osUtils.converter.albumToAdapter(res.album);

        return [null, album];
    },
    getAlbumList: async (request, server) => {
        const [err, totalRecordCount] = await adapter.album!.getAlbumListCount(request, server);

        if (err) {
            return [err, null];
        }

        if (request.query.searchTerm) {
            const url = `${server.baseUrl}/rest/search3.view`;
            if (request.query.limit === -1) {
                const fetcherFn = async (page: number, limit: number) => {
                    const result = await fetchClient<ResponseType<OS['search3']['os']['1']['get']>>(url, server, {
                        method: 'GET',
                        query: {
                            albumCount: limit,
                            albumOffset: page * limit,
                            artistCount: 0,
                            artistOffset: 0,
                            query: request.query.searchTerm,
                            songCount: 0,
                            songOffset: 0,
                        },
                    });

                    if (result.status !== 'ok') {
                        throw new Error(JSON.stringify(result));
                    }

                    return result.searchResult3.album || [];
                };

                const results = await helpers.fetchAllRecords({
                    fetcher: fetcherFn,
                    fetchLimit: request.query.limit,
                });

                const items = results.map(osUtils.converter.albumToAdapter);

                const sorted = helpers.sortBy.album(
                    items,
                    request.query.sortBy,
                    request.query.sortOrder,
                );

                const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

                return [
                    null,
                    {
                        items: paginated.items,
                        limit: paginated.limit,
                        offset: paginated.offset,
                        totalRecordCount: results.length,
                    },
                ];
            }

            const query: QueryParams<OS['search3']['os']['1']['get']> = {
                albumCount: request.query.limit,
                albumOffset: request.query.offset,
                artistCount: 0,
                artistOffset: 0,
                query: request.query.searchTerm,
                songCount: 0,
                songOffset: 0,
            };

            const result = await fetchClient<ResponseType<OS['search3']['os']['1']['get']>>(url, server, {
                method: 'GET',
                query,
            });

            if (result.status !== 'ok') {
                return [{ code: 500, message: result as unknown as string }, null];
            }

            const items = (result.searchResult3.album || []).map(
                osUtils.converter.albumToAdapter,
            );

            return [
                null,
                {
                    items,
                    limit: request.query.limit,
                    offset: request.query.offset,
                    totalRecordCount,
                },
            ];
        }

        const url = `${server.baseUrl}/rest/getAlbumList2.view`;

        let sortType: AlbumSortType = 'alphabeticalByName';

        let offset: number = request.query.offset;
        let reverseResult: boolean = false;
        let fromYear: number | undefined;
        let toYear: number | undefined;
        switch (request.query.sortBy) {
            case AlbumListSortOptions.ALBUM_ARTIST:
                // Default is ascending
                sortType = 'alphabeticalByArtist';

                if (request.query.sortOrder === 'desc') {
                    offset = totalRecordCount - request.query.offset - request.query.limit;
                    reverseResult = true;
                }

                break;
            case AlbumListSortOptions.DATE_ADDED:
                // Default is descending
                sortType = 'newest';

                if (request.query.sortOrder === 'desc') {
                    offset = totalRecordCount - request.query.offset - request.query.limit;
                    reverseResult = true;
                }

                break;
            case AlbumListSortOptions.DATE_PLAYED:
                // Default is descending
                sortType = 'recent';

                if (request.query.sortOrder === 'asc') {
                    offset = totalRecordCount - request.query.offset - request.query.limit;
                    reverseResult = true;
                }

                break;
            case AlbumListSortOptions.IS_FAVORITE:
                // Default is ascending
                sortType = 'starred';

                if (request.query.sortOrder === 'desc') {
                    offset = totalRecordCount - request.query.offset - request.query.limit;
                    reverseResult = true;
                }

                break;
            case AlbumListSortOptions.NAME:
                // Default is ascending
                sortType = 'alphabeticalByName';

                if (request.query.sortOrder === 'desc') {
                    offset = totalRecordCount - request.query.offset - request.query.limit;
                    reverseResult = true;
                }

                break;
            case AlbumListSortOptions.PLAY_COUNT:
                // Default is descending
                sortType = 'frequent';

                if (request.query.sortOrder === 'asc') {
                    offset = totalRecordCount - request.query.offset - request.query.limit;
                    reverseResult = true;
                }

                break;
            case AlbumListSortOptions.RANDOM:
                sortType = 'random';
                break;
            case AlbumListSortOptions.RATING:
                // Default is ascending
                sortType = 'highest';

                if (request.query.sortOrder === 'desc') {
                    offset = totalRecordCount - request.query.offset - request.query.limit;
                    reverseResult = true;
                }

                break;
            case AlbumListSortOptions.YEAR:
                sortType = 'byYear';

                break;
            default:
                sortType = 'alphabeticalByName';
                break;
        }

        if (sortType === 'byYear') {
            const currentYear = dayjs().year();
            if (request.query.sortOrder === 'asc') {
                fromYear = 0;
                toYear = currentYear;
            }
            else {
                fromYear = currentYear;
                toYear = 0;
            }
        }

        if (request.query.limit === -1) {
            const fetcherFn = async (page: number, limit: number) => {
                const result = await fetchClient<ResponseType<OS['getAlbumList2']['os']['1']['get']>>(url, server, {
                    method: 'GET',
                    query: {
                        fromYear,
                        musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
                        offset: page * limit,
                        size: limit,
                        toYear,
                        type: sortType,
                    },
                });

                if (result.status !== 'ok') {
                    throw new Error(JSON.stringify(result));
                }

                return result.albumList2.album || [];
            };

            const results = await helpers.fetchAllRecords({
                fetcher: fetcherFn,
                fetchLimit: request.query.limit,
            });

            const items = results.map(osUtils.converter.albumToAdapter);
            const sorted = helpers.sortBy.album(items, request.query.sortBy, request.query.sortOrder);
            const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

            return [
                null,
                {
                    items: paginated.items,
                    limit: paginated.limit,
                    offset: paginated.offset,
                    totalRecordCount: results.length,
                },
            ];
        }

        const result = await fetchClient<ResponseType<OS['getAlbumList2']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query: {
                fromYear,
                musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
                offset,
                size: request.query.limit,
                toYear,
                type: sortType,
            },
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        let items = (result.albumList2.album || []).map(
            osUtils.converter.albumToAdapter,
        );

        if (reverseResult) {
            items = items.reverse();
        }

        return [
            null,
            {
                items,
                limit: request.query.limit,
                offset: request.query.offset,
                totalRecordCount,
            },
        ];
    },
    getAlbumListCount: async (request, server) => {
        const sanitizedQuery: Pick<
            AdapterAlbumListQuery,
        'folderId' | 'searchTerm' | 'sortBy'
        > = {
            folderId: request.query.folderId,
            searchTerm: request.query.searchTerm,
            sortBy: request.query.sortBy,
        };

        async function getPageItemCount(page: number, limit: number): Promise<number> {
            const url = `${server.baseUrl}/rest/getAlbumList2.view`;

            const result = await fetchClient<ResponseType<OS['getAlbumList2']['os']['1']['get']>>(url, server, {
                method: 'GET',
                query: {
                    musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
                    offset: page * limit,
                    size: limit,
                    type: osUtils.sortByMap[request.query.sortBy] as AlbumSortType,
                },
            });

            if (result.status !== 'ok') {
                throw new Error(JSON.stringify(result));
            }

            return result.albumList2.album?.length || 0;
        }

        async function getSearchPageItemCount(page: number, limit: number): Promise<number> {
            const url = `${server.baseUrl}/rest/search3.view`;

            const result = await fetchClient<ResponseType<OS['search3']['os']['1']['get']>>(url, server, {
                method: 'GET',
                query: {
                    albumCount: limit,
                    albumOffset: page * limit,
                    artistCount: 0,
                    artistOffset: 0,
                    query: request.query.searchTerm,
                    songCount: 0,
                    songOffset: 0,
                },
            });

            if (result.status !== 'ok') {
                throw new Error(JSON.stringify(result));
            }

            return result.searchResult3.album?.length || 0;
        }

        const pageItemCountFn = request.query.searchTerm ? getSearchPageItemCount : getPageItemCount;

        try {
            const totalRecordCount = await helpers.getListCount({
                expiration: 1440,
                query: sanitizedQuery,
                serverId: server.id,
                type: ServerItemType.ALBUM,
            }, pageItemCountFn);

            return [null, totalRecordCount as number];
        }
        catch (err) {
            return [{ code: 500, message: err as string }, null];
        }
    },
    getAlbumTrackList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getAlbum.view`;

        const query: QueryParams<OS['getAlbum']['os']['1']['get']> = {
            id: request.query.id,
        };

        const result = await fetchClient<ResponseType<OS['getAlbum']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        const results = (result.album.song || []).map(
            osUtils.converter.trackToAdapter,
        );

        const sorted = helpers.sortBy.track(results, request.query.sortBy, request.query.sortOrder);
        const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

        return [
            null,
            {
                items: paginated.items,
                limit: paginated.limit,
                offset: paginated.offset,
                totalRecordCount: results.length,
            },
        ];
    },
};

adapter.albumArtist = {
    getAlbumArtistAlbumList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getArtist.view`;

        const query: QueryParams<OS['getArtist']['os']['1']['get']> = {
            id: request.query.id,
        };

        const result = await fetchClient<ResponseType<OS['getArtist']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        const albums = (result.artist.album || []).map(
            osUtils.converter.albumToAdapter,
        );

        const sorted = helpers.sortBy.album(albums, request.query.sortBy, request.query.sortOrder);
        const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

        return [
            null,
            {
                items: paginated.items,
                limit: paginated.limit,
                offset: paginated.offset,
                totalRecordCount: albums.length,
            },
        ];
    },
    getAlbumArtistDetail: async (request, server) => {
        const url = `${server.baseUrl}/rest/getArtist.view`;

        const query: QueryParams<OS['getArtist']['os']['1']['get']> = {
            id: request.query.id,
        };

        const result = await fetchClient<ResponseType<OS['getArtist']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        return [
            null,
            osUtils.converter.artistToAdapter(result.artist),
        ];
    },
    getAlbumArtistList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getArtists.view`;

        const query: QueryParams<OS['getArtists']['os']['1']['get']> = {
            musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
        };

        const result = await fetchClient<ResponseType<OS['getArtists']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: Number(result.status), message: result as unknown as string }, null];
        }

        const artists = result.artists.index.flatMap((artist) => {
            return (artist.artist || []).map(osUtils.converter.artistToAdapter);
        });

        if (request.query.searchTerm) {
            const searchedItems = helpers.search(artists, request.query.searchTerm, ['name']);
            const sorted = helpers.sortBy.artist(
                searchedItems,
                request.query.sortBy,
                request.query.sortOrder,
            );
            const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

            return [
                null,
                {
                    items: paginated.items,
                    limit: paginated.limit,
                    offset: paginated.offset,
                    totalRecordCount: searchedItems.length,
                },
            ];
        }

        const sorted = helpers.sortBy.artist(artists, request.query.sortBy, request.query.sortOrder);
        const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

        return [
            null,
            {
                items: paginated.items,
                limit: paginated.limit,
                offset: paginated.offset,
                totalRecordCount: artists.length,
            },
        ];
    },
    getAlbumArtistListCount: async (request, server) => {
        const sanitizedQuery: Pick<AdapterArtistListQuery, 'folderId' | 'searchTerm'> = {
            folderId: request.query.folderId,
            searchTerm: request.query.searchTerm,
        };

        const totalRecordCountFromDb = await helpers.getListCount({
            expiration: 1440,
            query: sanitizedQuery,
            serverId: server.id,
            type: ServerItemType.ARTIST,
        });

        if (totalRecordCountFromDb) {
            return [null, totalRecordCountFromDb];
        }

        const url = `${server.baseUrl}/rest/getArtists.view`;

        const query: QueryParams<OS['getArtists']['os']['1']['get']> = {
            musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
        };

        const result = await fetchClient<ResponseType<OS['getArtists']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        const artistCount = result.artists.index.reduce(
            (acc, artist) => {
                if (request.query.searchTerm) {
                    acc += (artist.artist || []).filter(artist =>
                        artist.name.toLowerCase().includes(request.query.searchTerm!.toLowerCase()),
                    ).length;
                }
                else {
                    acc += (artist.artist || []).length;
                }

                return acc;
            },
            0,
        );

        helpers.setListCount(server.id, artistCount, 1440);

        return [null, artistCount];
    },
    getAlbumArtistTrackList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getArtist.view`;

        const query: QueryParams<OS['getArtist']['os']['1']['get']> = {
            id: request.query.id,
        };

        const result = await fetchClient<ResponseType<OS['getArtist']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        const albumIds = (result.artist.album || []).map(
            album => album.id,
        );

        const albumPromises = albumIds.map(albumId =>
            fetchClient<ResponseType<OS['getAlbum']['os']['1']['get']>>(url, server, {
                method: 'GET',
                query: { id: albumId },
            }),
        );

        const albumResponses = await Promise.all(albumPromises);

        if (albumResponses.some(album => album.status !== 'ok')) {
            return [{ code: 500, message: 'Failed to get album details' }, null];
        }

        const tracksResponse = albumResponses.flatMap(
            album => album.album.song || [],
        );

        const tracks = tracksResponse.map(osUtils.converter.trackToAdapter);
        const sorted = helpers.sortBy.track(tracks, request.query.sortBy, request.query.sortOrder);
        const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

        return [
            null,
            {
                items: paginated.items,
                limit: paginated.limit,
                offset: paginated.offset,
                totalRecordCount: tracks.length,
            },
        ];
    },
};

adapter.artist = {
    getArtistDetail: async (request, server) => {
        const url = `${server.baseUrl}/rest/getArtist.view`;

        const query: QueryParams<OS['getArtist']['os']['1']['get']> = {
            id: request.query.id,
        };

        const result = await fetchClient<ResponseType<OS['getArtist']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null,
            ];
        }

        return [
            null,
            osUtils.converter.artistToAdapter(result.artist),
        ];
    },
    getArtistList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getArtists.view`;

        const query: QueryParams<OS['getArtists']['os']['1']['get']> = {
            musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
            // offset: request.query.offset,
            // size: request.query.limit,
        };

        const result = await fetchClient<ResponseType<OS['getArtists']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        const artists = result.artists.index.flatMap((artist) => {
            return (artist.artist || []).map(osUtils.converter.artistToAdapter);
        });

        if (request.query.searchTerm) {
            const searchedItems = helpers.search(artists, request.query.searchTerm, ['name']);
            const sorted = helpers.sortBy.artist(
                searchedItems,
                request.query.sortBy,
                request.query.sortOrder,
            );
            const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

            return [
                null,
                {
                    items: paginated.items,
                    limit: paginated.limit,
                    offset: paginated.offset,
                    totalRecordCount: searchedItems.length,
                },
            ];
        }

        const sorted = helpers.sortBy.artist(artists, request.query.sortBy, request.query.sortOrder);
        const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

        return [
            null,
            {
                items: paginated.items,
                limit: paginated.limit,
                offset: paginated.offset,
                totalRecordCount: artists.length,
            },
        ];
    },
    getArtistListCount: async (request, server) => {
        const sanitizedQuery: Pick<AdapterArtistListQuery, 'folderId' | 'searchTerm'> = {
            folderId: request.query.folderId,
            searchTerm: request.query.searchTerm,
        };

        const totalRecordCountFromDb = await helpers.getListCount({
            expiration: 1440,
            query: sanitizedQuery,
            serverId: server.id,
            type: ServerItemType.ARTIST,
        });

        if (totalRecordCountFromDb) {
            return [null, totalRecordCountFromDb];
        }

        const url = `${server.baseUrl}/rest/getArtists.view`;

        const query: QueryParams<OS['getArtists']['os']['1']['get']> = {
            musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
        };

        const result = await fetchClient<ResponseType<OS['getArtists']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        const artistCount = result.artists.index.reduce(
            (acc, artist) => {
                if (request.query.searchTerm) {
                    acc += (artist.artist || []).filter(artist =>
                        artist.name.toLowerCase().includes(request.query.searchTerm!.toLowerCase()),
                    ).length;
                }
                else {
                    acc += (artist.artist || []).length;
                }

                return acc;
            },
            0,
        );

        helpers.setListCount(server.id, artistCount, 1440);

        return [null, artistCount];
    },
    getArtistTrackList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getArtist.view`;

        const query: QueryParams<OS['getArtist']['os']['1']['get']> = {
            id: request.query.id,
        };

        const result = await fetchClient<ResponseType<OS['getArtist']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        const albumIds = (result.artist.album || []).map(
            album => album.id,
        );

        const albumPromises = albumIds.map(albumId =>
            fetchClient<ResponseType<OS['getAlbum']['os']['1']['get']>>(url, server, {
                method: 'GET',
                query: { id: albumId },
            }),
        );

        const albumResponses = await Promise.all(albumPromises);

        if (albumResponses.some(album => album.status !== 'ok')) {
            return [{ code: 500, message: 'Failed to get album details' }, null];
        }

        const tracksResponse = albumResponses.flatMap(
            album => album.album.song || [],
        );

        const tracks = tracksResponse.map(osUtils.converter.trackToAdapter);
        const sorted = helpers.sortBy.track(tracks, request.query.sortBy, request.query.sortOrder);
        const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

        return [
            null,
            {
                items: paginated.items,
                limit: paginated.limit,
                offset: paginated.offset,
                totalRecordCount: tracks.length,
            },
        ];
    },
};

adapter.auth = {
    signIn: async ({ baseUrl, credential, username }) => {
        const url = `${baseUrl}/rest/getUser.view`;

        /*
         * We will attempt to authenticate in three ways:
         * 1. Username and token (md5(password + salt))
         * 2. Username and plaintext password
         * 3. API key https://opensubsonic.netlify.app/docs/extensions/apikeyauth/
        */

      type RawUserResponse = RawResponseType<OS['getUser']['os']['1']['get']>;

      async function tokenAuth(username: string, credential: string) {
          const salt = generateRandomString(12);
          const token = md5(credential + salt);

          const authQuery = {
              s: salt,
              t: token,
              u: username,
          };

          const query: QueryParams<OS['getUser']['os']['1']['get']> = {
              c: import.meta.env.VITE_APP_NAME,
              f: 'json',
              v: '1.16.1',
              ...authQuery,
          };

          const result = await ofetch<RawUserResponse>(url, {
              method: 'GET',
              query,
          });

          return { authQuery, result };
      }

      async function plaintextAuth(username: string, credential: string) {
          const authQuery = {
              p: credential,
              u: username,
          };

          const query: QueryParams<OS['getUser']['os']['1']['get']> = {
              c: import.meta.env.VITE_APP_NAME,
              f: 'json',
              v: '1.16.1',
              ...authQuery,
          };

          const result = await ofetch<RawUserResponse>(url, {
              method: 'GET',
              query,
          });

          return { authQuery, result };
      }

      async function apiKeyAuth(_username: string, credential: string) {
          const authQuery = {
              apiKey: credential,
          };

          const extraQuery = {
              u: username,
          };

          const query: QueryParams<OS['getUser']['os']['1']['get']> = {
              c: import.meta.env.VITE_APP_NAME,
              f: 'json',
              v: '1.16.1',
              ...authQuery,
          };

          const result = await ofetch<RawUserResponse>(url, {
              method: 'GET',
              query,
          });

          return { authQuery: { ...authQuery, ...extraQuery }, result };
      }

      let errorMessage: string | null = null;

      const authFunctions = [{
          fn: tokenAuth,
          type: 'token',
      }, {
          fn: apiKeyAuth,
          type: 'apiKey',
      }, {
          fn: plaintextAuth,
          type: 'plaintext',
      }];

      for (const authFn of authFunctions) {
          const { authQuery, result } = await authFn.fn(username, credential);

          if (result['subsonic-response'].status !== 'ok') {
              errorMessage = result['subsonic-response'].error?.message as unknown as string;
              continue;
          }

          const serializedCredential = serializeCredential(
              username,
              authQuery,
              authFn.type,
          );

          const musicFolderResult = await ofetch<RawResponseType<OS['getMusicFolders']['os']['1']['get']>>(`${baseUrl}/rest/getMusicFolders.view`, {
              method: 'GET',
              query: {
                  c: import.meta.env.VITE_APP_NAME,
                  f: 'json',
                  v: '1.16.1',
                  ...authQuery,
              },
          });

          if (musicFolderResult['subsonic-response'].status !== 'ok') {
              errorMessage = musicFolderResult['subsonic-response'].error?.message as unknown as string;
              continue;
          }

          const musicFolders = (musicFolderResult['subsonic-response'].musicFolders.musicFolder || [])
              .map(folder => folder.id.toString());

          const user: AdapterUser = {
              credential: serializedCredential,
              permissions: {
                  'jukebox.manage': result['subsonic-response'].user.jukeboxRole,
                  'media.download': result['subsonic-response'].user.downloadRole,
                  'media.folder': musicFolders,
                  'media.share': result['subsonic-response'].user.shareRole,
                  'media.stream': result['subsonic-response'].user.streamRole,
                  'media.upload': result['subsonic-response'].user.uploadRole,
                  'playlist.create': result['subsonic-response'].user.playlistRole,
                  'playlist.delete': result['subsonic-response'].user.playlistRole,
                  'playlist.edit': result['subsonic-response'].user.playlistRole,
                  'server.admin': result['subsonic-response'].user.adminRole,
                  'user.edit': result['subsonic-response'].user.settingsRole,
              },
              username: result['subsonic-response'].user.username,
          };

          return [null, user];
      }

      return [{ code: 500, message: `${localize.t('errors.invalidCredentials')}: ${errorMessage}` }, null];
    },
};

adapter.favorite = {
    getFavoriteAlbumArtistList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getStarred2.view`;

        const query: QueryParams<OS['getStarred2']['os']['1']['get']> = {
            musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
        };

        const result = await fetchClient<ResponseType<OS['getStarred2']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        const items = (result.starred2?.artist || []).map(
            osUtils.converter.artistToAdapter,
        );

        const sorted = helpers.sortBy.artist(items, request.query.sortBy, request.query.sortOrder);
        const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

        return [
            null,
            {
                items: paginated.items,
                limit: paginated.limit,
                offset: paginated.offset,
                totalRecordCount: (result.starred2?.artist || [])
                    .length,
            },
        ];
    },
    getFavoriteAlbumList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getStarred2.view`;

        const query: QueryParams<OS['getStarred2']['os']['1']['get']> = {
            musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
        };

        const result = await fetchClient<ResponseType<OS['getStarred2']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        const items = (result.starred2?.album || []).map(
            osUtils.converter.albumToAdapter,
        );

        const sorted = helpers.sortBy.album(items, request.query.sortBy, request.query.sortOrder);
        const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

        return [
            null,
            {
                items: paginated.items,
                limit: paginated.limit,
                offset: paginated.offset,
                totalRecordCount: (result.starred2?.album || [])
                    .length,
            },
        ];
    },
    getFavoriteTrackList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getStarred2.view`;

        const query: QueryParams<OS['getStarred2']['os']['1']['get']> = {
            musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
        };

        const result = await fetchClient<ResponseType<OS['getStarred2']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        const items: AdapterTrack[] = (
            result.starred2?.song || []
        ).map(osUtils.converter.trackToAdapter);

        const sorted = helpers.sortBy.track(items, request.query.sortBy, request.query.sortOrder);
        const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

        return [
            null,
            {
                items: paginated.items,
                limit: paginated.limit,
                offset: paginated.offset,
                totalRecordCount: (result.starred2.song || []).length,
            },
        ];
    },
};

adapter.genre = {
    getGenreList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getGenres.view`;

        const query: QueryParams<OS['getGenres']['os']['1']['get']> = {
            musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
        };

        const result = await fetchClient<ResponseType<OS['getGenres']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        let items: AdapterGenre[] = (result.genres.genre || []).map(
            genre => ({
                albumCount: genre.albumCount ?? null,
                id: genre.value,
                imageUrl: null,
                name: genre.value,
                trackCount: genre.songCount ?? null,
            }),
        );

        if (request.query.searchTerm) {
            items = items.filter(item =>
                item.name.toLowerCase().includes(request.query.searchTerm!.toLowerCase()),
            );
        }

        const sorted = helpers.sortBy.genre(items, request.query.sortBy, request.query.sortOrder);
        const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

        return [
            null,
            {
                items: paginated.items,
                limit: paginated.limit,
                offset: paginated.offset,
                totalRecordCount: (result.genres.genre || []).length,
            },
        ];
    },
    getGenreListCount: async (request, server) => {
        const url = `${server.baseUrl}/rest/getGenres.view`;

        const query: QueryParams<OS['getGenres']['os']['1']['get']> = {
            musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
        };

        const result = await fetchClient<ResponseType<OS['getGenres']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        let items: AdapterGenre[] = (result.genres.genre || []).map(
            genre => ({
                albumCount: genre.albumCount ?? null,
                id: genre.value,
                imageUrl: null,
                name: genre.value,
                trackCount: genre.songCount ?? null,
            }),
        );

        if (request.query.searchTerm) {
            items = items.filter(item =>
                item.name.toLowerCase().includes(request.query.searchTerm!.toLowerCase()),
            );
        }

        return [null, items.length];
    },
    getGenreTrackList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getSongsByGenre.view`;

        const query: QueryParams<OS['getSongsByGenre']['os']['1']['get']> = {
            genre: request.query.id,
            musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
        };

        const [err, totalRecordCount] = await adapter.genre!.getGenreTrackListCount(request, server);

        if (err) {
            return [err, null];
        }

        const tracks = [];
        if (request.query.limit === -1) {
            const fetcherFn = async (page: number, limit: number) => {
                const result = await fetchClient<ResponseType<OS['getSongsByGenre']['os']['1']['get']>>(url, server, {
                    method: 'GET',
                    query: {
                        count: limit,
                        offset: page * limit,
                        ...query,
                    },
                });

                if (result.status !== 'ok') {
                    throw new Error(JSON.stringify(result));
                }

                return result.songsByGenre.song || [];
            };

            const results = await helpers.fetchAllRecords({ fetcher: fetcherFn });
            tracks.push(...results);
        }
        else {
            const result = await fetchClient<ResponseType<OS['getSongsByGenre']['os']['1']['get']>>(url, server, {
                method: 'GET',
                query: {
                    count: request.query.limit,
                    offset: request.query.offset,
                    ...query,
                },
            });

            if (result.status !== 'ok') {
                return [{ code: 500, message: result as unknown as string }, null];
            }

            tracks.push(...(result.songsByGenre.song || []));
        }

        const items = tracks.map(osUtils.converter.trackToAdapter);
        const sorted = helpers.sortBy.track(items, request.query.sortBy, request.query.sortOrder);
        const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

        return [
            null,
            {
                items: paginated.items,
                limit: paginated.limit,
                offset: paginated.offset,
                totalRecordCount: totalRecordCount ?? 0,
            },
        ];
    },
    getGenreTrackListCount: async (request, server) => {
        const sanitizedQuery: Pick<
            AdapterTrackListQuery,
            'folderId' | 'searchTerm' | 'genreId'
        > = {
            folderId: request.query.folderId,
            genreId: request.query.id,
        };

        const url = `${server.baseUrl}/rest/getSongsByGenre.view`;

        const getPageItemCount = async (page: number, limit: number): Promise<number> => {
            const result = await fetchClient<ResponseType<OS['getSongsByGenre']['os']['1']['get']>>(url, server, {
                method: 'GET',
                query: {
                    count: limit,
                    genre: request.query.id,
                    musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
                    offset: page * limit,
                },
            });

            if (result.status !== 'ok') {
                throw new Error(JSON.stringify(result));
            }

            return (result.songsByGenre.song || []).length;
        };

        try {
            const totalRecordCount = await helpers.getListCount({
                expiration: 1440,
                query: sanitizedQuery,
                serverId: server.id,
                type: ServerItemType.TRACK,
            }, getPageItemCount);

            return [null, totalRecordCount as number];
        }
        catch (err) {
            return [{ code: 500, message: err as string }, null];
        }
    },
};

adapter.meta = {
    scrobble: async (request, server) => {
        const url = `${server.baseUrl}/rest/scrobble.view`;

        const query: QueryParams<OS['scrobble']['os']['1']['get']> = {
            id: request.query.id,
            submission: request.body.submission,
        };

        const result = await fetchClient<ResponseType<OS['scrobble']['os']['1']['post']>>(url, server, {
            method: 'POST',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        return [null, null];
    },
    setFavorite: async (request, server) => {
        const url = `${server.baseUrl}/rest/star.view`;

        const trackIds = { add: [] as string[], remove: [] as string[] };
        const albumIds = { add: [] as string[], remove: [] as string[] };
        const artistIds = { add: [] as string[], remove: [] as string[] };

        for (const entry of request.body.entry) {
            switch (entry.type) {
                case 'album': {
                    entry.favorite
                        ? albumIds.add.push(entry.id)
                        : albumIds.remove.push(entry.id);
                    break;
                }
                case 'artist': {
                    entry.favorite
                        ? artistIds.add.push(entry.id)
                        : artistIds.remove.push(entry.id);
                    break;
                }
                case 'track': {
                    entry.favorite
                        ? trackIds.add.push(entry.id)
                        : trackIds.remove.push(entry.id);
                    break;
                }
            }
        }

        const shouldAdd
            = albumIds.add.length > 0 || artistIds.add.length > 0 || trackIds.add.length > 0;

        const shouldRemove
            = albumIds.remove.length > 0
            || artistIds.remove.length > 0
            || trackIds.remove.length > 0;

        if (shouldAdd) {
            const query: QueryParams<OS['star']['os']['1']['get']> = {
                albumId: albumIds.add,
                artistId: artistIds.add,
                id: trackIds.add,
            };

            const result = await fetchClient<ResponseType<OS['star']['os']['1']['get']>>(url, server, {
                method: 'GET',
                query,
            });

            if (result.status !== 'ok') {
                return [{ code: 500, message: result as unknown as string }, null];
            }
        }

        if (shouldRemove) {
            const query: QueryParams<OS['unstar']['os']['1']['get']> = {
                albumId: albumIds.remove,
                artistId: artistIds.remove,
                id: trackIds.remove,
            };

            const result = await fetchClient<ResponseType<OS['unstar']['os']['1']['get']>>(url, server, {
                method: 'GET',
                query,
            });

            if (result.status !== 'ok') {
                return [{ code: 500, message: result as unknown as string }, null];
            }
        }

        return [null, null];
    },
    setRating: async (request, server) => {
        const url = `${server.baseUrl}/rest/setRating.view`;

        for (const entry of request.body.entry) {
            const result = await fetchClient<ResponseType<OS['setRating']['os']['1']['get']>>(url, server, {
                method: 'GET',
                query: {
                    id: entry.id,
                    rating: entry.rating,
                },
            });

            if (result.status !== 'ok') {
                return [{ code: 500, message: result as unknown as string }, null];
            }
        }

        return [null, null];
    },
};

adapter.musicFolder = {
    getMusicFolderList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getMusicFolders.view`;

        const result = await fetchClient<ResponseType<OS['getMusicFolders']['os']['1']['get']>>(url, server, {
            method: 'GET',
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        const items = (result.musicFolders?.musicFolder || []).map(
            folder => ({
                id: folder.id.toString(),
                name: folder.name || '',
            }),
        );

        return [
            null,
            {
                items,
                limit: request.query.limit,
                offset: request.query.offset,
                totalRecordCount: (
                    result.musicFolders?.musicFolder || []
                ).length,
            },
        ];
    },
};

adapter.playlist = {
    addToPlaylist: async (request, server) => {
        const trackIds: string[] = [];
        const albumIds: string[] = [];

        for (const item of request.body.entry) {
            if (item.type === 'track') {
                trackIds.push(item.id);
            }

            else if (item.type === 'album') {
                albumIds.push(item.id);
            }
        }

        const albumPromises = [];

        for (const albumId of albumIds) {
            const url = `${server.baseUrl}/rest/getAlbum.view`;

            albumPromises.push(
                fetchClient<ResponseType<OS['getAlbum']['os']['1']['get']>>(url, server, {
                    method: 'GET',
                    query: { id: albumId },
                }),
            );
        }

        const albumResponses = await Promise.all(albumPromises);

        for (const albumResponse of albumResponses) {
            if (albumResponse.status === 'ok') {
                const tracks = albumResponse.album.song;

                tracks?.forEach((track) => {
                    trackIds.push(track.id);
                });
            }
            else {
                return [{ code: 500, message: albumResponse as unknown as string }, null];
            }
        }

        const url = `${server.baseUrl}/rest/updatePlaylist.view`;

        const result = await fetchClient<ResponseType<OS['updatePlaylist']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query: {
                playlistId: request.query.id,
                songIdToAdd: trackIds,
            },
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        return [null, null];
    },
    clearPlaylist: async (request, server) => {
        const url = `${server.baseUrl}/rest/createPlaylist.view`;

        const result = await fetchClient<ResponseType<OS['createPlaylist']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query: {
                playlistId: request.query.id,
            },
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        return [null, null];
    },
    createPlaylist: async (request, server) => {
        const url = `${server.baseUrl}/rest/createPlaylist.view`;

        const query: QueryParams<OS['createPlaylist']['os']['1']['get']> = {
            name: request.body.name,
            songId: [],
        };

        const result = await fetchClient<ResponseType<OS['createPlaylist']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        const updateQuery: QueryParams<OS['updatePlaylist']['os']['1']['get']> = {
            comment: request.body.comment,
            name: request.body.name,
            playlistId: result.playlist.id,
            public: request.body.public,
        };

        const updateResult = await fetchClient<ResponseType<OS['updatePlaylist']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query: updateQuery,
        });

        if (updateResult.status !== 'ok') {
            // Delete the playlist if the update fails
            const url = `${server.baseUrl}/rest/deletePlaylist.view`;

            await fetchClient<ResponseType<OS['deletePlaylist']['os']['1']['get']>>(url, server, {
                method: 'GET',
                query: { playlistId: result.playlist.id },
            });

            return [{ code: 500, message: updateResult as unknown as string }, null];
        }

        return [null, null];
    },
    deletePlaylist: async (request, server) => {
        const url = `${server.baseUrl}/rest/deletePlaylist.view`;

        const query: QueryParams<OS['deletePlaylist']['os']['1']['get']> = {
            id: request.query.id,
        };

        const result = await fetchClient<ResponseType<OS['deletePlaylist']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        return [null, null];
    },
    getPlaylistDetail: async (request, server) => {
        const url = `${server.baseUrl}/rest/getPlaylist.view`;

        const query: QueryParams<OS['getPlaylist']['os']['1']['get']> = {
            id: request.query.id,
        };

        const result = await fetchClient<ResponseType<OS['getPlaylist']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        const playlist = osUtils.converter.playlistToAdapter(result.playlist);

        return [null, playlist];
    },
    getPlaylistList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getPlaylists.view`;

        const result = await fetchClient<ResponseType<OS['getPlaylists']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query: {
                username: request.query.userId,
            },
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        let playlists: AdapterPlaylist[] = (
            result.playlists.playlist || []
        ).map(osUtils.converter.playlistToAdapter);

        if (request.query.searchTerm) {
            playlists = playlists.filter((playlist) => {
                return playlist.name.toLowerCase().includes(request.query.searchTerm!.toLowerCase());
            });
        }

        const sorted = helpers.sortBy.playlist(playlists, request.query.sortBy, request.query.sortOrder);
        const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

        const [err, totalRecordCount] = await adapter.playlist!.getPlaylistListCount(request, server);

        if (err) {
            return [err, null];
        }

        return [
            null,
            {
                items: paginated.items,
                limit: paginated.limit,
                offset: paginated.offset,
                totalRecordCount,
            },
        ];
    },
    getPlaylistListCount: async (request, server) => {
        const url = `${server.baseUrl}/rest/getPlaylists.view`;

        const sanitizedQuery: Pick<AdapterPlaylistListQuery, 'userId'> = {
            userId: request.query.userId,
        };

        const totalRecordCountFromDb = await helpers.getListCount({
            query: sanitizedQuery,
            serverId: server.id,
            type: ServerItemType.PLAYLIST,
        });

        if (totalRecordCountFromDb) {
            return [null, totalRecordCountFromDb];
        }

        const result = await fetchClient<ResponseType<OS['getPlaylists']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query: {
                username: request.query.userId,
            },
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        return [null, (result.playlists.playlist || []).length];
    },
    getPlaylistTrackList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getPlaylist.view`;

        const query: QueryParams<OS['getPlaylist']['os']['1']['get']> = {
            id: request.query.id,
        };

        const result = await fetchClient<ResponseType<OS['getPlaylist']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        let tracks: AdapterPlaylistTrack[] = (
            result.playlist.entry || []
        ).map(osUtils.converter.playlistTrackToAdapter);

        if (request.query.searchTerm) {
            tracks = tracks.filter((track) => {
                return track.name.toLowerCase().includes(request.query.searchTerm!.toLowerCase());
            });
        }

        const sorted = helpers.sortBy.track(
            tracks,
            request.query.sortBy,
            request.query.sortOrder || 'asc',
        ) as AdapterPlaylistTrack[];

        const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

        const [err, totalRecordCount] = await adapter.playlist!.getPlaylistTrackListCount(request, server);

        if (err) {
            return [err, null];
        }

        return [
            null,
            {
                items: paginated.items,
                limit: paginated.limit,
                offset: paginated.offset,
                totalRecordCount,
            },
        ];
    },
    getPlaylistTrackListCount: async (request, server) => {
        const url = `${server.baseUrl}/rest/getPlaylist.view`;

        const sanitizedQuery: Pick<AdapterPlaylistTrackListQuery, 'id'> = {
            id: request.query.id,
        };

        const totalRecordCountFromDb = await helpers.getListCount({
            query: sanitizedQuery,
            serverId: server.id,
            type: ServerItemType.PLAYLIST,
        });

        if (totalRecordCountFromDb) {
            return [null, totalRecordCountFromDb];
        }

        const query: QueryParams<OS['getPlaylist']['os']['1']['get']> = {
            id: request.query.id,
        };

        const result = await fetchClient<ResponseType<OS['getPlaylist']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        return [null, (result.playlist.entry || []).length];
    },
    removeFromPlaylist: async (request, server) => {
        const url = `${server.baseUrl}/rest/updatePlaylist.view`;

        const result = await fetchClient<ResponseType<OS['updatePlaylist']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query: {
                playlistId: request.query.id,
                songIdToRemove: request.body.entry,
            },
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        return [null, null];
    },
    updatePlaylist: async (request, server) => {
        const url = `${server.baseUrl}/rest/updatePlaylist.view`;

        const query: QueryParams<OS['updatePlaylist']['os']['1']['get']> = {
            comment: request.body.comment,
            name: request.body.name,
            playlistId: request.query.id,
            public: request.body.public,
        };

        const result = await fetchClient<ResponseType<OS['updatePlaylist']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        return [null, null];
    },
};

adapter.track = {
    getTrackDetail: async (request, server) => {
        const url = `${server.baseUrl}/rest/getSong.view`;

        const query: QueryParams<OS['getSong']['os']['1']['get']> = {
            id: request.query.id,
        };

        const result = await fetchClient<ResponseType<OS['getSong']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query,
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        return [null, osUtils.converter.trackToAdapter(result.song)];
    },
    getTrackList: async (request, server) => {
        const url = `${server.baseUrl}/rest/search3.view`;

        if (request.query.limit === -1) {
            const fetcherFn = async (page: number, limit: number) => {
                const result = await fetchClient<ResponseType<OS['search3']['os']['1']['get']>>(url, server, {
                    method: 'GET',
                    query: {
                        musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
                        query: request.query.searchTerm || '',
                        songCount: limit,
                        songOffset: page * limit,
                    },
                });

                if (result.status !== 'ok') {
                    throw new Error(JSON.stringify(result));
                }

                return result.searchResult3.song || [];
            };

            const results = await helpers.fetchAllRecords({ fetcher: fetcherFn, fetchLimit: request.query.limit });
            const items = results.map(osUtils.converter.trackToAdapter);
            const sorted = helpers.sortBy.track(items, request.query.sortBy, request.query.sortOrder);
            const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

            return [
                null,
                {
                    items: paginated.items,
                    limit: paginated.limit,
                    offset: paginated.offset,
                    totalRecordCount: results.length,
                },
            ];
        }

        const result = await fetchClient<ResponseType<OS['search3']['os']['1']['get']>>(url, server, {
            method: 'GET',
            query: {
                musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
                query: request.query.searchTerm || '',
                songCount: request.query.limit,
                songOffset: request.query.offset,
            },
        });

        if (result.status !== 'ok') {
            return [{ code: 500, message: result as unknown as string }, null];
        }

        const items: AdapterTrack[] = (
            result.searchResult3.song || []
        ).map(osUtils.converter.trackToAdapter);

        const [err, totalRecordCount] = await adapter.track!.getTrackListCount(request, server);

        if (err) {
            return [err, null];
        }

        return [
            null,
            {
                items,
                limit: request.query.limit,
                offset: request.query.offset,
                totalRecordCount,
            },
        ];
    },
    getTrackListCount: async (request, server) => {
        const url = `${server.baseUrl}/rest/search3.view`;

        const sanitizedQuery: Pick<
            AdapterTrackListQuery,
        'folderId' | 'searchTerm' | 'genreId'
        > = {
            folderId: request.query.folderId,
            genreId: request.query.genreId,
            searchTerm: request.query.searchTerm,
        };

        const getPageItemCount = async (page: number, limit: number): Promise<number> => {
            const result = await fetchClient<ResponseType<OS['search3']['os']['1']['get']>>(url, server, {
                method: 'GET',
                query: {
                    musicFolderId: sanitizedQuery.folderId ? Number(sanitizedQuery.folderId[0]) : undefined,
                    query: '',
                    songCount: limit,
                    songOffset: page * limit,
                },
            });

            if (result.status !== 'ok') {
                throw new Error(JSON.stringify(result));
            }

            return (result.searchResult3.song || []).length;
        };

        const genreUrl = `${server.baseUrl}/rest/getSongsByGenre.view`;

        const getPageItemCountWithGenre = async (
            page: number,
            limit: number,
        ): Promise<number> => {
            const result = await fetchClient<ResponseType<OS['getSongsByGenre']['os']['1']['get']>>(genreUrl, server, {
                method: 'GET',
                query: {
                    count: limit,
                    genre: sanitizedQuery.genreId || '',
                    musicFolderId: sanitizedQuery.folderId ? Number(sanitizedQuery.folderId[0]) : undefined,
                    offset: page * limit,
                },
            });

            if (result.status !== 'ok') {
                throw new Error(JSON.stringify(result));
            }

            return (result.songsByGenre.song || []).length;
        };

        try {
            const fetcherFn = sanitizedQuery.genreId ? getPageItemCountWithGenre : getPageItemCount;

            const totalRecordCount = await helpers.getListCount({
                expiration: 1440,
                query: sanitizedQuery,
                serverId: server.id,
                type: ServerItemType.TRACK,
            }, fetcherFn);

            return [null, totalRecordCount as number];
        }
        catch (err) {
            return [{ code: 500, message: err as string }, null];
        }
    },
};
