import type { OpenSubsonicApiClient } from '@audioling/open-subsonic-api-client';
import dayjs from 'dayjs';
import type { AdapterAlbum } from '@/adapters/types/adapter-album-types.js';
import type { AdapterArtist } from '@/adapters/types/adapter-artist-types.js';
import type {
    AdapterPlaylist,
    AdapterPlaylistTrack,
} from '@/adapters/types/adapter-playlist-types.js';
import type { AdapterTrack } from '@/adapters/types/adapter-track-types.js';

export type SubsonicTrack = NonNullable<
    Extract<
        Awaited<ReturnType<OpenSubsonicApiClient['getAlbum']['os']['1']['get']>>,
        { status: 200 }
    >['body']['album']['song']
>[number];

export type SubsonicAlbum = Extract<
    Awaited<ReturnType<OpenSubsonicApiClient['getAlbum']['os']['1']['get']>>,
    { status: 200 }
>['body']['album'];

export type SubsonicArtist = Extract<
    Awaited<ReturnType<OpenSubsonicApiClient['getArtist']['os']['1']['get']>>,
    { status: 200 }
>['body']['artist'];

export type SubsonicPlaylist = Extract<
    Awaited<ReturnType<OpenSubsonicApiClient['getPlaylists']['os']['1']['get']>>,
    { status: 200 }
>['body']['playlists']['playlist'][number];

type PlaylistListEntry = Extract<
    Awaited<ReturnType<OpenSubsonicApiClient['getPlaylists']['os']['1']['get']>>,
    { status: 200 }
>['body']['playlists']['playlist'][number];

type ArtistListEntry = NonNullable<
    Extract<
        Awaited<ReturnType<OpenSubsonicApiClient['getArtists']['os']['1']['get']>>,
        { status: 200 }
    >['body']['artists']['index'][number]['artist']
>[number];

const getArtists = (item: SubsonicAlbum | SubsonicTrack) => {
    if (item.artists) {
        return item.artists.map((artist) => ({
            id: artist.id,
            imageUrl: null,
            name: artist.name,
        }));
    }

    if (item.artistId) {
        return [{ id: item.artistId, imageUrl: null, name: item.artist || '' }];
    }

    return [];
};

const getAlbumArtists = (item: SubsonicTrack) => {
    if (item.albumArtists) {
        return item.albumArtists.map((artist) => ({
            id: artist.id,
            imageUrl: null,
            name: artist.name,
        }));
    }

    if (item.artistId) {
        return [{ id: item.artistId, imageUrl: null, name: item.artist || '' }];
    }

    return [];
};

const getGenres = (item: SubsonicAlbum | SubsonicTrack) => {
    if (item.genres) {
        return item.genres.map((genre) => ({
            id: genre.genre,
            imageUrl: null,
            name: genre.genre,
        }));
    }

    if (item.genre) {
        return [{ id: item.genre, imageUrl: null, name: item.genre }];
    }

    return [];
};

const getDateFromItemDate = (itemDate?: { day?: number; month?: number; year?: number }) => {
    if (itemDate?.day && itemDate?.month && itemDate?.year) {
        return dayjs(`${itemDate.year}-${itemDate.month}-${itemDate.day}`).toISOString();
    }

    return null;
};

const getRecordLabels = (album: SubsonicAlbum) => {
    if (album.recordLabels) {
        return album.recordLabels.map((recordLabel) => ({
            id: recordLabel.name,
            name: recordLabel.name,
        }));
    }

    return [];
};

const converter = {
    albumToAdapter: (album: SubsonicAlbum): AdapterAlbum => {
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
            external: {
                musicBrainzId: album.musicBrainzId,
            },
            genres: getGenres(album),
            id: album.id,
            imageUrl: album.coverArt || null,
            isCompilation: album.isCompilation || false,
            moods: (album.moods || []).map((mood) => ({ id: mood, name: mood })) || [],
            name: album.name,
            originalReleaseDate: getDateFromItemDate(album.originalReleaseDate),
            recordLabels: getRecordLabels(album),
            releaseDate: getDateFromItemDate(album.releaseDate),
            releaseTypes: (album.releaseTypes || []).map((releaseType) => ({
                id: releaseType,
                name: releaseType,
            })),
            releaseYear: album.year || null,
            size: null,
            songCount: album.songCount,
            sortName: album.sortName || album.name,
            updatedDate: album.created,
            userFavorite: Boolean(album.starred),
            userFavoriteDate: album.starred || null,
            userLastPlayedDate: dayjs(album.played).toISOString() || null,
            userPlayCount: album.playCount || null,
            userRating: album.userRating ?? null,
            userRatingDate: null,
        };

        return item;
    },
    artistToAdapter: (artist: SubsonicArtist | ArtistListEntry): AdapterArtist => {
        const item: AdapterArtist = {
            albumCount: null,
            biography: null,
            createdDate: null,
            duration: 0,
            external: {},
            genres: [],
            id: artist.id,
            name: artist.name,
            songCount: null,
            updatedDate: null,
            userFavorite: Boolean(artist.starred),
            userFavoriteDate: dayjs(artist.starred).toISOString() || null,
            userLastPlayedDate: null,
            userRating: artist.userRating ?? null,
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
            imageUrl: playlist.coverArt || null,
            isPublic: playlist.public || false,
            name: playlist.name,
            owner: playlist.owner || null,
            ownerId: playlist.owner || null,
            size: null,
            trackCount: playlist.songCount,
            updatedDate: dayjs(playlist.created).toISOString(),
        };
    },
    playlistTrackToAdapter: (track: SubsonicTrack): AdapterPlaylistTrack => {
        return {
            ...converter.trackToAdapter(track),
            playlistTrackId: track.id,
        };
    },
    trackToAdapter: (track: SubsonicTrack): AdapterTrack => {
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
            contributors: (track.contributors || []).map((contributor) => ({
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
            external: {
                musicBrainzId: track.musicBrainzId,
            },
            fileContainer: track.suffix || null,
            fileName: fileName,
            filePath: track.path || null,
            fileSize: track.size || null,
            genres: getGenres(track),
            id: track.id,
            isCompilation: false,
            lyrics: null,
            moods: track.moods?.map((mood) => ({ id: mood, name: mood })) || [],
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

export const subsonicHelpers = {
    converter,
};
