import {
    LibraryItemType,
    PlaylistFolderListSortOptions,
    TrackListSortOptions,
} from '@repo/shared-types';
import { ListSortOrder, PlaylistListSortOptions } from '@repo/shared-types';
import { type AdapterApi } from '@/adapters/types/index.js';
import { CONSTANTS } from '@/constants.js';
import type {
    CreatePlaylistRequest,
    UpdatePlaylistFolderRequest,
    UpdatePlaylistRequest,
} from '@/controllers/playlist/playlist-api-types.js';
import type { AppDatabase } from '@/database/init-database.js';
import type { DbUserPlaylistFolderInsert } from '@/database/user-database.js';
import { apiError } from '@/modules/error-handler/index.js';
import type { IdFactoryModule } from '@/modules/id/index.js';
import {
    type DeleteByIdServiceArgs,
    type FindByIdServiceArgs,
    type FindManyServiceArgs,
    type InsertServiceArgs,
    serviceHelpers,
    type UpdateByIdServiceArgs,
} from '@/services/service-helpers.js';
import type { initTrackService } from '@/services/track/track-service.js';

// SECTION - Playlist Service
export const initPlaylistService = (modules: { db: AppDatabase; idFactory: IdFactoryModule }) => {
    const { db, idFactory } = modules;

    return {
        // ANCHOR - Add
        add: async (adapter: AdapterApi, args: InsertServiceArgs<CreatePlaylistRequest>) => {
            const [err, result] = await adapter.createPlaylist({
                body: args.values,
                query: null,
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },

        // ANCHOR - Add Folder
        addFolder: async (args: { name: string; parentId: string | null; userId: string }) => {
            const folder: DbUserPlaylistFolderInsert = {
                id: idFactory.generate(),
                name: args.name,
                parentId: args.parentId,
                playlists: [],
            };

            const [err, result] = db.user.playlistFolder.insert(args.userId, folder);

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },

        // ANCHOR - Add Playlist to Folder
        addPlaylistToFolder: async (args: {
            folderId: string;
            playlistIds: string[];
            userId: string;
        }) => {
            const [err] = db.user.playlistFolder.insertPlaylists(
                args.userId,
                args.folderId,
                args.playlistIds,
            );

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return null;
        },

        // ANCHOR - Add Tracks to Playlist
        addTracks: async (
            adapter: AdapterApi,
            args: {
                playlistId: string;
                skipDuplicates?: boolean;
                trackIds: string[];
            },
        ) => {
            let trackIds = args.trackIds;

            if (args.skipDuplicates) {
                const [err, result] = await adapter.getPlaylistTrackList({
                    query: {
                        id: args.playlistId,
                        limit: 1000000,
                        offset: 0,
                        sortBy: TrackListSortOptions.NAME,
                        sortOrder: ListSortOrder.ASC,
                    },
                });

                if (err) {
                    throw new apiError.internalServer({ message: err.message });
                }

                const existingTrackIds = result.items.map((item) => item.id);
                trackIds = args.trackIds.filter((id) => !existingTrackIds.includes(id));
            }

            const [err] = await adapter.addToPlaylist({
                body: {
                    entry: trackIds.map((id) => ({ id, type: 'track' })),
                },
                query: { id: args.playlistId },
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return null;
        },

        // ANCHOR - Detail
        detail: async (adapter: AdapterApi, args: FindByIdServiceArgs & { userId: string }) => {
            const [err, result] = await adapter.getPlaylistDetail({ query: { id: args.id } });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            const [foldersErr, folders] = db.user.playlistFolder.findAll(args.userId);

            if (foldersErr) {
                throw new apiError.internalServer({ message: foldersErr.message });
            }

            const playlistFoldersMap = folders.reduce<Record<string, string>>((acc, folder) => {
                folder.playlists.forEach((playlistId) => {
                    acc[playlistId] = folder.id;
                });

                return acc;
            }, {});

            return {
                ...result,
                imageUrl: serviceHelpers.getImageUrl(
                    result.id,
                    adapter._getLibrary().id,
                    LibraryItemType.PLAYLIST,
                ),
                parentId: playlistFoldersMap[result.id] || null,
            };
        },

        // ANCHOR - Track List
        detailTrackList: async (
            adapter: AdapterApi,
            args: FindByIdServiceArgs & FindManyServiceArgs<TrackListSortOptions>,
        ) => {
            const [err, result] = await adapter.getPlaylistTrackList({
                query: {
                    id: args.id,
                    limit: args.limit ?? CONSTANTS.DEFAULT_PAGINATION_LIMIT,
                    offset: args.offset ?? 0,
                    sortBy: args.sortBy || TrackListSortOptions.NAME,
                    sortOrder: args.sortOrder || ListSortOrder.ASC,
                },
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return {
                ...result,
                items: result.items.map((item) => ({
                    ...item,
                    imageUrl: serviceHelpers.getImageUrls([
                        {
                            id: item.id,
                            libraryId: adapter._getLibrary().id,
                            type: LibraryItemType.TRACK,
                        },
                        {
                            id: item.albumId,
                            libraryId: adapter._getLibrary().id,
                            type: LibraryItemType.ALBUM,
                        },
                    ]),
                })),
            };
        },

        // ANCHOR - Folder List
        folderList: async (
            args: FindManyServiceArgs<PlaylistFolderListSortOptions> & {
                playlistFolderId?: string;
                userId: string;
            },
        ) => {
            const [err, result] = db.user.playlistFolder.findAll(args.userId, {
                limit: args.limit,
                offset: args.offset,
                orderBy: [[PlaylistFolderListSortOptions.NAME, ListSortOrder.ASC]],
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            if (args.playlistFolderId) {
                return result.filter((item) => item.parentId === args.playlistFolderId);
            }

            return result;
        },

        // ANCHOR - Invalidate counts
        invalidateCounts: async (adapter: AdapterApi) => {
            db.kv.deleteByIncludes(`${adapter._getLibrary().id}::playlist`);
            return null;
        },

        // ANCHOR - List
        list: async (
            adapter: AdapterApi,
            args: FindManyServiceArgs<PlaylistListSortOptions> & { userId: string },
        ) => {
            const limit = args.limit ?? CONSTANTS.DEFAULT_PAGINATION_LIMIT;
            const offset = args.offset ?? 0;

            const [err, result] = await adapter.getPlaylistList({
                query: {
                    limit,
                    offset,
                    sortBy: args.sortBy || PlaylistListSortOptions.NAME,
                    sortOrder: args.sortOrder || ListSortOrder.ASC,
                },
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            const [foldersErr, folders] = db.user.playlistFolder.findAll(args.userId);

            if (foldersErr) {
                throw new apiError.internalServer({ message: foldersErr.message });
            }

            const playlistFoldersMap = folders.reduce<Record<string, string>>((acc, folder) => {
                folder.playlists.forEach((playlistId) => {
                    acc[playlistId] = folder.id;
                });

                return acc;
            }, {});

            const items = result.items.map((item) => ({
                ...item,
                imageUrl: serviceHelpers.getImageUrl(
                    item.id,
                    adapter._getLibrary().id,
                    LibraryItemType.PLAYLIST,
                ),
                parentId: playlistFoldersMap[item.id] || null,
            }));

            return {
                ...result,
                items,
            };
        },

        // ANCHOR - List count
        listCount: async (
            adapter: AdapterApi,
            args: Omit<FindManyServiceArgs<PlaylistListSortOptions>, 'sortBy' | 'sortOrder'> & {
                userId: string;
            },
        ) => {
            const [err, result] = await adapter.getPlaylistListCount({
                query: {
                    searchTerm: args.searchTerm,
                    userId: args.userId,
                },
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return result;
        },

        // ANCHOR - Remove
        remove: async (adapter: AdapterApi, args: DeleteByIdServiceArgs) => {
            const [err] = await adapter.deletePlaylist({
                body: null,
                query: { id: args.id },
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return null;
        },

        // ANCHOR - Remove Folder
        removeFolder: async (args: { folderId: string; userId: string }) => {
            const [err] = db.user.playlistFolder.delete(args.userId, args.folderId);

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return null;
        },

        // ANCHOR - Remove Playlist from Folder
        removePlaylistsFromFolder: async (args: {
            folderId: string;
            playlistIds: string[];
            userId: string;
        }) => {
            const [err] = db.user.playlistFolder.deletePlaylists(
                args.userId,
                args.folderId,
                args.playlistIds,
            );

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return null;
        },

        // ANCHOR - Remove Tracks from Playlist
        removeTracks: async (
            adapter: AdapterApi,
            args: {
                playlistId: string;
                trackIds: string[];
            },
        ) => {
            const [err] = await adapter.removeFromPlaylist({
                body: {
                    entry: args.trackIds,
                },
                query: { id: args.playlistId },
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return null;
        },

        // ANCHOR - Update
        update: async (adapter: AdapterApi, args: UpdateByIdServiceArgs<UpdatePlaylistRequest>) => {
            const [err] = await adapter.updatePlaylist({
                body: {
                    comment: args.values.description ?? '',
                    name: args.values.name ?? '',
                    public: args.values.isPublic ?? false,
                },
                query: { id: args.id },
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return null;
        },

        // ANCHOR - Update Folder
        updateFolder: async (args: {
            folderId: string;
            userId: string;
            values: UpdatePlaylistFolderRequest;
        }) => {
            const [err] = db.user.playlistFolder.update(args.userId, args.folderId, args.values);

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return null;
        },
    };
};

export type TrackService = ReturnType<typeof initTrackService>;
