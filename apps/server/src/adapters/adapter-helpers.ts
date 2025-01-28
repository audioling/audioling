import {
    AlbumListSortOptions,
    ArtistListSortOptions,
    GenreListSortOptions,
    PlaylistListSortOptions,
    TrackListSortOptions,
} from '@repo/shared-types';
import dayjs from 'dayjs';
import orderBy from 'lodash/orderBy.js';
import shuffle from 'lodash/shuffle.js';
import md5 from 'md5';
import stringify from 'safe-stable-stringify';
import type { AdapterAlbum } from '@/adapters/types/adapter-album-types.js';
import type { AdapterArtist } from '@/adapters/types/adapter-artist-types.js';
import type { AdapterGenre } from '@/adapters/types/adapter-genre-types.js';
import type {
    AdapterPlaylist,
    AdapterPlaylistTrack,
} from '@/adapters/types/adapter-playlist-types.js';
import type { AdapterTrack } from '@/adapters/types/adapter-track-types.js';
import { CONSTANTS } from '@/constants.js';
import type { AppDatabase } from '@/database/init-database.js';
import type { DbLibrary } from '@/database/library-database.js';
import { utils } from '@/utils/index.js';
import packageJson from '../../package.json';

const fetchLimit = 500;

const hashQuery = (query: Record<string, unknown>) => {
    const deterministicQuery = stringify(query);
    return md5(deterministicQuery);
};

const fetchTotalRecordCount = async (
    fetcher: (page: number, limit: number) => Promise<number>,
    fetchLimit?: number,
) => {
    const limit = fetchLimit || 500;

    const estimatedCount = await utils.estimateTotalRecordCount(fetcher, limit);
    const estimatedPages = Math.ceil(estimatedCount / limit);
    const totalRecordCount = await utils.exactTotalRecordCount(fetcher, estimatedPages, limit);
    return totalRecordCount;
};

const fetchAllRecords = async <T>(
    fetcher: (page: number, limit: number) => Promise<T[]>,
    fetchLimit?: number,
    page: number = 0,
    items: T[] = [],
) => {
    const limit = fetchLimit || 500;

    const result = await fetcher(page, limit);

    // If we get an empty array, we've reached the end
    if (result.length === 0) {
        return items;
    }

    // If we get less than the limit, we've reached the end
    if (result.length < limit) {
        return [...result, ...items];
    }

    return fetchAllRecords(fetcher, fetchLimit, page + 1, [...items, ...result]);
};

const db = {
    getCount: async (
        db: AppDatabase,
        fetcher: (page: number, limit: number) => Promise<number>,
        options: {
            expiration?: number; // Expiration in minutes
            fetchLimit?: number;
            libraryId: string;
            query: Record<string, unknown>;
            type: 'album' | 'artist' | 'track' | 'playlist';
        },
    ) => {
        const hash = hashQuery(options.query);
        const key = `${options.libraryId}::${options.type}::${hash}`;
        const [, value] = db.kv.findById(key);

        if (!value) {
            const totalRecordCount = await fetchTotalRecordCount(fetcher, fetchLimit);
            const expiresAt = dayjs()
                .add(options.expiration || 1440, 'minutes')
                .toISOString();
            db.kv.updateById(key, `${totalRecordCount}::${expiresAt}`);
            return totalRecordCount;
        }

        const [totalRecordCountFromDb, expiresAt] = value.split('::');

        if (value && dayjs().isAfter(dayjs(expiresAt))) {
            const totalRecordCount = await fetchTotalRecordCount(fetcher);
            const expiresAt = dayjs().add(1, 'day').toISOString();
            db.kv.updateById(key, `${totalRecordCount}::${expiresAt}`);
            return totalRecordCount;
        }

        return Number(totalRecordCountFromDb);
    },
    getCountWithoutFetch: (
        db: AppDatabase,
        options: {
            libraryId: string;
            query: Record<string, unknown>;
            type: 'album' | 'artist' | 'track' | 'playlist' | 'playlistDetail';
        },
    ) => {
        const hash = hashQuery(options.query);
        const key = `${options.libraryId}::${options.type}::${hash}`;
        const [, value] = db.kv.findById(key);

        if (!value) {
            return undefined;
        }

        const [totalRecordCountFromDb, expiresAt] = value.split('::');

        if (dayjs().isAfter(dayjs(expiresAt))) {
            return undefined;
        }

        return Number(totalRecordCountFromDb);
    },
    invalidateCount: (
        db: AppDatabase,
        options: {
            libraryId: string;
            query: Record<string, unknown>;
            type: 'album' | 'artist' | 'track' | 'playlist';
        },
    ) => {
        const hash = hashQuery(options.query);
        const key = `${options.libraryId}::${options.type}::${hash}`;
        db.kv.deleteById(key);
    },
    invalidateCountByLibraryId: (db: AppDatabase, libraryId: string) => {
        db.kv.deleteByIncludes(libraryId);
    },
    invalidateCountByType: (
        db: AppDatabase,
        options: {
            libraryId: string;
            type: 'album' | 'artist' | 'track' | 'playlist';
        },
    ) => {
        db.kv.deleteByIncludes(`${options.libraryId}::${options.type}`);
    },
    setCount: (
        db: AppDatabase,
        options: {
            count: number;
            expiration?: number;
            libraryId: string;
            query: Record<string, unknown>;
            type: 'album' | 'artist' | 'track' | 'playlist'; // Expiration in minutes
        },
    ) => {
        const hash = hashQuery(options.query);
        const key = `${options.libraryId}::${options.type}::${hash}`;
        const expiresAt = dayjs()
            .add(options.expiration || 1440, 'minutes')
            .toISOString();
        db.kv.updateById(key, `${options.count}::${expiresAt}`);
    },
};

const adapterErrorMessage = (library: DbLibrary, route: string) => {
    return `Remote adapter ${library.baseUrl}@${library.id}@${library.type} failed on ${route}`;
};

const sortBy = {
    album: (array: AdapterAlbum[], key: AlbumListSortOptions, order: 'asc' | 'desc') => {
        let value = array;

        switch (key) {
            case AlbumListSortOptions.ALBUM_ARTIST: {
                value = orderBy(value, ['artistId'], [order]);
                break;
            }
            case AlbumListSortOptions.ARTIST: {
                value = orderBy(value, ['artistId'], [order]);
                break;
            }
            case AlbumListSortOptions.COMMUNITY_RATING: {
                value = orderBy(value, ['userRating'], [order]);
                break;
            }
            case AlbumListSortOptions.CRITIC_RATING: {
                value = orderBy(value, ['userRating'], [order]);
                break;
            }
            case AlbumListSortOptions.DATE_ADDED: {
                value = orderBy(value, ['createdDate'], [order]);
                break;
            }
            case AlbumListSortOptions.DATE_PLAYED: {
                value = orderBy(value, ['userLastPlayedDate'], [order]);
                break;
            }
            case AlbumListSortOptions.DURATION: {
                value = orderBy(value, ['duration'], [order]);
                break;
            }
            case AlbumListSortOptions.IS_FAVORITE: {
                value = orderBy(value, ['userFavoriteDate', 'userFavorite'], [order, order]);
                break;
            }
            case AlbumListSortOptions.NAME: {
                value = orderBy(value, ['name'], [order]);
                break;
            }
            case AlbumListSortOptions.PLAY_COUNT: {
                value = orderBy(value, ['userPlayCount'], [order]);
                break;
            }
            case AlbumListSortOptions.RANDOM: {
                value = shuffle(value);
                break;
            }
            case AlbumListSortOptions.RELEASE_DATE: {
                value = orderBy(value, ['releaseDate'], [order]);
                break;
            }
            case AlbumListSortOptions.TRACK_COUNT: {
                value = orderBy(value, ['trackCount'], [order]);
                break;
            }
            case AlbumListSortOptions.YEAR: {
                value = orderBy(value, ['releaseYear'], [order]);
                break;
            }
        }

        return value;
    },
    artist: (array: AdapterArtist[], key: ArtistListSortOptions, order: 'asc' | 'desc') => {
        let value = array;

        switch (key) {
            case ArtistListSortOptions.NAME: {
                value = orderBy(value, ['name'], [order]);
                break;
            }
            case ArtistListSortOptions.TRACK_COUNT: {
                value = orderBy(value, ['trackCount'], [order]);
                break;
            }
            case ArtistListSortOptions.ALBUM_COUNT: {
                value = orderBy(value, ['albumCount'], [order]);
                break;
            }
        }

        return value;
    },
    genre: (array: AdapterGenre[], key: GenreListSortOptions, order: 'asc' | 'desc') => {
        let value = array;

        switch (key) {
            case GenreListSortOptions.NAME: {
                value = orderBy(value, ['name'], [order]);
                break;
            }
            case GenreListSortOptions.TRACK_COUNT: {
                value = orderBy(value, ['trackCount'], [order]);
                break;
            }
            case GenreListSortOptions.ALBUM_COUNT: {
                value = orderBy(value, ['albumCount'], [order]);
                break;
            }
        }

        return value;
    },
    playlist: (array: AdapterPlaylist[], key: PlaylistListSortOptions, order: 'asc' | 'desc') => {
        let value = array;

        switch (key) {
            case PlaylistListSortOptions.NAME: {
                value = orderBy(value, ['name'], [order]);
                break;
            }
            case PlaylistListSortOptions.TRACK_COUNT: {
                value = orderBy(value, ['trackCount'], [order]);
                break;
            }
            case PlaylistListSortOptions.DURATION: {
                value = orderBy(value, ['duration'], [order]);
                break;
            }
            case PlaylistListSortOptions.OWNER: {
                value = orderBy(value, ['owner'], [order]);
                break;
            }
            case PlaylistListSortOptions.PUBLIC: {
                value = orderBy(value, ['isPublic'], [order]);
                break;
            }
        }

        return value;
    },
    track: (
        array: AdapterTrack[] | AdapterPlaylistTrack[],
        key: TrackListSortOptions,
        order: 'asc' | 'desc',
    ) => {
        let value = array;

        switch (key) {
            case TrackListSortOptions.ALBUM: {
                value = orderBy(value, ['album'], [order]);
                break;
            }
            case TrackListSortOptions.ALBUM_ARTIST: {
                value = orderBy(value, ['artistId'], [order]);
                break;
            }
            case TrackListSortOptions.ARTIST: {
                value = orderBy(value, ['artistId'], [order]);
                break;
            }
            case TrackListSortOptions.BPM: {
                value = orderBy(value, ['bpm'], [order]);
                break;
            }
            case TrackListSortOptions.CHANNELS: {
                value = orderBy(value, ['channels'], [order]);
                break;
            }
            case TrackListSortOptions.COMMENT: {
                value = orderBy(value, ['comment'], [order]);
                break;
            }
            case TrackListSortOptions.DURATION: {
                value = orderBy(value, ['duration'], [order]);
                break;
            }
            case TrackListSortOptions.GENRE: {
                value = orderBy(value, ['genre'], [order]);
                break;
            }
            case TrackListSortOptions.ID: {
                break;
            }
            case TrackListSortOptions.IS_FAVORITE: {
                value = orderBy(value, ['userFavoriteDate', 'userFavorite'], [order, order]);
                break;
            }
            case TrackListSortOptions.NAME: {
                value = orderBy(value, ['name'], [order]);
                break;
            }
            case TrackListSortOptions.PLAY_COUNT: {
                value = orderBy(value, ['userPlayCount'], [order]);
                break;
            }
            case TrackListSortOptions.RANDOM: {
                value = shuffle(value);
                break;
            }
            case TrackListSortOptions.RATING: {
                value = orderBy(value, ['userRating'], [order]);
                break;
            }
            case TrackListSortOptions.RECENTLY_ADDED: {
                value = orderBy(value, ['recentlyAdded'], [order]);
                break;
            }
            case TrackListSortOptions.RECENTLY_PLAYED: {
                value = orderBy(value, ['userLastPlayedDate'], [order]);
                break;
            }
            case TrackListSortOptions.RELEASE_DATE: {
                value = orderBy(value, ['releaseYear'], [order]);
                break;
            }
            case TrackListSortOptions.YEAR: {
                value = orderBy(value, ['releaseYear'], [order]);
                break;
            }
        }

        return value;
    },
};

const paginate = <T>(array: T[], offset: number, limit: number) => {
    let result;

    if (limit === -1) {
        result = array.slice(offset);
    } else {
        result = array.slice(offset, offset + limit);
    }

    return {
        items: result,
        limit: limit === -1 ? array.length : limit,
        offset,
    };
};

const search = <T>(array: T[], searchTerm: string, keys: (keyof T)[]) => {
    return array.filter((item) =>
        keys.some((key) => {
            const value = item[key];
            return String(value ?? '')
                .toLocaleLowerCase()
                .includes(searchTerm.toLocaleLowerCase());
        }),
    );
};

const getAppId = (library: DbLibrary) => {
    return `${CONSTANTS.APP_NAME}@v${packageJson.version}—(${library.id})@${library.type}@${library.baseUrl}`;
};

export const adapterHelpers = {
    adapterErrorMessage,
    db,
    fetchAllRecords,
    getAppId,
    paginate,
    search,
    sortBy,
};
