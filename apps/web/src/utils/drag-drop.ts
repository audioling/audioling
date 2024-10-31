import { LibraryItemType } from '@repo/shared-types';

export enum DragTarget {
    ALBUM = LibraryItemType.ALBUM,
    PLAYLIST = LibraryItemType.PLAYLIST,
    TRACK = LibraryItemType.TRACK,
    ARTIST = LibraryItemType.ARTIST,
    GENRE = LibraryItemType.GENRE,
    ALBUM_ARTIST = LibraryItemType.ALBUM_ARTIST,
    TABLE_COLUMN = 'tableColumn',
}

export type AlbumDragMetadata = {
    image: string;
    title: string;
};

export type DragData<T extends Record<string, unknown> = Record<string, unknown>> = {
    id: string;
    metadata?: T;
    type: DragTarget;
};

export const dndUtils = {
    generateDragData: <T extends Record<string, unknown> = Record<string, unknown>>(
        id: string,
        type: DragTarget,
        metadata?: T,
    ) => {
        return {
            id,
            metadata,
            type,
        };
    },
    isDropTarget: (target: DragTarget, types: DragTarget[]) => {
        return types.includes(target);
    },
};
