import type { OpenSubsonicApiClient } from '@audioling/open-subsonic-api-client';
import type { AdapterAlbum } from '../../../shared-types/src/adapter/adapter-album.js';
import type { AdapterArtist } from '../../../shared-types/src/adapter/adapter-artist.js';
import type { AdapterPlaylist, AdapterPlaylistTrack } from '../../../shared-types/src/adapter/adapter-playlist.js';
import type { AdapterTrack } from '../../../shared-types/src/adapter/adapter-track.js';
import {
    AlbumListSortOptions,
} from '@repo/shared-types/app-types';
import dayjs from 'dayjs';

export type OpenSubsonicTrack = NonNullable<
    Extract<
        Awaited<ReturnType<OpenSubsonicApiClient['getAlbum']['os']['1']['get']>>,
        { status: 200 }
    >['body']['subsonic-response']['album']['song']
>[number];

export type OpenSubsonicAlbum = Extract<
    Awaited<ReturnType<OpenSubsonicApiClient['getAlbum']['os']['1']['get']>>,
    { status: 200 }
>['body']['subsonic-response']['album'];

export type SubsonicArtist = Extract<
    Awaited<ReturnType<OpenSubsonicApiClient['getArtist']['os']['1']['get']>>,
    { status: 200 }
>['body']['subsonic-response']['artist'];

export type SubsonicPlaylist = NonNullable<
    Extract<
        Awaited<ReturnType<OpenSubsonicApiClient['getPlaylists']['os']['1']['get']>>,
        { status: 200 }
    >['body']['subsonic-response']['playlists']['playlist']
>[number];

type PlaylistListEntry = NonNullable<
    Extract<
        Awaited<ReturnType<OpenSubsonicApiClient['getPlaylists']['os']['1']['get']>>,
        { status: 200 }
    >['body']['subsonic-response']['playlists']['playlist']
>[number];

type ArtistListEntry = NonNullable<
    Extract<
        Awaited<ReturnType<OpenSubsonicApiClient['getArtists']['os']['1']['get']>>,
        { status: 200 }
    >['body']['subsonic-response']['artists']['index'][number]['artist']
>[number];

function getArtists(item: OpenSubsonicAlbum | OpenSubsonicTrack) {
    if (item.artists) {
        return item.artists.map(artist => ({
            id: artist.id,
            imageUrl: null,
            name: artist.name,
        }));
    }

    if (item.artistId) {
        return [{ id: item.artistId, imageUrl: null, name: item.artist || '' }];
    }

    return [];
}

function getAlbumArtists(item: OpenSubsonicTrack) {
    if (item.albumArtists) {
        return item.albumArtists.map(artist => ({
            id: artist.id,
            imageUrl: null,
            name: artist.name,
        }));
    }

    if (item.artistId) {
        return [{ id: item.artistId, imageUrl: null, name: item.artist || '' }];
    }

    return [];
}

function getGenres(item: OpenSubsonicAlbum | OpenSubsonicTrack) {
    if (item.genres) {
        return item.genres.map(genre => ({
            id: genre.name,
            imageUrl: null,
            name: genre.name,
        }));
    }

    if (item.genre) {
        return [{ id: item.genre, imageUrl: null, name: item.genre }];
    }

    return [];
}

function getDateFromItemDate(itemDate?: { day?: number; month?: number; year?: number }) {
    if (itemDate?.day && itemDate?.month && itemDate?.year) {
        return dayjs(`${itemDate.year}-${itemDate.month}-${itemDate.day}`).toISOString();
    }

    return null;
}

function getRecordLabels(album: OpenSubsonicAlbum) {
    if (album.recordLabels) {
        return album.recordLabels.map(recordLabel => ({
            id: recordLabel.name,
            name: recordLabel.name,
        }));
    }

    return [];
}

const converter = {
    albumToAdapter: (album: OpenSubsonicAlbum): AdapterAlbum => {
        const item: AdapterAlbum = {
            artist: album.artist || null,
            artistId: album.artistId || null,
            artists: getArtists(album),
            comment: null,
            createdDate: album.created,
            description: null,
            discTitles: album.discTitles || [],
            displayArtist: album.displayArtist || null,
            duration: album.duration,
            genres: getGenres(album),
            id: album.id,
            imageUrl: album.coverArt || album.id,
            isCompilation: album.isCompilation || false,
            maxOriginalYear: album.originalReleaseDate?.year || album.year || null,
            maxReleaseYear: album.year || null,
            mbzAlbumId: album.musicBrainzId || null,
            mbzReleaseGroupId: null,
            minOriginalYear: album.originalReleaseDate?.year || album.year || null,
            minReleaseYear: album.year || null,
            missing: false,
            moods: (album.moods || []).map(mood => ({ id: mood, name: mood })) || [],
            name: album.name,
            originalReleaseDate: getDateFromItemDate(album.originalReleaseDate),
            participants: {},
            recordLabels: getRecordLabels(album),
            releaseDate: getDateFromItemDate(album.releaseDate),
            releaseTypes: (album.releaseTypes || []).map(releaseType => ({
                id: releaseType,
                name: releaseType,
            })),
            size: null,
            sortName: album.sortName || album.name,
            tags: {},
            trackCount: album.songCount,
            updatedDate: album.created,
            userFavorite: Boolean(album.starred),
            userFavoriteDate: album.starred || null,
            userLastPlayedDate: dayjs(album.played).toISOString() || null,
            userPlayCount: album.playCount || null,
            userRating: album.userRating ?? 0,
            userRatingDate: null,
        };

        return item;
    },
    artistToAdapter: (artist: ArtistListEntry): AdapterArtist => {
        const item: AdapterArtist = {
            albumCount: artist.albumCount || null,
            biography: null,
            createdDate: null,
            duration: 0,
            genres: [],
            id: artist.id,
            imageUrl: artist.artistImageUrl || artist.id,
            musicBrainzId: artist.musicBrainzId || null,
            name: artist.name,
            trackCount: null,
            updatedDate: null,
            userFavorite: Boolean(artist.starred),
            userFavoriteDate: dayjs(artist.starred).toISOString() || null,
            userLastPlayedDate: null,
            userRating: null,
            userRatingDate: null,
        };

        return item;
    },
    playlistToAdapter: (playlist: SubsonicPlaylist | PlaylistListEntry): AdapterPlaylist => {
        return {
            createdDate: dayjs(playlist.created).toISOString(),
            description: playlist.comment || null,
            duration: playlist.duration,
            genres: [],
            id: playlist.id,
            imageUrl: playlist.coverArt || playlist.id,
            isPublic: playlist.public || false,
            name: playlist.name,
            owner: playlist.owner || null,
            ownerId: playlist.owner || null,
            parentId: null,
            size: null,
            trackCount: playlist.songCount,
            updatedDate: dayjs(playlist.created).toISOString(),
        };
    },
    playlistTrackToAdapter: (track: OpenSubsonicTrack): AdapterPlaylistTrack => {
        return {
            ...converter.trackToAdapter(track),
            playlistTrackId: track.id,
        };
    },
    trackToAdapter: (track: OpenSubsonicTrack): AdapterTrack => {
        const splitPath = track.path?.split('/');
        const fileName = splitPath?.[splitPath.length - 1] || null;

        const item: AdapterTrack = {
            album: track.album || null,
            albumArtists: getAlbumArtists(track),
            albumId: track.albumId || null,
            artistId: track.artistId || null,
            artistName: track.artist || '',
            artists: getArtists(track),
            bitDepth: track.bitDepth ?? null,
            bitRate: track.bitRate ?? null,
            bpm: track.bpm ?? null,
            channelCount: track.channelCount ?? null,
            comment: null,
            contributors: (track.contributors || []).map(contributor => ({
                artist: {
                    id: contributor.artist.id,
                    imageUrl: null,
                    name: contributor.artist.name,
                },
                role: contributor.role,
                subRole: contributor.subRole || null,
            })),
            createdDate: track.created || null,
            discNumber: track.discNumber ? String(track.discNumber) : '1',
            discSubtitle: null,
            displayAlbumArtist: track.displayAlbumArtist || null,
            displayArtist: track.displayArtist || null,
            displayComposer: track.displayComposer || null,
            duration: track.duration ?? 0,
            fileContainer: track.suffix || null,
            fileName,
            filePath: track.path || null,
            fileSize: track.size || null,
            genres: getGenres(track),
            id: track.id,
            imageUrl: track.coverArt ? [track.coverArt] : [],
            isCompilation: false,
            lyrics: null,
            moods: track.moods?.map(mood => ({ id: mood, name: mood })) || [],
            musicBrainzId: track.musicBrainzId || null,
            name: track.title,
            releaseYear: track.year || null,
            rgAlbumGain: track.replayGain?.albumGain ?? null,
            rgAlbumPeak: track.replayGain?.albumPeak ?? null,
            rgBaseGain: track.replayGain?.baseGain ?? null,
            rgTrackGain: track.replayGain?.trackGain ?? null,
            rgTrackPeak: track.replayGain?.trackPeak ?? null,
            sampleRate: track.samplingRate ?? null,
            sortName: track.sortName || track.title,
            trackNumber: track.track || 1,
            updatedDate: null,
            userFavorite: Boolean(track.starred),
            userFavoriteDate: track.starred ? dayjs(track.starred).toISOString() : null,
            userLastPlayedDate: track.played || null,
            userPlayCount: track.playCount || 0,
            userRating: track.userRating ?? null,
            userRatingDate: null,
        };

        return item;
    },
};

const defaultSortType = 'alphabeticalByName';

const sortByMap = {
    [AlbumListSortOptions.ALBUM_ARTIST]: 'alphabeticalByArtist',
    [AlbumListSortOptions.ARTIST]: defaultSortType,
    [AlbumListSortOptions.COMMUNITY_RATING]: defaultSortType,
    [AlbumListSortOptions.CRITIC_RATING]: defaultSortType,
    [AlbumListSortOptions.RATING]: 'highest',
    [AlbumListSortOptions.DATE_ADDED]: 'newest',
    [AlbumListSortOptions.DATE_PLAYED]: 'recent',
    [AlbumListSortOptions.DURATION]: defaultSortType,
    [AlbumListSortOptions.IS_FAVORITE]: defaultSortType,
    [AlbumListSortOptions.NAME]: 'alphabeticalByName',
    [AlbumListSortOptions.PLAY_COUNT]: 'frequent',
    [AlbumListSortOptions.RANDOM]: defaultSortType,
    [AlbumListSortOptions.RELEASE_DATE]: defaultSortType,
    [AlbumListSortOptions.TRACK_COUNT]: defaultSortType,
    [AlbumListSortOptions.YEAR]: defaultSortType,
};

export const osUtils = {
    converter,
    sortByMap,
};
