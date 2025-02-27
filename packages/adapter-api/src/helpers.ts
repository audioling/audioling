import type { AdapterAlbum } from '../../shared-types/src/adapter/adapter-album.js';
import type { AdapterArtist } from '../../shared-types/src/adapter/adapter-artist.js';
import type { AdapterGenre } from '../../shared-types/src/adapter/adapter-genre.js';
import type { AdapterPlaylist, AdapterPlaylistTrack } from '../../shared-types/src/adapter/adapter-playlist.js';
import type { AdapterTrack } from '../../shared-types/src/adapter/adapter-track.js';
import {
    AlbumListSortOptions,
    ArtistListSortOptions,
    GenreListSortOptions,
    PlaylistListSortOptions,
    type ServerItemType,
    TrackListSortOptions,
} from '@repo/shared-types/app-types';
import dayjs from 'dayjs';
import { orderBy, shuffle } from 'lodash';
import stringify from 'safe-stable-stringify';

export async function fetchTotalRecordCount(args: {
    fetcher: (page: number, limit: number) => Promise<number>;
    fetchLimit?: number;
}) {
    const limit = args.fetchLimit || 500;

    const estimatedCount = await estimateTotalRecordCount({
        fetcher: args.fetcher,
        limit,
    });
    const estimatedPages = Math.ceil(estimatedCount / limit);
    const totalRecordCount = await exactTotalRecordCount({
        fetcher: args.fetcher,
        limit,
        startPage: estimatedPages,
    });
    return totalRecordCount;
}

export async function fetchAllRecords<T>(args: {
    fetcher: (page: number, limit: number) => Promise<T[]>;
    fetchLimit?: number;
    items?: T[];
    page?: number;
}) {
    const limit = args.fetchLimit || 500;
    const page = args.page || 0;
    const items = args.items || [];

    const result = await args.fetcher(page, limit);

    // If we get an empty array, we've reached the end
    if (result.length === 0) {
        return items;
    }

    // If we get less than the limit, we've reached the end
    if (result.length < limit) {
        return [...result, ...items];
    }

    return fetchAllRecords({
        fetcher: args.fetcher,
        fetchLimit: args.fetchLimit,
        items: [...items, ...result],
        page: page + 1,
    });
}

export async function estimateTotalRecordCount(args: {
    fetcher: (page: number, limit: number) => Promise<number>;
    limit: number;
}) {
    const { fetcher, limit } = args;

    // Recursive binary search across all pages to estimate total rows
    async function estimateTotalRowsRecursive(
        low: number,
        high: number,
        limit: number,
    ): Promise<number> {
        if (low > high) {
            return 0; // This condition is just a safeguard and shouldn't be reached
        }

        const mid = Math.floor((low + high) / 2);
        const data = await fetcher(mid, limit);

        if (data < limit) {
            // If the current page contains fewer than 500 items, it's close to the last page
            const itemCount = (mid - 1) * limit + data;
            return itemCount;
        }
        else {
            // If the current page is full, search in the higher half
            return estimateTotalRowsRecursive(mid + 1, high, limit);
        }
    }

    // Function to estimate total rows with limited page size
    async function estimateTotalRows(): Promise<number> {
        let low = 1;
        let high = 2;

        // Step 1: Exponentially grow the number of pages to get an upper bound for the total pages

        while (true) {
            const data = await fetcher(high, limit);

            if (data < limit) {
                // If we encounter the last page, break out of the loop
                break;
            }

            // Double the upper bound for the number of pages
            low = high;
            high *= 2;
        }

        // Step 2: Perform binary search across all pages to find the exact number of rows
        return estimateTotalRowsRecursive(low, high, limit);
    }

    return estimateTotalRows();
}

export async function exactTotalRecordCount(args: {
    fetcher: (page: number, limit: number) => Promise<number>;
    limit: number;
    startPage: number;
}) {
    const { fetcher, limit, startPage } = args;

    // Add early return for page 1 with no results
    if (startPage === 1) {
        const firstPageCount = await fetcher(1, limit);
        if (firstPageCount === 0) {
            return 0;
        }
    }

    const fetchCountRecursive = async (
        page: number,
        limit: number,
        reverse: boolean,
        totalRecordCount: number,
        previousPageRecordCount?: number,
    ): Promise<number> => {
        // Add guard against negative page numbers
        if (page < 1) {
            return totalRecordCount;
        }

        const currentPageRecordCount = await fetcher(page, limit);

        if (currentPageRecordCount !== limit && currentPageRecordCount !== 0) {
            totalRecordCount += currentPageRecordCount;
            return totalRecordCount;
        }

        // Handle the case when the last page is equal to the limit and is ascending
        if (
            !reverse
            && currentPageRecordCount !== limit
            && currentPageRecordCount === 0
            && currentPageRecordCount === previousPageRecordCount
        ) {
            return totalRecordCount;
        }

        if (reverse) {
            totalRecordCount -= limit;
            return fetchCountRecursive(
                page - 1,
                limit,
                true,
                totalRecordCount,
                currentPageRecordCount,
            );
        }
        else {
            totalRecordCount += currentPageRecordCount;
            return fetchCountRecursive(
                page + 1,
                limit,
                false,
                totalRecordCount,
                currentPageRecordCount,
            );
        }
    };

    const estimatedStartRecordCount = startPage * limit;
    const startPageRecordCount = await fetcher(startPage, limit);
    const isLastPage = startPageRecordCount < limit && startPageRecordCount !== 0;

    if (isLastPage) {
        if (estimatedStartRecordCount < limit) {
            return estimatedStartRecordCount + startPageRecordCount;
        }

        return estimatedStartRecordCount - limit + startPageRecordCount;
    }

    const shouldReverse = startPageRecordCount < limit;

    const count = await fetchCountRecursive(
        startPage,
        limit,
        shouldReverse,
        estimatedStartRecordCount,
    );
    return count;
}

function paginate<T>(array: T[], offset: number, limit: number) {
    let result;

    if (limit === -1) {
        result = array.slice(offset);
    }
    else {
        result = array.slice(offset, offset + limit);
    }

    return {
        items: result,
        limit: limit === -1 ? array.length : limit,
        offset,
    };
}

function search<T>(array: T[], searchTerm: string, keys: (keyof T)[]) {
    return array.filter(item =>
        keys.some((key) => {
            const value = item[key];
            return String(value ?? '')
                .toLocaleLowerCase()
                .includes(searchTerm.toLocaleLowerCase());
        }),
    );
}

const counts = new Map<string, { count: number; expires: number }>();

setInterval(() => {
    counts.forEach((value, key) => {
        if (value.expires < dayjs().unix()) {
            counts.delete(key);
        }
    });
}, 1000 * 60 * 10); // 10 minutes

function setListCount(key: string, count: number, expiresMinutes = 10000) {
    counts.set(key, { count, expires: dayjs().unix() + expiresMinutes }); // 10 minutes
}

async function getListCount(options: {
    expiration?: number; // Expiration in minutes
    fetchLimit?: number;
    query: Record<string, unknown>;
    serverId: string;
    type: ServerItemType;
}, fetcher?: (page: number, limit: number) => Promise<number>) {
    const hash = stringify(options.query);
    const key = `${options.serverId}::${options.type}::${hash}`;
    const value = counts.get(key);

    if (fetcher && (!value || value.expires < dayjs().unix())) {
        const totalRecordCount = await fetchTotalRecordCount({ fetcher, fetchLimit: options.fetchLimit });
        setListCount(key, totalRecordCount);
        return totalRecordCount;
    }

    return value?.count;
};

function invalidateListCount(key?: string) {
    if (key) {
        return counts.delete(key);
    }

    return counts.clear();
}

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

export const helpers = {
    estimateTotalRecordCount,
    exactTotalRecordCount,
    fetchAllRecords,
    fetchTotalRecordCount,
    getListCount,
    invalidateListCount,
    paginate,
    search,
    setListCount,
    sortBy,
};

export function generateRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
