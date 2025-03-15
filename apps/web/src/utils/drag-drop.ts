import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { ServerItemType } from '@repo/shared-types/app-types';

export enum DragTarget {
    ALBUM = ServerItemType.ALBUM,
    PLAYLIST = ServerItemType.PLAYLIST,
    PLAYLIST_TRACK = ServerItemType.PLAYLIST_TRACK,
    TRACK = ServerItemType.TRACK,
    QUEUE_TRACK = ServerItemType.QUEUE_TRACK,
    ARTIST = ServerItemType.ARTIST,
    GENRE = ServerItemType.GENRE,
    ALBUM_ARTIST = ServerItemType.ALBUM_ARTIST,
    TABLE_COLUMN = 'tableColumn',
    QUERY_BUILDER_ROW = 'queryBuilderRow',
    QUERY_BUILDER_GROUP = 'queryBuilderGroup',
    UNKNOWN = 'unknown',
}

export const DragTargetMap = {
    [ServerItemType.ALBUM]: DragTarget.ALBUM,
    [ServerItemType.PLAYLIST]: DragTarget.PLAYLIST,
    [ServerItemType.TRACK]: DragTarget.TRACK,
    [ServerItemType.PLAYLIST_TRACK]: DragTarget.PLAYLIST_TRACK,
    [ServerItemType.ARTIST]: DragTarget.ARTIST,
    [ServerItemType.GENRE]: DragTarget.GENRE,
    [ServerItemType.ALBUM_ARTIST]: DragTarget.ALBUM_ARTIST,
    [ServerItemType.QUEUE_TRACK]: DragTarget.QUEUE_TRACK,
};

export enum DragOperation {
    ADD = 'add',
    REORDER = 'reorder',
}

export interface AlbumDragMetadata {
    image: string;
    title: string;
}

export interface DragData<
    TDataType = unknown,
    T extends Record<string, unknown> = Record<string, unknown>,
> {
    id: string[];
    item?: TDataType[];
    metadata?: T;
    operation?: DragOperation[];
    type: DragTarget;
}

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
        if (indexFrom === indexTo)
            return list;

        // If dragging to the right, but is left edge, do nothing
        if (edge === 'left' && indexTo > indexFrom)
            return list;

        // If dragging to the left, but is right edge, do nothing
        if (edge === 'right' && indexTo < indexFrom)
            return list;

        return dndUtils.reorderByIndex({ index: indexFrom, list, newIndex: indexTo });
    },
    reorderByIndex: (args: { index: number; list: string[]; newIndex: number }) => {
        const { index, list, newIndex } = args;
        const newList = [...list];
        newList.splice(newIndex, 0, newList.splice(index, 1)[0]);
        return newList;
    },
};
