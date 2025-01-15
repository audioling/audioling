import { LibraryItemType } from '@repo/shared-types';
import jsonata from 'jsonata';
import type { AdapterTrack } from '@/adapters/types/adapter-track-types.js';
import { controllerHelpers } from '@/controllers/controller-helpers.js';
import type { TrackEntry, TrackQuery } from '@/controllers/track/track-api-types.js';
import { buildQuery } from '@/modules/query/index.js';

export const trackHelpers = {
    adapterToResponse: (track: AdapterTrack, libraryId: string, token: string): TrackEntry => {
        return {
            ...track,
            imageUrl: track.imageUrl.map((url) => controllerHelpers.getImageUrl(url, token)),
            itemType: LibraryItemType.TRACK,
            libraryId,
            streamUrl: controllerHelpers.getStreamUrl(libraryId, track.id, token),
        };
    },
    query: async (data: AdapterTrack[], query: TrackQuery): Promise<AdapterTrack[]> => {
        if ('rules' in query) {
            const jsonataQuery = buildQuery(query.rules, trackQueryFields);
            const expression = jsonata(jsonataQuery);
            const result = (await expression.evaluate(data)) as AdapterTrack[];

            if (!result) {
                return [];
            }

            if (Array.isArray(result)) {
                return result;
            } else {
                return [result];
            }
        }

        return [];
    },
};

export const trackQueryFields: Record<string, { type: string; value: string }> = {
    album: { type: 'text', value: 'album' },
    'albumArtists.id': { type: 'text', value: 'albumArtists.id' },
    'albumArtists.name': { type: 'text', value: 'albumArtists.name' },
    albumId: { type: 'text', value: 'albumId' },
    'artists.id': { type: 'text', value: 'artists.id' },
    'artists.name': { type: 'text', value: 'artists.name' },
    bitDepth: { type: 'number', value: 'bitDepth' },
    bitRate: { type: 'number', value: 'bitRate' },
    bpm: { type: 'number', value: 'bpm' },
    channelCount: { type: 'number', value: 'channelCount' },
    comment: { type: 'text', value: 'comment' },
    createdDate: { type: 'date', value: 'createdDate' },
    discNumber: { type: 'number', value: 'discNumber' },
    discSubtitle: { type: 'text', value: 'discSubtitle' },
    duration: { type: 'number', value: 'duration' },
    fileContainer: { type: 'text', value: 'fileContainer' },
    filePath: { type: 'text', value: 'filePath' },
    fileSize: { type: 'number', value: 'fileSize' },
    'genres.id': { type: 'text', value: 'genres.id' },
    'genres.name': { type: 'text', value: 'genres.name' },
    isCompilation: { type: 'boolean', value: 'isCompilation' },
    moods: { type: 'text', value: 'moods' },
    name: { type: 'text', value: 'name' },
    releaseYear: { type: 'number', value: 'releaseYear' },
    sortName: { type: 'text', value: 'sortName' },
    trackNumber: { type: 'number', value: 'trackNumber' },
    updatedDate: { type: 'date', value: 'updatedDate' },
    userFavorite: { type: 'boolean', value: 'userFavorite' },
    userFavoriteDate: { type: 'date', value: 'userFavoriteDate' },
    userLastPlayedDate: { type: 'date', value: 'userLastPlayedDate' },
    userPlayCount: { type: 'number', value: 'userPlayCount' },
    userRating: { type: 'number', value: 'userRating' },
};
