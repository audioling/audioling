import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
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

export enum DragOperation {
    ADD = 'add',
    REORDER = 'reorder',
}

export const libraryItemTypeToDragTarget = {
    [LibraryItemType.ALBUM]: DragTarget.ALBUM,
    [LibraryItemType.PLAYLIST]: DragTarget.PLAYLIST,
    [LibraryItemType.TRACK]: DragTarget.TRACK,
    [LibraryItemType.ARTIST]: DragTarget.ARTIST,
    [LibraryItemType.GENRE]: DragTarget.GENRE,
    [LibraryItemType.ALBUM_ARTIST]: DragTarget.ALBUM_ARTIST,
};

export type AlbumDragMetadata = {
    image: string;
    title: string;
};

export type DragData<T extends Record<string, unknown> = Record<string, unknown>> = {
    id: string;
    metadata?: T;
    operation?: DragOperation;
    type: DragTarget;
};

export const dndUtils = {
    generateDragData: <T extends Record<string, unknown> = Record<string, unknown>>(
        args: {
            id: string | string[];
            operation?: DragOperation[];
            type: DragTarget;
        },
        metadata?: T,
    ) => {
        return {
            id: args.id,
            metadata,
            operation: args.operation,
            type: args.type,
        };
    },
    isDropTarget: (target: DragTarget, types: DragTarget[]) => {
        return types.includes(target);
    },
    reorderById: (args: { edge: Edge | null; idFrom: string; idTo: string; list: string[] }) => {
        const { edge, idFrom, idTo, list } = args;
        const indexFrom = list.indexOf(idFrom);
        const indexTo = list.indexOf(idTo);

        // If dragging to the same position, do nothing
        if (indexFrom === indexTo) return list;

        // If dragging to the right, but is left edge, do nothing
        if (edge === 'left' && indexTo > indexFrom) return list;

        // If dragging to the left, but is right edge, do nothing
        if (edge === 'right' && indexTo < indexFrom) return list;

        return dndUtils.reorderByIndex({ index: indexFrom, list, newIndex: indexTo });
    },
    reorderByIndex: (args: { index: number; list: string[]; newIndex: number }) => {
        const { list, index, newIndex } = args;
        const newList = [...list];
        newList.splice(newIndex, 0, newList.splice(index, 1)[0]);
        return newList;
    },
};
