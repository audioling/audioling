import type {
    ClientInferResponseBody,
    openSubsonicApiContract,
} from '@audioling/open-subsonic-api-client';
import dayjs from 'dayjs';
import type { AdapterAlbum } from '@/adapters/types/adapter-album-types.js';
import type { AdapterAlbumArtist } from '@/adapters/types/adapter-artist-types.js';
import type { AdapterPlaylist } from '@/adapters/types/adapter-playlist-types.js';
import type { AdapterTrack } from '@/adapters/types/adapter-track-types.js';
import { utils } from '@/utils/index.js';

type Track = NonNullable<
    ClientInferResponseBody<
        (typeof openSubsonicApiContract)['getAlbum']['get'],
        200
    >['album']['song']
>[number];

type Album = NonNullable<
    ClientInferResponseBody<(typeof openSubsonicApiContract)['getAlbum']['get'], 200>['album']
>;

type Artist = NonNullable<
    ClientInferResponseBody<(typeof openSubsonicApiContract)['getArtist']['get'], 200>['artist']
>;

type Playlist = NonNullable<
    ClientInferResponseBody<(typeof openSubsonicApiContract)['getPlaylist']['get'], 200>['playlist']
>;

type PlaylistListEntry = NonNullable<
    ClientInferResponseBody<
        (typeof openSubsonicApiContract)['getPlaylists']['get'],
        200
    >['playlists']
>['playlist'][number];

type ArtistListEntry = NonNullable<
    ClientInferResponseBody<
        (typeof openSubsonicApiContract)['getArtists']['get'],
        200
    >['artists']['index'][number]['artist'][number]
>;

const converter = {
    albumToAdapter: (album: Album): AdapterAlbum => {
        const item: AdapterAlbum = {
            albumArtistId: album.artistId || null,
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
            createdDate: album.created,
            description: null,
            discTitles: album.discTitles || [],
            duration: album.duration,
            external: {
                musicBrainzId: album.musicBrainzId || null,
            },
            genres: [...(album.genre ? [{ id: album.genre, name: album.genre }] : [])],
            id: album.id,
            imageUrl: album.coverArt,
            isCompilation: album.isCompilation || false,
            moods: album.moods?.map((mood) => ({ name: mood })) || [],
            name: album.name,
            originalReleaseDate: {
                day: album.originalReleaseDate?.day || null,
                month: album.originalReleaseDate?.month || null,
                year: Number(
                    album.originalReleaseDate?.year || album.releaseDate?.year || album.year || 0,
                ),
            },
            recordLabels: album.recordLabels || [],
            releaseDate: {
                day: album.releaseDate?.day || null,
                month: album.releaseDate?.month || null,
                year: Number(album.releaseDate?.year || album.year || 0),
            },
            releaseTypes: album.releaseTypes?.map((releaseType) => ({ name: releaseType })) || [],
            releaseYear: album.year || 0,
            size: null,
            songCount: album.songCount,
            sortName: album.sortName || album.name,
            updatedDate: album.created,
            userFavorite: Boolean(album.starred),
            userFavoriteDate: album.starred || null,
            userLastPlayedDate: dayjs(album.played).toISOString() || null,
            userPlayCount: album.playCount || 0,
            userRating: album.userRating ?? null,
            userRatingDate: null,
        };

        return item;
    },
    artistToAdapter: (artist: Artist | ArtistListEntry): AdapterAlbumArtist => {
        const item: AdapterAlbumArtist = {
            albumCount: null,
            biography: null,
            createdAt: null,
            duration: 0,
            external: {},
            genres: [],
            id: artist.id,
            name: artist.name,
            songCount: null,
            updatedAt: null,
            userFavorite: Boolean(artist.starred),
            userFavoriteDate: dayjs(artist.starred).toISOString() || null,
            userLastPlayedDate: null,
            userRating: artist.userRating ?? null,
            userRatingDate: null,
        };

        return item;
    },
    playlistToAdapter: (playlist: Playlist | PlaylistListEntry): AdapterPlaylist => {
        return {
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
        };
    },
    trackToAdapter: (track: Track): AdapterTrack => {
        const splitPath = track.path?.split('/');
        const fileName = splitPath[splitPath.length - 1];

        const item: AdapterTrack = {
            album: track.album,
            albumId: track.albumId,
            artistId: track.artistId || null,
            artistName: track.artist || '',
            artists: [
                ...(track.artistId
                    ? [{ id: track.artistId, imageUrl: null, name: track.artist || '' }]
                    : []),
            ],
            bitrate: track.bitRate ?? null,
            bpm: null,
            channels: track.channelCount ?? null,
            comment: null,
            container: track.suffix,
            createdAt: track.created,
            discNumber: track.discNumber ? String(track.discNumber) : '1',
            discSubtitle: null,
            duration: track.duration,
            external: {
                musicbrainz: {
                    id: null,
                    name: null,
                },
            },
            fileName,
            filePath: track.path,
            fileSize: track.size,
            genres: [...(track.genre ? [{ id: track.genre, name: track.genre }] : [])],
            id: track.id,
            isCompilation: false,
            lastPlayedAt: track.played || null,
            lyrics: null,
            name: track.title,
            playCount: track.playCount || 0,
            releaseDate: utils.date.format(String(track.year || 0), 'YYYY-MM-DD'),
            releaseYear: track.year || 0,
            replayGain: {
                albumGain: null,
                albumPeak: null,
                trackGain: null,
                trackPeak: null,
            },
            samplerate: track.samplingRate ?? null,
            trackNumber: track.track || 1,
            updatedAt: track.created,
            userFavorite: Boolean(track.starred),
            userRating: track.userRating ?? null,
        };

        return item;
    },
};

export const subsonicHelpers = {
    converter,
};
