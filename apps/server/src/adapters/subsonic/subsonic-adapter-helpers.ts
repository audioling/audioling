import type {
    ClientInferResponseBody,
    openSubsonicApiContract,
} from '@audioling/open-subsonic-api-client';
import dayjs from 'dayjs';
import type { AdapterAlbum } from '@/adapters/types/adapter-album-types.js';
import type { AdapterAlbumArtist } from '@/adapters/types/adapter-artist-types.js';
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

type ArtistListEntry = NonNullable<
    ClientInferResponseBody<
        (typeof openSubsonicApiContract)['getArtists']['get'],
        200
    >['artists']['index'][number]['artist'][number]
>;

const converter = {
    albumToAdapter: (album: Album) => {
        const releaseDate = dayjs()
            .year(Number(album.year || 0))
            .startOf('year')
            .toISOString();

        const item: AdapterAlbum = {
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
    },
    artistToAdapter: (artist: Artist | ArtistListEntry) => {
        const item: AdapterAlbumArtist = {
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
            id: artist.id,
            name: artist.name,
            songCount: null,
            updatedAt: null,
            userFavorite: Boolean(artist.starred),
            userRating: artist.userRating ?? null,
        };

        return item;
    },
    trackToAdapter: (track: Track) => {
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
