import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { LibraryItemType } from '@repo/shared-types';

export enum DragTarget {
    ALBUM = LibraryItemType.ALBUM,
    PLAYLIST = LibraryItemType.PLAYLIST,
    PLAYLIST_TRACK = LibraryItemType.PLAYLIST_TRACK,
    TRACK = LibraryItemType.TRACK,
    ARTIST = LibraryItemType.ARTIST,
    GENRE = LibraryItemType.GENRE,
    ALBUM_ARTIST = LibraryItemType.ALBUM_ARTIST,
    TABLE_COLUMN = 'tableColumn',
    QUERY_BUILDER_ROW = 'queryBuilderRow',
    QUERY_BUILDER_GROUP = 'queryBuilderGroup',
    UNKNOWN = 'unknown',
}

export const DragTargetMap = {
    [LibraryItemType.ALBUM]: DragTarget.ALBUM,
    [LibraryItemType.PLAYLIST]: DragTarget.PLAYLIST,
    [LibraryItemType.TRACK]: DragTarget.TRACK,
    [LibraryItemType.PLAYLIST_TRACK]: DragTarget.PLAYLIST_TRACK,
    [LibraryItemType.ARTIST]: DragTarget.ARTIST,
    [LibraryItemType.GENRE]: DragTarget.GENRE,
    [LibraryItemType.ALBUM_ARTIST]: DragTarget.ALBUM_ARTIST,
};

export enum DragOperation {
    ADD = 'add',
    REORDER = 'reorder',
}

export type AlbumDragMetadata = {
    image: string;
    title: string;
};

export type DragData<
    TDataType = unknown,
    T extends Record<string, unknown> = Record<string, unknown>,
> = {
    id: string[];
    item?: TDataType[];
    metadata?: T;
    operation?: DragOperation[];
    type: DragTarget;
};

export const dndUtils = {
    dropType: (args: { data: DragData }) => {
        const { data } = args;
        return data.type;
    },
    generateDragData: <TDataType, T extends Record<string, unknown> = Record<string, unknown>>(
        args: {
            id: string[];
            item?: TDataType[];
            operation?: DragOperation[];
            type: DragTarget;
        },
        metadata?: T,
    ) => {
        return {
            id: args.id,
            item: args.item,
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
