// import type { TableContext } from '/@/features/shared/components/item-list/table-view/item-list-table';
import type { ItemListPaginationState } from '/@/features/shared/components/item-list/types';
import type { ServerItemType } from '@repo/shared-types/app-types';
import type { QueryClient, QueryKey } from '@tanstack/react-query';
import type { Dispatch, MouseEvent } from 'react';
import type { VirtuosoHandle } from 'react-virtuoso';
import { nanoid } from 'nanoid';
import { useReducer, useRef, useState } from 'react';
import { actionsColumn } from '/@/features/shared/components/item-list/table-view/columns/actions-column';
import { addToPlaylistColumn } from '/@/features/shared/components/item-list/table-view/columns/add-to-playlist-column';
import { albumArtistsColumn } from '/@/features/shared/components/item-list/table-view/columns/album-artists.column';
import { albumColumn } from '/@/features/shared/components/item-list/table-view/columns/album-column';
import { albumCountColumn } from '/@/features/shared/components/item-list/table-view/columns/album-count-column';
import { artistsColumn } from '/@/features/shared/components/item-list/table-view/columns/artists-column';
import { bpmColumn } from '/@/features/shared/components/item-list/table-view/columns/bpm-column';
import { dateAddedColumn } from '/@/features/shared/components/item-list/table-view/columns/date-added-column';
import { discNumberColumn } from '/@/features/shared/components/item-list/table-view/columns/disc-number-column';
import { durationColumn } from '/@/features/shared/components/item-list/table-view/columns/duration-column';
import { favoriteColumn } from '/@/features/shared/components/item-list/table-view/columns/favorite-column';
import { fileNameColumn } from '/@/features/shared/components/item-list/table-view/columns/file-name-column';
import { filePathColumn } from '/@/features/shared/components/item-list/table-view/columns/file-path-column';
import { fileSizeColumn } from '/@/features/shared/components/item-list/table-view/columns/file-size-column';
import { genreColumn } from '/@/features/shared/components/item-list/table-view/columns/genre-column';
import { imageColumn } from '/@/features/shared/components/item-list/table-view/columns/image-column';
import { lastPlayedColumn } from '/@/features/shared/components/item-list/table-view/columns/last-played-column';
import { nameColumn } from '/@/features/shared/components/item-list/table-view/columns/name-column';
import { playCountColumn } from '/@/features/shared/components/item-list/table-view/columns/play-count-column';
import { qualityColumn } from '/@/features/shared/components/item-list/table-view/columns/quality-column';
import { ratingColumn } from '/@/features/shared/components/item-list/table-view/columns/rating-column';
import { releaseDateColumn } from '/@/features/shared/components/item-list/table-view/columns/release-date-column';
import { rowIndexColumn } from '/@/features/shared/components/item-list/table-view/columns/row-index-column';
import {
    standaloneCombinedColumn,
} from '/@/features/shared/components/item-list/table-view/columns/standalone-combined-column';
import { trackCountColumn } from '/@/features/shared/components/item-list/table-view/columns/track-count-column';
import { trackNumberColumn } from '/@/features/shared/components/item-list/table-view/columns/track-number-column';
import { yearColumn } from '/@/features/shared/components/item-list/table-view/columns/year-column';

export enum ItemListColumn {
    ACTIONS = 'actions',
    ADD_TO_PLAYLIST = 'addToPlaylist',
    ALBUM = 'album',
    ALBUM_ARTISTS = 'albumArtists',
    ALBUM_COUNT = 'albumCount',
    ARTISTS = 'artists',
    BPM = 'bpm',
    DATE_ADDED = 'dateAdded',
    DISC_NUMBER = 'discNumber',
    DURATION = 'duration',
    FAVORITE = 'favorite',
    FILE_NAME = 'fileName',
    FILE_PATH = 'filePath',
    FILE_SIZE = 'fileSize',
    GENRE = 'genre',
    IMAGE = 'image',
    LAST_PLAYED = 'lastPlayed',
    NAME = 'name',
    PLAY_COUNT = 'playCount',
    QUALITY = 'quality',
    RATING = 'rating',
    RELEASE_DATE = 'releaseDate',
    ROW_INDEX = 'rowIndex',
    STANDALONE_COMBINED = 'combined',
    TRACK_COUNT = 'trackCount',
    TRACK_NUMBER = 'trackNumber',
    YEAR = 'year',
}

export interface ItemListColumnDefinition {
    cell: React.ComponentType<ItemListCellProps>;
    header: React.ComponentType;
    id: ItemListColumn;
    size: number;
}

export type ItemListColumnDefinitions = ItemListColumnDefinition[];

export const itemListColumnMap: Partial<Record<ItemListColumn, ItemListColumnDefinition>> = {
    [ItemListColumn.ROW_INDEX]: rowIndexColumn,
    [ItemListColumn.NAME]: nameColumn,
    [ItemListColumn.STANDALONE_COMBINED]: standaloneCombinedColumn,
    [ItemListColumn.ALBUM]: albumColumn,
    [ItemListColumn.ALBUM_ARTISTS]: albumArtistsColumn,
    [ItemListColumn.ARTISTS]: artistsColumn,
    [ItemListColumn.DATE_ADDED]: dateAddedColumn,
    [ItemListColumn.DURATION]: durationColumn,
    [ItemListColumn.FAVORITE]: favoriteColumn,
    [ItemListColumn.GENRE]: genreColumn,
    [ItemListColumn.IMAGE]: imageColumn,
    [ItemListColumn.LAST_PLAYED]: lastPlayedColumn,
    [ItemListColumn.PLAY_COUNT]: playCountColumn,
    [ItemListColumn.BPM]: bpmColumn,
    [ItemListColumn.ALBUM_COUNT]: albumCountColumn,
    [ItemListColumn.TRACK_COUNT]: trackCountColumn,
    [ItemListColumn.TRACK_NUMBER]: trackNumberColumn,
    [ItemListColumn.RATING]: ratingColumn,
    [ItemListColumn.RELEASE_DATE]: releaseDateColumn,
    [ItemListColumn.YEAR]: yearColumn,
    [ItemListColumn.ACTIONS]: actionsColumn,
    [ItemListColumn.ADD_TO_PLAYLIST]: addToPlaylistColumn,
    [ItemListColumn.FILE_NAME]: fileNameColumn,
    [ItemListColumn.FILE_PATH]: filePathColumn,
    [ItemListColumn.FILE_SIZE]: fileSizeColumn,
    [ItemListColumn.QUALITY]: qualityColumn,
    [ItemListColumn.DISC_NUMBER]: discNumberColumn,
};

export interface ItemListCellProps {
    id: string | undefined;
    index: number;
    isHovered?: boolean;
    isSelected?: boolean;
    item: unknown | undefined;
    itemType: ServerItemType;
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
    onContextMenu?: (e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
    reducers?: ItemListInternalReducers;
    startIndex?: number;
}

export type ItemListColumnOrder = (typeof ItemListColumn)[keyof typeof ItemListColumn][];

export interface InfiniteItemListProps<T> {
    itemCount: number;
    libraryId: string;
    listKey: string;
    pagination: ItemListPaginationState;
    params: T;
}

export interface PaginatedItemListProps<T> extends InfiniteItemListProps<T> {
    setPagination: (pagination: ItemListPaginationState) => void;
}

export function numberToColumnSize(size: number, unit: 'px' | 'fr') {
    if (unit === 'px')
        return size;
    return size + 100000;
}

export const itemListHelpers = {
    generateListId(libraryId: string, pathname: string) {
        return `${libraryId}-${pathname}-${nanoid()}`;
    },
    getDataQueryKey(libraryId: string, type: ServerItemType, offline?: boolean) {
        return offline ? [libraryId, 'data', type, 'offline'] : [libraryId, 'data', type];
    },
    getInitialData(itemCount: number) {
        return Array.from({ length: itemCount }, () => undefined);
    },
    getItemRange<T>(
        items: (T | undefined)[],
        currentIndex: number,
        selectedIndex: number,
    ): (T | undefined)[] {
        const rangeStart = selectedIndex > currentIndex ? currentIndex : selectedIndex;
        const rangeEnd = rangeStart === currentIndex ? selectedIndex : currentIndex;
        return items.slice(rangeStart, rangeEnd + 1);
    },
    getListQueryKey(libraryId: string, listKey: string, type: ServerItemType) {
        return [libraryId, 'list', type, listKey];
    },
    getPageMap(itemCount: number, pageSize: number) {
        const pageCount = Math.ceil(itemCount / pageSize);

        const pageMap: Record<number, boolean> = {};

        for (let i = 0; i < pageCount; i++) {
            pageMap[i] = false;
        }

        return pageMap;
    },
    getPagesToLoad(args: {
        endIndex: number;
        loadedPages: Record<number, boolean>;
        pageSize: number;
        startIndex: number;
    }): number[] {
        const { endIndex, loadedPages, pageSize, startIndex } = args;

        // Calculate the start and end pages for the visible range
        const startPage = Math.floor(startIndex / pageSize);
        const endPage = Math.floor(endIndex / pageSize);

        const pagesToLoad: number[] = [];

        // Check each page in the range
        for (let page = startPage; page <= endPage; page++) {
            // If the page hasn't been loaded yet, add it to the list
            if (!loadedPages[page]) {
                pagesToLoad.push(page);
            }
        }

        return pagesToLoad;
    },
    table: {
        columnSizeToStyle(columnSize: number) {
            if (columnSize > 100000)
                return `minmax(0px, ${columnSize - 100000}fr)`;
            return `${columnSize}px`;
        },
        getColumns(columnOrder: ItemListColumnOrder): ItemListColumnDefinitions {
            const listColumns = [];

            for (const column of columnOrder) {
                if (itemListColumnMap[column]) {
                    listColumns.push(itemListColumnMap[column]);
                }
            }

            return listColumns;
        },
        numberToColumnSize(size: number, unit: 'px' | 'fr') {
            if (unit === 'px')
                return size;
            return size + 100000;
        },
    },
    updateFavorite<T>(
        queryClient: QueryClient,
        queryKey: QueryKey,
        ids: string[],
        favorite: boolean,
    ) {
        queryClient.setQueryData<Record<string, T>>(queryKey, (prev) => {
            const updates: Record<string, T> = {};
            for (const id of ids) {
                if (!prev?.[id])
                    continue;
                updates[id] = { ...prev[id], userFavorite: favorite };
            }
            return { ...prev, ...updates };
        });
    },
};

export interface ItemListInternalReducers {
    _itemExpanded: Dispatch<SelectionStateAction>;
    _itemSelection: Dispatch<SelectionStateAction>;
    addSelection: (id: string) => void;
    clearAndSetGroupCollapsedById: (id: string) => void;
    clearAndSetSelectionById: (id: string) => void;
    clearGroupCollapsed: () => void;
    clearSelection: () => void;
    getExpanded: () => Record<string, boolean>;
    getExpandedById: (id: string) => boolean;
    getGroupCollapsed: () => Record<string, boolean>;
    getGroupCollapsedById: (id: string) => boolean;
    getIsDragging: () => boolean;
    getListSelection: (id: string) => string[];
    getOrderedSelection: () => string[];
    getSelection: () => Record<string, boolean>;
    getSelectionById: (id: string) => boolean;
    removeSelectionById: (id: string) => void;
    scrollTo: (location: {
        behavior?: 'auto' | 'smooth' | 'instant';
        left?: number;
        top?: number;
    }) => void;
    scrollToIndex: (location: {
        align?: 'start' | 'center' | 'end';
        behavior: 'auto' | 'smooth';
        index: number;
        offset?: number;
    }) => void;
    setGroupCollapsed: (values: Record<string, boolean>) => void;
    setGroupCollapsedById: (id: string, expanded: boolean) => void;
    setIsDragging: (isDragging: boolean) => void;
    setSelection: (values: Record<string, boolean>) => void;
    setSelectionById: (id: string, selected: boolean) => void;
    toggleSelectionById: (id: string) => void;
}

export interface ItemListInternalState {
    _onMultiSelectionClick: (
        item: { id: string; serverId: string },
        index: number,
        e: MouseEvent<HTMLDivElement | HTMLButtonElement>,
    ) => void;
    _onSingleSelectionClick: (
        item: { id: string; serverId: string },
        index: number,
        e: MouseEvent<HTMLDivElement | HTMLButtonElement>,
    ) => void;
    groupCollapsed: Record<string, boolean>;
    isDragging: boolean;
    itemExpanded: Record<string, boolean>;
    itemSelection: Record<string, boolean>;
    reducers: ItemListInternalReducers;
}

type SelectionStateAction =
    | {
        id: string;
        type: 'addById';
    }
    | {
        type: 'clear';
    }
    | {
        id: string;
        type: 'clearAndSetById';
    }
    | {
        id: string;
        type: 'removeById';
    }
    | {
        type: 'set';
        values: Record<string, boolean>;
    }
    | {
        id: string;
        type: 'setById';
        value: boolean;
    }
    | {
        behavior?: 'single' | 'multiple';
        id: string;
        type: 'toggleById';
    };

function selectionStateReducer(
    state: Record<string, boolean>,
    action: SelectionStateAction,
): Record<string, boolean> {
    switch (action.type) {
        case 'addById': {
            return { ...state, [action.id]: true };
        }

        case 'clear': {
            return {};
        }

        case 'clearAndSetById': {
            return { [action.id]: true };
        }

        case 'set': {
            return { ...state, ...action.values };
        }

        case 'setById': {
            return { ...state, [action.id]: action.value };
        }

        case 'removeById': {
            const newState = { ...state };
            delete newState[action.id];
            return newState;
        }

        case 'toggleById': {
            if (action.behavior === 'single') {
                return { [action.id]: !state[action.id] };
            }

            return { ...state, [action.id]: !state[action.id] };
        }
    }
}

export function useItemListInternalState<TDataType, TItemType>(args: {
    data: (TDataType | undefined)[];
    getItemId?: (index: number, item: TItemType) => string;
    ref?: VirtuosoHandle;
}): ItemListInternalState {
    const { data, getItemId, ref } = args;
    const [itemSelection, dispatchItemSelection] = useReducer(selectionStateReducer, {});
    const [itemExpanded, dispatchItemExpanded] = useReducer(selectionStateReducer, {});
    const [groupCollapsed, dispatchGroupCollapsed] = useReducer(selectionStateReducer, {});
    const [isDragging, setIsDragging] = useState(false);

    const lastSelectedIndex = useRef<number | null>(null);

    const _onMultiSelectionClick = (
        item: { id: string; serverId: string },
        index: number,
        e: MouseEvent<HTMLDivElement | HTMLButtonElement>,
    ) => {
        e.stopPropagation();

        // If SHIFT is pressed, toggle the range selection
        if (e.shiftKey) {
            const currentIndex = index;

            if (currentIndex === -1 || lastSelectedIndex.current === null)
                return;

            const itemsToToggle = itemListHelpers.getItemRange(
                data,
                currentIndex,
                lastSelectedIndex.current,
            );

            if (itemsToToggle.length > 0) {
                const shouldSelect = !itemSelection[item.id];
                const newSelections = { ...itemSelection };

                // Process each item in the range
                itemsToToggle.forEach((i, idx) => {
                    if (i !== undefined) {
                        const itemId = typeof i === 'string'
                            ? i
                            : getItemId?.(index + idx, i as TItemType) ?? '';

                        // Don't deselect the currently clicked item
                        if (itemId === item.id) {
                            newSelections[itemId] = true;
                        }
                        else {
                            newSelections[itemId] = shouldSelect;
                        }
                    }
                });

                dispatchItemSelection({
                    type: 'set',
                    values: newSelections,
                });
            }
        }
        else if (e.ctrlKey) {
            dispatchItemSelection({
                id: item.id,
                type: 'toggleById',
            });

            // If no modifier key is pressed, replace the selection with the new item or toggle if already selected
        }
        else {
            const isSelfSelected = itemSelection[item.id];

            if (isSelfSelected && Object.keys(itemSelection).length === 1) {
                dispatchItemSelection({
                    type: 'clear',
                });
            }
            else {
                dispatchItemSelection({
                    id: item.id,
                    type: 'clearAndSetById',
                });
            }
        }

        lastSelectedIndex.current = index;
    };

    const _onSingleSelectionClick = (
        item: { id: string; serverId: string },
        _index: number,
        e: MouseEvent<HTMLDivElement | HTMLButtonElement>,
    ) => {
        e.stopPropagation();

        const isSelfSelected = itemSelection[item.id];

        if (isSelfSelected && Object.keys(itemSelection).length === 1) {
            dispatchItemSelection({
                type: 'clear',
            });
        }
        else {
            dispatchItemSelection({
                id: item.id,
                type: 'clearAndSetById',
            });
        }
    };

    const reducers = {
        _itemExpanded: dispatchItemExpanded,
        _itemSelection: dispatchItemSelection,
        addSelection: (id: string) => {
            dispatchItemSelection({ id, type: 'addById' });
        },
        clearAndSetGroupCollapsedById: (id: string) => {
            dispatchGroupCollapsed({ id, type: 'clearAndSetById' });
        },
        clearAndSetSelectionById: (id: string) => {
            dispatchItemSelection({ id, type: 'clearAndSetById' });
        },
        clearGroupCollapsed: () => {
            dispatchGroupCollapsed({ type: 'clear' });
        },
        clearSelection: () => {
            dispatchItemSelection({ type: 'clear' });
        },
        getExpanded: () => {
            return itemExpanded;
        },
        getExpandedById: (id: string) => {
            return itemExpanded[id];
        },
        getGroupCollapsed: () => {
            return groupCollapsed;
        },
        getGroupCollapsedById: (id: string) => {
            return groupCollapsed[id];
        },
        getIsDragging: () => {
            return isDragging;
        },
        getListSelection: (id: string) => {
            const isSelfSelected = itemSelection[id];

            let ids: string[] = [];

            if (!isSelfSelected) {
                dispatchItemSelection({ id, type: 'clearAndSetById' });
                ids.push(id);
            }
            else {
                const results = (data as (string | undefined)[]).filter((id) => {
                    if (id === undefined && typeof id !== 'string')
                        return false;
                    return itemSelection[id as string] as boolean;
                }) as string[];

                ids = results ?? [];
            }

            return ids;
        },
        getOrderedSelection: () => {
            if (getItemId) {
                const results = data
                    .filter(item => item !== undefined)
                    .map((item, index) => getItemId(index, item as TItemType))
                    .filter((id) => {
                        if (id === undefined && typeof id !== 'string')
                            return false;
                        return itemSelection[id as string] as boolean;
                    });

                return results;
            }

            const results = (data as (string | undefined)[]).filter((id) => {
                if (id === undefined && typeof id !== 'string')
                    return false;
                return itemSelection[id as string] as boolean;
            }) as string[];

            return results;
        },
        getSelection: () => {
            return itemSelection;
        },
        getSelectionById: (id: string) => {
            return itemSelection[id];
        },
        removeSelectionById: (id: string) => {
            dispatchItemSelection({ id, type: 'removeById' });
        },
        scrollTo: (location: {
            behavior?: 'auto' | 'smooth' | 'instant';
            left?: number;
            top?: number;
        }) => {
            ref?.scrollTo({
                behavior: location.behavior,
                left: location.left,
                top: location.top,
            });
        },
        scrollToIndex: (location: {
            align?: 'start' | 'center' | 'end' ;
            behavior: 'auto' | 'smooth';
            index: number;
            offset?: number;
        }) => {
            ref?.scrollToIndex({
                align: location.align,
                behavior: location.behavior,
                index: location.index,
                offset: location.offset,
            });
        },
        setGroupCollapsed: (values: Record<string, boolean>) => {
            dispatchGroupCollapsed({ type: 'set', values });
        },
        setGroupCollapsedById: (id: string, expanded: boolean) => {
            dispatchGroupCollapsed({ id, type: 'setById', value: expanded });
        },
        setIsDragging: (isDragging: boolean) => {
            setIsDragging(isDragging);
        },
        setSelection: (values: Record<string, boolean>) => {
            dispatchItemSelection({ type: 'set', values });
        },
        setSelectionById: (id: string, selected: boolean) => {
            dispatchItemSelection({ id, type: 'setById', value: selected });
        },
        toggleSelectionById: (id: string) => {
            dispatchItemSelection({ id, type: 'toggleById' });
        },
    };

    return {
        _onMultiSelectionClick,
        _onSingleSelectionClick,
        groupCollapsed,
        isDragging,
        itemExpanded,
        itemSelection,
        reducers,
    };
}

export const listHelpers = {
    getOrderedSelection: (data: (string | undefined)[], itemSelection: Record<string, boolean>) => {
        const results = data.filter((id) => {
            if (id === undefined && typeof id !== 'string')
                return false;
            return itemSelection[id as string] as boolean;
        }) as string[];

        return results;
    },
};
