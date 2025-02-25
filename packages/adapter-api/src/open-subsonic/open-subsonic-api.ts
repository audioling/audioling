import type { OpenSubsonicApiClient as OS } from '@audioling/open-subsonic-api-client';
import type { AdapterApi } from '@repo/shared-types/adapter-types';
import type { AdapterAlbumListQuery } from '../../../shared-types/src/adapter/adapter-album.js';
import type { AdapterArtistListQuery } from '../../../shared-types/src/adapter/adapter-artist.js';
import type { AdapterGenre } from '../../../shared-types/src/adapter/adapter-genre.js';
import type {
    AdapterPlaylist,
    AdapterPlaylistListQuery,
    AdapterPlaylistTrack,
    AdapterPlaylistTrackListQuery,
} from '../../../shared-types/src/adapter/adapter-playlist.js';
import type { AdapterTrack, AdapterTrackListQuery } from '../../../shared-types/src/adapter/adapter-track.js';
import { AlbumListSortOptions, ServerItemType } from '@repo/shared-types/app-types';
import dayjs from 'dayjs';
import { ofetch } from 'ofetch';
import { helpers } from '../helpers.js';
import { osUtils } from './utils.js';

type ResponseType<T extends (...args: any) => any> = Extract<Awaited<ReturnType<T>>, { status: 200 }>;

type QueryParams<T extends (...args: any) => any> = Required<Parameters<T>>[0]['query'];

type AlbumSortType = Parameters<
    OS['getAlbumList2']['os']['1']['get']
>[0]['query']['type'];

export const adapter: Partial<AdapterApi> = {};

adapter._getCoverArtUrl = ({ id, size }, server) => {
    const credentialParams = '';

    return (
        `${server.baseUrl}/rest/getCoverArt.view`
        + `?id=${id}`
        + `&${credentialParams}`
        + `&u=${server.user.username}`
        + `&v=$1.16.1`
        + `&size=${size}`
        + `&c=${process.env.APP_NAME}`
    );
};

adapter._getStreamUrl = ({ id }, server) => {
    const credentialParams = '';

    return (
        `${server.baseUrl}/rest/stream.view`
        + `?id=${id}`
        + `&${credentialParams}`
        + `&u=${server.user.username}`
        + `&v=$1.16.1`
        + `&c=${process.env.APP_NAME}`
    );
};

adapter.album = {
    getAlbumDetail: async (request, server) => {
        const url = `${server.baseUrl}/rest/getAlbum.view`;

        const query: QueryParams<OS['getAlbum']['os']['1']['get']> = {
            id: request.query.id,
        };

        const res = await ofetch<ResponseType<OS['getAlbum']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (res.status !== 200) {
            return [{ code: res.status, message: res.body as unknown as string }, null];
        }

        const album = osUtils.converter.albumToAdapter(res.body['subsonic-response'].album);

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
                const fetcher = async (page: number, limit: number) => {
                    const result = await ofetch<ResponseType<OS['search3']['os']['1']['get']>>(url, {
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

                    if (result.status !== 200) {
                        throw new Error(JSON.stringify(result.body));
                    }

                    return result.body['subsonic-response'].searchResult3.album || [];
                };

                const results = await helpers.fetchAllRecords({
                    fetcher,
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

            const result = await ofetch<ResponseType<OS['search3']['os']['1']['get']>>(url, {
                method: 'GET',
                query,
            });

            if (result.status !== 200) {
                return [{ code: result.status, message: result.body as unknown as string }, null];
            }

            const items = (result.body['subsonic-response'].searchResult3.album || []).map(
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
            const fetcher = async (page: number, limit: number) => {
                const result = await ofetch<ResponseType<OS['getAlbumList2']['os']['1']['get']>>(url, {
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

                if (result.status !== 200) {
                    throw new Error(JSON.stringify(result.body));
                }

                return result.body['subsonic-response'].albumList2.album || [];
            };

            const results = await helpers.fetchAllRecords({
                fetcher,
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

        const result = await ofetch<ResponseType<OS['getAlbumList2']['os']['1']['get']>>(url, {
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

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        let items = (result.body['subsonic-response'].albumList2.album || []).map(
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

            const result = await ofetch(url, {
                method: 'GET',
                query: {
                    musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
                    offset: page * limit,
                    size: limit,
                    type: osUtils.sortByMap[request.query.sortBy] as AlbumSortType,
                },
            });

            if (result.status !== 200) {
                throw new Error(JSON.stringify(result.body));
            }

            return result.body['subsonic-response'].albumList2.album?.length || 0;
        }

        async function getSearchPageItemCount(page: number, limit: number): Promise<number> {
            const url = `${server.baseUrl}/rest/search3.view`;

            const result = await ofetch(url, {
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

            if (result.status !== 200) {
                throw new Error(JSON.stringify(result.body));
            }

            return result.body['subsonic-response'].searchResult3.album?.length || 0;
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

        const result = await ofetch<ResponseType<OS['getAlbum']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        const results = (result.body['subsonic-response'].album.song || []).map(
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

        const result = await ofetch<ResponseType<OS['getArtist']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        const albums = (result.body['subsonic-response'].artist.album || []).map(
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

        const result = await ofetch<ResponseType<OS['getArtist']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        return [
            null,
            osUtils.converter.artistToAdapter(result.body['subsonic-response'].artist),
        ];
    },
    getAlbumArtistList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getArtists.view`;

        const query: QueryParams<OS['getArtists']['os']['1']['get']> = {
            musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
            // offset: request.query.offset,
            // size: request.query.limit,
        };

        const result = await ofetch<ResponseType<OS['getArtists']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        const artists = result.body['subsonic-response'].artists.index.flatMap((artist) => {
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

        const result = await ofetch<ResponseType<OS['getArtists']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        const artistCount = result.body['subsonic-response'].artists.index.reduce(
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

        const result = await ofetch<ResponseType<OS['getArtist']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        const albumIds = (result.body['subsonic-response'].artist.album || []).map(
            album => album.id,
        );

        const albumPromises = albumIds.map(albumId =>
            ofetch<ResponseType<OS['getAlbum']['os']['1']['get']>>(url, {
                method: 'GET',
                query: { id: albumId },
            }),
        );

        const albumResponses = await Promise.all(albumPromises);

        if (albumResponses.some(album => album.status !== 200)) {
            return [{ code: 500, message: 'Failed to get album details' }, null];
        }

        type AlbumResponse = Extract<
            Awaited<ReturnType<typeof ofetch<ResponseType<OS['getAlbum']['os']['1']['get']>>>>,
            { status: 200 }
        >['body'];

        const tracksResponse = albumResponses.flatMap(
            album => (album.body as AlbumResponse)['subsonic-response'].album.song || [],
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

        const result = await ofetch<ResponseType<OS['getArtist']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null,
            ];
        }

        return [
            null,
            osUtils.converter.artistToAdapter(result.body['subsonic-response'].artist),
        ];
    },
    getArtistList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getArtists.view`;

        const query: QueryParams<OS['getArtists']['os']['1']['get']> = {
            musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
            // offset: request.query.offset,
            // size: request.query.limit,
        };

        const result = await ofetch<ResponseType<OS['getArtists']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        const artists = result.body['subsonic-response'].artists.index.flatMap((artist) => {
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

        const result = await ofetch<ResponseType<OS['getArtists']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        const artistCount = result.body['subsonic-response'].artists.index.reduce(
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

        const result = await ofetch<ResponseType<OS['getArtist']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        const albumIds = (result.body['subsonic-response'].artist.album || []).map(
            album => album.id,
        );

        const albumPromises = albumIds.map(albumId =>
            ofetch<ResponseType<OS['getAlbum']['os']['1']['get']>>(url, {
                method: 'GET',
                query: { id: albumId },
            }),
        );

        const albumResponses = await Promise.all(albumPromises);

        if (albumResponses.some(album => album.status !== 200)) {
            return [{ code: 500, message: 'Failed to get album details' }, null];
        }

        type AlbumResponse = Extract<
            Awaited<ReturnType<typeof ofetch<ResponseType<OS['getAlbum']['os']['1']['get']>>>>,
            { status: 200 }
        >['body'];

        const tracksResponse = albumResponses.flatMap(
            album => (album.body as AlbumResponse)['subsonic-response'].album.song || [],
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

adapter.favorite = {
    getFavoriteAlbumArtistList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getStarred2.view`;

        const query: QueryParams<OS['getStarred2']['os']['1']['get']> = {
            musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
        };

        const result = await ofetch<ResponseType<OS['getStarred2']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        const items = (result.body['subsonic-response'].starred2?.artist || []).map(
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
                totalRecordCount: (result.body['subsonic-response'].starred2?.artist || [])
                    .length,
            },
        ];
    },
    getFavoriteAlbumList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getStarred2.view`;

        const query: QueryParams<OS['getStarred2']['os']['1']['get']> = {
            musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
        };

        const result = await ofetch<ResponseType<OS['getStarred2']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        const items = (result.body['subsonic-response'].starred2?.album || []).map(
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
                totalRecordCount: (result.body['subsonic-response'].starred2?.album || [])
                    .length,
            },
        ];
    },
    getFavoriteTrackList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getStarred2.view`;

        const query: QueryParams<OS['getStarred2']['os']['1']['get']> = {
            musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
        };

        const result = await ofetch<ResponseType<OS['getStarred2']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        const items: AdapterTrack[] = (
            result.body['subsonic-response'].starred2?.song || []
        ).map(osUtils.converter.trackToAdapter);

        const sorted = helpers.sortBy.track(items, request.query.sortBy, request.query.sortOrder);
        const paginated = helpers.paginate(sorted, request.query.offset, request.query.limit);

        return [
            null,
            {
                items: paginated.items,
                limit: paginated.limit,
                offset: paginated.offset,
                totalRecordCount: (result.body['subsonic-response'].starred2.song || []).length,
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

        const result = await ofetch<ResponseType<OS['getGenres']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        let items: AdapterGenre[] = (result.body['subsonic-response'].genres.genre || []).map(
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
                totalRecordCount: (result.body['subsonic-response'].genres.genre || []).length,
            },
        ];
    },
    getGenreListCount: async (request, server) => {
        const url = `${server.baseUrl}/rest/getGenres.view`;

        const query: QueryParams<OS['getGenres']['os']['1']['get']> = {
            musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
        };

        const result = await ofetch<ResponseType<OS['getGenres']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        let items: AdapterGenre[] = (result.body['subsonic-response'].genres.genre || []).map(
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
            const fetcher = async (page: number, limit: number) => {
                const result = await ofetch<ResponseType<OS['getSongsByGenre']['os']['1']['get']>>(url, {
                    method: 'GET',
                    query: {
                        count: limit,
                        offset: page * limit,
                        ...query,
                    },
                });

                if (result.status !== 200) {
                    throw new Error(JSON.stringify(result.body));
                }

                return result.body['subsonic-response'].songsByGenre.song || [];
            };

            const results = await helpers.fetchAllRecords({ fetcher });
            tracks.push(...results);
        }
        else {
            const result = await ofetch<ResponseType<OS['getSongsByGenre']['os']['1']['get']>>(url, {
                method: 'GET',
                query: {
                    count: request.query.limit,
                    offset: request.query.offset,
                    ...query,
                },
            });

            if (result.status !== 200) {
                return [{ code: result.status, message: result.body as unknown as string }, null];
            }

            tracks.push(...(result.body['subsonic-response'].songsByGenre.song || []));
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
            const result = await ofetch<ResponseType<OS['getSongsByGenre']['os']['1']['get']>>(url, {
                method: 'GET',
                query: {
                    count: limit,
                    genre: request.query.id,
                    musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
                    offset: page * limit,
                },
            });

            if (result.status !== 200) {
                throw new Error(JSON.stringify(result.body));
            }

            return (result.body['subsonic-response'].songsByGenre.song || []).length;
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

        const result = await ofetch<ResponseType<OS['scrobble']['os']['1']['post']>>(url, {
            method: 'POST',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
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

            const result = await ofetch<ResponseType<OS['star']['os']['1']['get']>>(url, {
                method: 'GET',
                query,
            });

            if (result.status !== 200) {
                return [{ code: result.status, message: result.body as unknown as string }, null];
            }
        }

        if (shouldRemove) {
            const query: QueryParams<OS['unstar']['os']['1']['get']> = {
                albumId: albumIds.remove,
                artistId: artistIds.remove,
                id: trackIds.remove,
            };

            const result = await ofetch<ResponseType<OS['unstar']['os']['1']['get']>>(url, {
                method: 'GET',
                query,
            });

            if (result.status !== 200) {
                return [{ code: result.status, message: result.body as unknown as string }, null];
            }
        }

        return [null, null];
    },
    setRating: async (request, server) => {
        const url = `${server.baseUrl}/rest/setRating.view`;

        for (const entry of request.body.entry) {
            const result = await ofetch<ResponseType<OS['setRating']['os']['1']['get']>>(url, {
                method: 'GET',
                query: {
                    id: entry.id,
                    rating: entry.rating,
                },
            });

            if (result.status !== 200) {
                return [{ code: result.status, message: result.body as unknown as string }, null];
            }
        }

        return [null, null];
    },
};

adapter.musicFolder = {
    getMusicFolderList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getMusicFolders.view`;

        const result = await ofetch<ResponseType<OS['getMusicFolders']['os']['1']['get']>>(url, {
            method: 'GET',
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        const items = (result.body['subsonic-response'].musicFolders?.musicFolder || []).map(
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
                    result.body['subsonic-response'].musicFolders?.musicFolder || []
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
                ofetch<ResponseType<OS['getAlbum']['os']['1']['get']>>(url, {
                    method: 'GET',
                    query: { id: albumId },
                }),
            );
        }

        const albumResponses = await Promise.all(albumPromises);

        for (const albumResponse of albumResponses) {
            if (albumResponse.status === 200) {
                const tracks = albumResponse.body['subsonic-response'].album.song;

                tracks?.forEach((track) => {
                    trackIds.push(track.id);
                });
            }
            else {
                return [{ code: albumResponse.status, message: albumResponse.body as unknown as string }, null];
            }
        }

        const url = `${server.baseUrl}/rest/updatePlaylist.view`;

        const result = await ofetch<ResponseType<OS['updatePlaylist']['os']['1']['get']>>(url, {
            method: 'GET',
            query: {
                playlistId: request.query.id,
                songIdToAdd: trackIds,
            },
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        return [null, null];
    },
    clearPlaylist: async (request, server) => {
        const url = `${server.baseUrl}/rest/createPlaylist.view`;

        const result = await ofetch<ResponseType<OS['createPlaylist']['os']['1']['get']>>(url, {
            method: 'GET',
            query: {
                playlistId: request.query.id,
            },
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        return [null, null];
    },
    createPlaylist: async (request, server) => {
        const url = `${server.baseUrl}/rest/createPlaylist.view`;

        const query: QueryParams<OS['createPlaylist']['os']['1']['get']> = {
            name: request.body.name,
            songId: [],
        };

        const result = await ofetch<ResponseType<OS['createPlaylist']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        const updateQuery: QueryParams<OS['updatePlaylist']['os']['1']['get']> = {
            comment: request.body.comment,
            name: request.body.name,
            playlistId: result.body['subsonic-response'].playlist.id,
            public: request.body.public,
        };

        const updateResult = await ofetch<ResponseType<OS['updatePlaylist']['os']['1']['get']>>(url, {
            method: 'GET',
            query: updateQuery,
        });

        if (updateResult.status !== 200) {
            // Delete the playlist if the update fails
            const url = `${server.baseUrl}/rest/deletePlaylist.view`;

            await ofetch<ResponseType<OS['deletePlaylist']['os']['1']['get']>>(url, {
                method: 'GET',
                query: { playlistId: result.body['subsonic-response'].playlist.id },
            });

            return [{ code: updateResult.status, message: updateResult.body as unknown as string }, null];
        }

        return [null, null];
    },
    deletePlaylist: async (request, server) => {
        const url = `${server.baseUrl}/rest/deletePlaylist.view`;

        const query: QueryParams<OS['deletePlaylist']['os']['1']['get']> = {
            id: request.query.id,
        };

        const result = await ofetch<ResponseType<OS['deletePlaylist']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        return [null, null];
    },
    getPlaylistDetail: async (request, server) => {
        const url = `${server.baseUrl}/rest/getPlaylist.view`;

        const query: QueryParams<OS['getPlaylist']['os']['1']['get']> = {
            id: request.query.id,
        };

        const result = await ofetch<ResponseType<OS['getPlaylist']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        const playlist = osUtils.converter.playlistToAdapter(result.body['subsonic-response'].playlist);

        return [null, playlist];
    },
    getPlaylistList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getPlaylists.view`;

        const result = await ofetch<ResponseType<OS['getPlaylists']['os']['1']['get']>>(url, {
            method: 'GET',
            query: {
                username: request.query.userId,
            },
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        let playlists: AdapterPlaylist[] = (
            result.body['subsonic-response'].playlists.playlist || []
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

        const result = await ofetch<ResponseType<OS['getPlaylists']['os']['1']['get']>>(url, {
            method: 'GET',
            query: {
                username: request.query.userId,
            },
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        return [null, (result.body['subsonic-response'].playlists.playlist || []).length];
    },
    getPlaylistTrackList: async (request, server) => {
        const url = `${server.baseUrl}/rest/getPlaylist.view`;

        const query: QueryParams<OS['getPlaylist']['os']['1']['get']> = {
            id: request.query.id,
        };

        const result = await ofetch<ResponseType<OS['getPlaylist']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        let tracks: AdapterPlaylistTrack[] = (
            result.body['subsonic-response'].playlist.entry || []
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

        const result = await ofetch<ResponseType<OS['getPlaylist']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        return [null, (result.body['subsonic-response'].playlist.entry || []).length];
    },
    removeFromPlaylist: async (request, server) => {
        const url = `${server.baseUrl}/rest/updatePlaylist.view`;

        const result = await ofetch<ResponseType<OS['updatePlaylist']['os']['1']['get']>>(url, {
            method: 'GET',
            query: {
                playlistId: request.query.id,
                songIdToRemove: request.body.entry,
            },
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
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

        const result = await ofetch<ResponseType<OS['updatePlaylist']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
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

        const result = await ofetch<ResponseType<OS['getSong']['os']['1']['get']>>(url, {
            method: 'GET',
            query,
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        return [null, osUtils.converter.trackToAdapter(result.body['subsonic-response'].song)];
    },
    getTrackList: async (request, server) => {
        const url = `${server.baseUrl}/rest/search3.view`;

        if (request.query.limit === -1) {
            const fetcher = async (page: number, limit: number) => {
                const result = await ofetch<ResponseType<OS['search3']['os']['1']['get']>>(url, {
                    method: 'GET',
                    query: {
                        musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
                        query: request.query.searchTerm || '',
                        songCount: limit,
                        songOffset: page * limit,
                    },
                });

                if (result.status !== 200) {
                    throw new Error(JSON.stringify(result.body));
                }

                return result.body['subsonic-response'].searchResult3.song || [];
            };

            const results = await helpers.fetchAllRecords({ fetcher, fetchLimit: request.query.limit });
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

        const result = await ofetch<ResponseType<OS['search3']['os']['1']['get']>>(url, {
            method: 'GET',
            query: {
                musicFolderId: request.query.folderId ? Number(request.query.folderId[0]) : undefined,
                query: request.query.searchTerm || '',
                songCount: request.query.limit,
                songOffset: request.query.offset,
            },
        });

        if (result.status !== 200) {
            return [{ code: result.status, message: result.body as unknown as string }, null];
        }

        const items: AdapterTrack[] = (
            result.body['subsonic-response'].searchResult3.song || []
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
            const result = await ofetch<ResponseType<OS['search3']['os']['1']['get']>>(url, {
                method: 'GET',
                query: {
                    musicFolderId: sanitizedQuery.folderId ? Number(sanitizedQuery.folderId[0]) : undefined,
                    query: '',
                    songCount: limit,
                    songOffset: page * limit,
                },
            });

            if (result.status !== 200) {
                throw new Error(JSON.stringify(result.body));
            }

            return (result.body['subsonic-response'].searchResult3.song || []).length;
        };

        const genreUrl = `${server.baseUrl}/rest/getSongsByGenre.view`;

        const getPageItemCountWithGenre = async (
            page: number,
            limit: number,
        ): Promise<number> => {
            const result = await ofetch<ResponseType<OS['getSongsByGenre']['os']['1']['get']>>(genreUrl, {
                method: 'GET',
                query: {
                    count: limit,
                    genre: sanitizedQuery.genreId || '',
                    musicFolderId: sanitizedQuery.folderId ? Number(sanitizedQuery.folderId[0]) : undefined,
                    offset: page * limit,
                },
            });

            if (result.status !== 200) {
                throw new Error(JSON.stringify(result.body));
            }

            return (result.body['subsonic-response'].songsByGenre.song || []).length;
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
