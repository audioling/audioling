import type { OpenSubsonicApiClient } from '@audioling/open-subsonic-api-client';
import { initOpenSubsonicApiClient } from '@audioling/open-subsonic-api-client';
import { LibraryType } from '@repo/shared-types';
import axios from 'axios';
import dayjs from 'dayjs';
import sortBy from 'lodash/sortBy.js';
import md5 from 'md5';
import { subsonicHelpers } from '@/adapters/subsonic/subsonic-adapter-helpers.js';
import type { AdapterAlbumListResponse } from '@/adapters/types/adapter-album-types.js';
import { AdapterAlbumListSort } from '@/adapters/types/adapter-album-types.js';
import type { AdapterAlbumArtist } from '@/adapters/types/adapter-artist-types.js';
import type { AdapterPlaylist } from '@/adapters/types/adapter-playlist-types.js';
import type { AuthenticationResponse } from '@/adapters/types/adapter-server-types.js';
import type { AdapterTrack } from '@/adapters/types/adapter-track-types.js';
import type { AdapterApi, AdapterAuthentication, RemoteAdapter } from '@/adapters/types/index.js';
import { CONSTANTS } from '@/constants.js';
import type { DbLibrary } from '@/database/library-database.js';
import { writeLog } from '@/middlewares/logger-middleware.js';
import { utils } from '@/utils/index.js';
import { generateRandomString } from '@/utils/random-string.js';

// const formatImageUrl = (
//   args: {
//     coverArtId: string | null;
//     credential: string;
//     url: string;
//   },
//   library: DBLibrary,
// ) => {
//   const { credential, coverArtId, url } = args;

//   if (!coverArtId) {
//     return null;
//   }

//   return `${url}/rest/getCoverArt.view?id=${coverArtId}&${credential}&v=1.13.0&c=${CONSTANTS.APP_NAME}`;
// };

const adapterErrorMessage = (library: DbLibrary, route: string) => {
    return `Remote adapter ${library.baseUrl}@${library.id}@${library.type} failed on ${route}`;
};

export const initSubsonicAdapter: RemoteAdapter = (library: DbLibrary) => {
    const username = library.scanUsername;
    const password = library.scanCredential;

    if (!username || !password) {
        const errMessage = `Credentials are missing: ${library.displayName || library.baseUrl}@${library.id}`;
        writeLog.error(errMessage);
        throw new Error(errMessage);
    }

    const splitCredentials = utils.delimiter.reverseCredential(password);
    const saltOrPassword = splitCredentials[0] as string;
    const token = splitCredentials[1] as string | undefined;

    const baseApiClientOptions = {
        baseUrl: library.baseUrl,
        clientName: `${CONSTANTS.APP_NAME}@(${library.id})@${username}`,
        username: username,
    };

    let apiClient: OpenSubsonicApiClient;

    if (token) {
        apiClient = initOpenSubsonicApiClient({
            ...baseApiClientOptions,
            salt: saltOrPassword,
            token,
        });
    } else {
        apiClient = initOpenSubsonicApiClient({
            ...baseApiClientOptions,
            password: saltOrPassword,
        });
    }

    const adapter: AdapterApi = {
        _getType: () => LibraryType.SUBSONIC,
        addToPlaylist: async (request, fetchOptions) => {
            const { query, body } = request;

            const songIds: string[] = [];
            const albumIds: string[] = [];

            for (const item of body.entry) {
                if (item.type === 'song') {
                    songIds.push(item.id);
                } else if (item.type === 'album') {
                    albumIds.push(item.id);
                }
            }

            const albumPromises = [];

            for (const albumId of albumIds) {
                albumPromises.push(
                    apiClient.getAlbum.get({ fetchOptions, query: { id: albumId } }),
                );
            }

            const albumResponses = await Promise.all(albumPromises);

            for (const albumResponse of albumResponses) {
                if (albumResponse.status === 200) {
                    const songs = albumResponse.body.album.song;

                    songs?.forEach((song) => {
                        songIds.push(song.id);
                    });
                } else {
                    return [
                        {
                            code: albumResponse.status,
                            message: albumResponse.body as string,
                        },
                        null,
                    ];
                }
            }

            await apiClient.updatePlaylist.get({
                fetchOptions,
                query: {
                    playlistId: query.id,
                    songIdToAdd: songIds,
                },
            });

            return [null, null];
        },
        clearPlaylist: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.updatePlaylist.get({
                fetchOptions,
                query: {
                    playlistId: query.id,
                    songIdToRemove: [],
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'clearPlaylist'));
                return [
                    {
                        code: result.status,
                        message: result.body as string,
                    },
                    null,
                ];
            }

            return [null, null];
        },
        getAlbumArtistList: async (request, fetchOptions) => {
            const { query } = request;

            const clientParams = {
                fetchOptions,
                query: {
                    musicFolderId: query.musicFolderId,
                    offset: query.startIndex,
                    size: query.limit,
                },
            };

            const result = await apiClient.getArtists.get({
                ...clientParams,
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'getAlbumArtistList'));

                return [
                    {
                        code: result.status,
                        message: result.body as string,
                    },
                    null,
                ];
            }

            const flattenedArtists = result.body.artists.index.flatMap((artist) => {
                return artist.artist.map((artist) => ({
                    ...artist,
                    id: artist.id,
                    name: artist.name,
                    starred: artist.starred,
                    userRating: artist.userRating,
                }));
            });

            const artists = flattenedArtists.slice(
                query.startIndex,
                query.startIndex + query.limit,
            );

            const items = artists.map(subsonicHelpers.converter.artistToAdapter);

            return [
                null,
                {
                    items,
                    startIndex: query.startIndex,
                    totalRecordCount: flattenedArtists.length,
                },
            ];
        },
        getAlbumArtistListCount: async (request, fetchOptions) => {
            const { query } = request;

            const clientParams = {
                fetchOptions,
                query: {
                    musicFolderId: query.musicFolderId,
                },
            };

            const result = await apiClient.getArtists.get(clientParams);

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'getAlbumArtistListCount'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const artistCount = result.body.artists.index.reduce((acc, artist) => {
                acc += artist.artist.length;
                return acc;
            }, 0);

            return [null, artistCount];
        },
        getAlbumList: async (request, fetchOptions) => {
            const { query } = request;

            let sortType: Parameters<typeof apiClient.getAlbumList2.get>[0]['query']['type'] =
                'alphabeticalByName';

            switch (query.sortBy) {
                case AdapterAlbumListSort.DATE_ADDED:
                    sortType = 'newest';
                    break;
                case AdapterAlbumListSort.DATE_PLAYED:
                    sortType = 'recent';
                    break;
                case AdapterAlbumListSort.NAME:
                    sortType = 'alphabeticalByName';
                    break;
                case AdapterAlbumListSort.PLAY_COUNT:
                    sortType = 'frequent';
                    break;
                case AdapterAlbumListSort.YEAR:
                    sortType = 'byYear';
                    break;
                default:
                    sortType = 'alphabeticalByName';
                    break;
            }

            const result = await apiClient.getAlbumList2.get({
                fetchOptions,
                query: {
                    musicFolderId: query.musicFolderId,
                    offset: query.startIndex,
                    size: query.limit,
                    type: sortType,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'getAlbumList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const items = result.body.albumList2.album.map(
                subsonicHelpers.converter.albumToAdapter,
            );

            return [
                null,
                {
                    items,
                    startIndex: query.startIndex,
                    totalRecordCount: null,
                },
            ];
        },
        getAlbumListCount: async (request, fetchOptions) => {
            const { query } = request;
            const limit = 500;

            const getPageItemCount = async (page: number): Promise<number> => {
                const result = await apiClient.getAlbumList2.get({
                    fetchOptions,
                    query: {
                        musicFolderId: query.musicFolderId,
                        offset: page * limit,
                        size: limit,
                        type: 'alphabeticalByName',
                    },
                });

                if (result.status !== 200) {
                    throw new Error(JSON.stringify(result.body));
                }

                return result.body.albumList2.album.length;
            };

            const fetchRecursive = async (
                page: number,
                itemsPerPage: number,
                currentPage: number,
                totalItems: number,
            ): Promise<number> => {
                const itemCount = await getPageItemCount(page);
                totalItems += itemCount;

                if (itemCount < itemsPerPage) {
                    return totalItems;
                } else {
                    return fetchRecursive(page + 1, itemsPerPage, currentPage + 1, totalItems);
                }
            };

            const fetchPaginatedItemCount = async () => {
                return fetchRecursive(0, limit, 0, 0);
            };

            const totalItems = await fetchPaginatedItemCount();
            return [null, totalItems];
        },
        getArtistList: async (request, fetchOptions) => {
            const { query } = request;
            const result = await apiClient.getArtists.get({
                fetchOptions,
                query: {
                    musicFolderId: query.musicFolderId,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'getArtistList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const flattenedArtists = result.body.artists.index.flatMap((artist) => {
                return artist.artist.map((artist) => ({
                    id: artist.id,
                    name: artist.name,
                    starred: artist.starred,
                    userRating: artist.userRating,
                }));
            });

            const artists = flattenedArtists.slice(
                query.startIndex,
                query.startIndex + query.limit,
            );

            const items: AdapterAlbumArtist[] = artists.map((artist) =>
                subsonicHelpers.converter.artistToAdapter({
                    ...artist,
                    album: [],
                }),
            );

            return [
                null,
                {
                    items,
                    startIndex: query.startIndex,
                    totalRecordCount: flattenedArtists.length,
                },
            ];
        },
        getArtistListCount: async (request, fetchOptions) => {
            const { query } = request;

            const clientParams = {
                fetchOptions,
                query: {
                    musicFolderId: query.musicFolderId,
                },
            };

            const result = await apiClient.getArtists.get({
                ...clientParams,
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'getArtistListCount'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const artistCount = result.body.artists.index.reduce((acc, artist) => {
                acc += artist.artist.length;
                return acc;
            }, 0);

            return [null, artistCount];
        },
        getFavoriteAlbumList: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getStarred2.get({
                fetchOptions,
                query,
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'getFavoriteAlbumList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const items = (result.body.starred2?.album || []).map((album) => {
                const releaseDate = dayjs()
                    .year(Number(album.year || 0))
                    .startOf('year')
                    .toISOString();

                const item: AdapterAlbumListResponse['items'][number] = {
                    albumArtists: [
                        ...(album.artistId
                            ? [
                                  {
                                      id: album.artistId,
                                      imageUrl: null,
                                      name: album.artist,
                                  },
                              ]
                            : []),
                    ],
                    comment: null,
                    createdAt: album.created,
                    duration: album.duration,
                    external: {
                        musicbrainz: {
                            id: null,
                            name: null,
                        },
                    },
                    genres: [...(album.genre ? [{ id: album.genre, name: album.genre }] : [])],
                    id: album.id,
                    imageUrl: album.coverArt,
                    isCompilation: null,
                    isFavorite: Boolean(album.starred),
                    lastPlayedAt: null,
                    name: album.name,
                    playCount: album.playCount || 0,
                    releaseDate,
                    releaseYear: album.year || 0,
                    size: null,
                    songCount: album.songCount,
                    updatedAt: album.created,
                    userRating: album.userRating ?? null,
                };

                return item;
            });

            return [
                null,
                {
                    items,
                    startIndex: 0,
                    totalRecordCount: result.body.starred2?.album.length || 0,
                },
            ];
        },
        getFavoriteArtistList: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getStarred2.get({
                fetchOptions,
                query,
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'getFavoriteArtistList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const items: AdapterAlbumArtist[] = (result.body.starred2?.artist || []).map(
                (artist) => ({
                    ...artist,
                    albumCount: null,
                    biography: null,
                    createdAt: null,
                    duration: 0,
                    external: {
                        musicbrainz: {
                            id: null,
                            name: null,
                        },
                    },
                    genres: [],
                    songCount: null,
                    updatedAt: null,
                    userFavorite: true,
                    userRating: artist.userRating ?? null,
                }),
            );

            return [
                null,
                {
                    items,
                    startIndex: 0,
                    totalRecordCount: result.body.starred2?.artist.length || 0,
                },
            ];
        },
        getFavoriteTrackList: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getStarred2.get({
                fetchOptions,
                query,
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'getFavoriteTrackList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const items: AdapterTrack[] = (result.body.starred2?.song || []).map(
                subsonicHelpers.converter.trackToAdapter,
            );

            return [
                null,
                {
                    items,
                    startIndex: 0,
                    totalRecordCount: result.body.starred2?.song.length || 0,
                },
            ];
        },
        getGenreList: async (request, fetchOptions) => {
            const { query } = request;

            const clientParams = {
                fetchOptions,
                query,
            };
            const result = await apiClient.getGenres.get({
                ...clientParams,
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'getGenreList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            return [
                null,
                {
                    items: result.body.genres.genre.map((genre) => ({
                        id: genre.value,
                        imageUrl: null,
                        name: genre.value,
                    })),
                    startIndex: 0,
                    totalRecordCount: result.body.genres.genre.length,
                },
            ];
        },
        getMusicFolderList: async (_request, fetchOptions) => {
            const result = await apiClient.getMusicFolders.get({
                ...fetchOptions,
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'getMusicFolderList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            return [
                null,
                {
                    items: result.body.musicFolders.musicFolder.map((folder) => ({
                        id: folder.id,
                        name: folder.name,
                    })),
                    startIndex: 0,
                    totalRecordCount: result.body.musicFolders.musicFolder.length,
                },
            ];
        },
        getPlaylistList: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getPlaylists.get({
                fetchOptions,
                query: {
                    username: query.userId,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'getPlaylistList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const playlistResult = result.body.playlists.playlist;

            let playlists: AdapterPlaylist[] = playlistResult
                .slice(query.startIndex, query.limit)
                .map((playlist) => ({
                    description: playlist.note || null,
                    duration: playlist.duration,
                    genres: [],
                    id: playlist.id,
                    imageUrl: null,
                    name: playlist.name,
                    owner: playlist.owner,
                    ownerId: playlist.owner,
                    public: playlist.public,
                    size: null,
                    songCount: playlist.songCount,
                }));

            if (query.searchTerm) {
                playlists = playlists.filter((playlist) => {
                    return playlist.name.toLowerCase().includes(query.searchTerm!.toLowerCase());
                });
            }

            if (query.sortBy) {
                playlists = sortBy(playlists, [query.sortBy], [query.sortOrder || 'asc']);
            }

            return [
                null,
                {
                    items: playlists,
                    startIndex: query.startIndex,
                    totalRecordCount: playlistResult.length,
                },
            ];
        },
        getPlaylistListCount: async (request, fetchOptions) => {
            const { query } = request;
            const result = await apiClient.getPlaylists.get({
                fetchOptions,
                query: {
                    username: query.userId,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'getPlaylistListCount'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            return [null, result.body.playlists.playlist.length];
        },
        getPlaylistTrackList: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.getPlaylist.get({
                fetchOptions,
                query: {
                    id: query.id,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'getPlaylistSongList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const songs: AdapterTrack[] = result.body.playlist.entry
                .slice(query.startIndex, query.limit)
                .map((song) => {
                    const splitPath = song.path?.split('/');
                    const fileName = splitPath[splitPath.length - 1];

                    return {
                        album: song.album,
                        albumId: song.albumId,
                        artistId: song.artist || null,
                        artistName: song.artist || '',
                        artists: [
                            ...(song.artistId
                                ? [{ id: song.artistId, imageUrl: null, name: song.artist || '' }]
                                : []),
                        ],
                        bitrate: song.bitRate ?? null,
                        bpm: null,
                        channels: song.channelCount ?? null,
                        comment: null,
                        container: song.suffix,
                        createdAt: song.created,
                        discNumber: song.discNumber ? String(song.discNumber) : '1',
                        discSubtitle: null,
                        duration: song.duration,
                        external: {
                            musicbrainz: {
                                id: null,
                                name: null,
                            },
                        },
                        fileName,
                        filePath: song.path,
                        fileSize: song.size,
                        genres: [...(song.genre ? [{ id: song.genre, name: song.genre }] : [])],
                        id: song.id,
                        imageUrl: song.coverArt,
                        isCompilation: false,
                        isFavorite: Boolean(song.starred),
                        lastPlayedAt: song.played || null,
                        lyrics: null,
                        mbzId: null,
                        name: song.title,
                        peak: null,
                        playCount: song.playCount || 0,
                        releaseDate: utils.date.format(String(song.year || 0), 'YYYY-MM-DD'),
                        releaseYear: song.year || 0,
                        replayGain: {
                            albumGain: null,
                            albumPeak: null,
                            trackGain: null,
                            trackPeak: null,
                        },
                        samplerate: song.samplingRate ?? null,
                        songCount: null,
                        trackNumber: song.track || 1,
                        updatedAt: song.created,
                        userFavorite: Boolean(song.starred),
                        userRating: song.userRating ?? null,
                    };
                });

            return [
                null,
                {
                    items: songs,
                    startIndex: query.startIndex,
                    totalRecordCount: null,
                },
            ];
        },
        getPlaylistTrackListCount: async (request, fetchOptions) => {
            const { query } = request;
            const result = await apiClient.getPlaylist.get({
                fetchOptions,
                query: {
                    id: query.id,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'getPlaylistSongListCount'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            return [null, result.body.playlist.entry.length];
        },
        getTrackList: async (request, fetchOptions) => {
            const { query } = request;

            const result = await apiClient.search3.get({
                fetchOptions,
                query: {
                    musicFolderId: query.musicFolderId,
                    query: '',
                    songCount: query.limit,
                    songOffset: query.startIndex,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'getSongList'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            const items: AdapterTrack[] = (result.body.searchResult3.song || []).map((song) => {
                const splitPath = song.path?.split('/');
                const fileName = splitPath[splitPath.length - 1];

                return {
                    album: song.album,
                    albumId: song.albumId,
                    artistId: song.artistId || null,
                    artistName: song.artist || '',
                    artists: [
                        ...(song.artistId
                            ? [{ id: song.artistId, imageUrl: null, name: song.artist || '' }]
                            : []),
                    ],
                    bitrate: song.bitRate ?? null,
                    bpm: null,
                    channels: song.channelCount ?? null,
                    comment: null,
                    container: song.suffix,
                    createdAt: song.created,
                    discNumber: song.discNumber ? String(song.discNumber) : '1',
                    discSubtitle: null,
                    duration: song.duration,
                    external: {
                        musicbrainz: {
                            id: null,
                            name: null,
                        },
                    },
                    fileName,
                    filePath: song.path,
                    fileSize: song.size,
                    genres: [...(song.genre ? [{ id: song.genre, name: song.genre }] : [])],
                    id: song.id,
                    imageUrl: song.coverArt,
                    isCompilation: false,
                    isFavorite: Boolean(song.starred),
                    lastPlayedAt: song.played || null,
                    lyrics: null,
                    mbzId: null,
                    name: song.title,
                    peak: null,
                    playCount: song.playCount || 0,
                    releaseDate: utils.date.format(String(song.year || 0), 'YYYY-MM-DD'),
                    releaseYear: song.year || 0,
                    replayGain: {
                        albumGain: null,
                        albumPeak: null,
                        trackGain: null,
                        trackPeak: null,
                    },
                    samplerate: song.samplingRate ?? null,
                    songCount: null,
                    trackNumber: song.track || 1,
                    updatedAt: song.created,
                    userFavorite: Boolean(song.starred),
                    userRating: song.userRating ?? null,
                };
            });

            return [
                null,
                {
                    items,
                    startIndex: query.startIndex,
                    totalRecordCount: null,
                },
            ];
        },
        getTrackListCount: async (request, fetchOptions) => {
            const { query } = request;
            const limit = 500;

            const getPageItemCount = async (page: number): Promise<number> => {
                const result = await apiClient.search3.get({
                    fetchOptions,
                    query: {
                        musicFolderId: query.musicFolderId,
                        query: '',
                        songCount: limit,
                        songOffset: page * limit,
                    },
                });

                if (result.status !== 200) {
                    writeLog.error(adapterErrorMessage(library, 'getSongListCount'));
                    return 0;
                }

                return result.body.searchResult3.song?.length || 0;
            };

            const fetchRecursive = async (
                page: number,
                itemsPerPage: number,
                currentPage: number,
                totalItems: number,
            ): Promise<number> => {
                const itemCount = await getPageItemCount(page);
                totalItems += itemCount;

                if (itemCount < itemsPerPage) {
                    return totalItems;
                } else {
                    return fetchRecursive(page + 1, itemsPerPage, currentPage + 1, totalItems);
                }
            };

            const fetchPaginatedItemCount = async () => {
                return fetchRecursive(0, limit, 0, 0);
            };

            const totalItems = await fetchPaginatedItemCount();
            return [null, totalItems];
        },
        removeFromPlaylist: async (request, fetchOptions) => {
            const { query, body } = request;

            const result = await apiClient.updatePlaylist.get({
                fetchOptions,
                query: {
                    playlistId: query.id,
                    songIdToRemove: body.entry,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'removeFromPlaylist'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            return [null, null];
        },
        scrobble: async (request, fetchOptions) => {
            const { query } = request;
            const result = await apiClient.scrobble.get({
                fetchOptions,
                query: {
                    id: query.id,
                    submission: true,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'scrobble'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            return [null, null];
        },
        setFavorite: async (request, fetchOptions) => {
            const { body } = request;

            const trackIds = { add: [] as string[], remove: [] as string[] };
            const albumIds = { add: [] as string[], remove: [] as string[] };
            const artistIds = { add: [] as string[], remove: [] as string[] };

            for (const entry of body.entry) {
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

            const shouldAdd =
                albumIds.add.length > 0 || artistIds.add.length > 0 || trackIds.add.length > 0;

            const shouldRemove =
                albumIds.remove.length > 0 ||
                artistIds.remove.length > 0 ||
                trackIds.remove.length > 0;

            if (shouldAdd) {
                const result = await apiClient.star.get({
                    fetchOptions,
                    query: {
                        albumId: albumIds.add,
                        artistId: artistIds.add,
                        id: trackIds.add,
                    },
                });

                if (result.status !== 200) {
                    writeLog.error(adapterErrorMessage(library, 'setFavorite'));
                    return [{ code: result.status, message: result.body as string }, null];
                }
            }

            if (shouldRemove) {
                const result = await apiClient.star.get({
                    fetchOptions,
                    query: {
                        albumId: albumIds.add,
                        artistId: artistIds.add,
                        id: trackIds.add,
                    },
                });

                if (result.status !== 200) {
                    writeLog.error(adapterErrorMessage(library, 'setFavorite'));
                    return [{ code: result.status, message: result.body as string }, null];
                }
            }

            return [null, null];
        },
        setRating: async (request, fetchOptions) => {
            const { body } = request;

            for (const entry of body.entry) {
                const result = await apiClient.setRating.get({
                    fetchOptions,
                    query: {
                        id: entry.id,
                        rating: entry.rating,
                    },
                });

                if (result.status !== 200) {
                    writeLog.error(adapterErrorMessage(library, 'setRating'));
                    return [{ code: result.status, message: result.body as string }, null];
                }
            }

            return [null, null];
        },
        stream: async (request, fetchOptions) => {
            const { query } = request;
            const result = await apiClient.stream.get({
                fetchOptions,
                query: {
                    id: query.id,
                },
            });

            if (result.status !== 200) {
                writeLog.error(adapterErrorMessage(library, 'stream'));
                return [{ code: result.status, message: result.body as string }, null];
            }

            return [null, result.body];
        },
    };

    return adapter;
};

type SubsonicAuthenticationResponse = {
    'subsonic-response': {
        status: string;
        version: string;
    };
};

type SubsonicMusicFolderListResponse = {
    'subsonic-response': {
        musicFolders: {
            musicFolder: {
                id: string;
                name: string;
            }[];
        };
        status: string;
        version: string;
    };
};

export const subsonicAuthenticationAdapter: AdapterAuthentication = {
    authenticate: async (url, body) => {
        const cleanServerUrl = url.replace(/\/$/, '');

        const authenticationUrl = `${cleanServerUrl}/rest/ping`;

        const salt = generateRandomString(12);
        const token = md5(body.password + salt);

        let result: AuthenticationResponse | null = null;

        // Attempt to authenticate with salt and hash
        const { data: hashAuth } = await axios.get<SubsonicAuthenticationResponse>(
            authenticationUrl,
            {
                params: {
                    c: CONSTANTS.APP_NAME,
                    f: 'json',
                    p: body.password,
                    s: salt,
                    t: token,
                    u: body.username,
                    v: '1.13.0',
                },
            },
        );

        if (hashAuth['subsonic-response'].status === 'ok') {
            result = {
                auth: {
                    credential: utils.delimiter.credential([salt, token]),
                    username: body.username,
                },
                folders: [],
            };
        } else {
            // Attempt to authenticate with password
            const { data: plainAuth } = await axios.get<SubsonicAuthenticationResponse>(
                authenticationUrl,
                {
                    params: {
                        c: CONSTANTS.APP_NAME,
                        f: 'json',
                        p: body.password,
                        s: salt,
                        t: token,
                        u: body.username,
                        v: '1.13.0',
                    },
                },
            );

            if (plainAuth['subsonic-response'].status === 'ok') {
                result = {
                    auth: {
                        credential: body.password,
                        username: body.username,
                    },
                    folders: [],
                };
            }
        }

        if (result?.auth) {
            const musicFolderListUrl = `${cleanServerUrl}/rest/getMusicFolders`;

            const { data: musicFolderListResponse } =
                await axios.get<SubsonicMusicFolderListResponse>(musicFolderListUrl, {
                    params: {
                        c: CONSTANTS.APP_NAME,
                        f: 'json',
                        p: body.password,
                        s: salt,
                        t: token,
                        u: body.username,
                        v: '1.13.0',
                    },
                });

            if (musicFolderListResponse['subsonic-response'].status === 'ok') {
                result.folders = musicFolderListResponse[
                    'subsonic-response'
                ].musicFolders.musicFolder.map((folder) => ({
                    id: folder.id,
                    name: folder.name,
                }));
            }

            return result;
        }

        return null;
    },
    ping: async () => {
        return true;
    },
};
