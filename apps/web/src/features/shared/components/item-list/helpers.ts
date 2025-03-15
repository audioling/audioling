import type { ItemListPaginationState } from '/@/features/shared/components/item-list/types';
import type { ServerItemType } from '@repo/shared-types/app-types';
import type { QueryClient, QueryKey } from '@tanstack/react-query';
import type { Dispatch, MouseEvent } from 'react';
import { nanoid } from 'nanoid';
import { useReducer, useRef } from 'react';

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

// export interface ItemListColumnDefinition {
//     cell: React.ComponentType<ItemListCellProps>;
//     header: React.ComponentType;
//     id: ItemListColumn;
//     size: number;
// }

// export type ItemListColumnDefinitions = ItemListColumnDefinition[];

// export const itemListColumnMap: Partial<Record<ItemListColumn, ItemListColumnDefinition>> = {
//     [ItemListColumn.ROW_INDEX]: rowIndexColumn,
//     [ItemListColumn.NAME]: nameColumn,
//     [ItemListColumn.STANDALONE_COMBINED]: standaloneCombinedColumn,
//     [ItemListColumn.ALBUM]: albumColumn,
//     [ItemListColumn.ALBUM_ARTISTS]: albumArtistsColumn,
//     [ItemListColumn.ARTISTS]: artistsColumn,
//     [ItemListColumn.DATE_ADDED]: dateAddedColumn,
//     [ItemListColumn.DURATION]: durationColumn,
//     [ItemListColumn.FAVORITE]: favoriteColumn,
//     [ItemListColumn.GENRE]: genreColumn,
//     [ItemListColumn.IMAGE]: imageColumn,
//     [ItemListColumn.LAST_PLAYED]: lastPlayedColumn,
//     [ItemListColumn.PLAY_COUNT]: playCountColumn,
//     [ItemListColumn.BPM]: bpmColumn,
//     [ItemListColumn.ALBUM_COUNT]: albumCountColumn,
//     [ItemListColumn.TRACK_COUNT]: trackCountColumn,
//     [ItemListColumn.TRACK_NUMBER]: trackNumberColumn,
//     [ItemListColumn.RATING]: ratingColumn,
//     [ItemListColumn.RELEASE_DATE]: releaseDateColumn,
//     [ItemListColumn.YEAR]: yearColumn,
//     [ItemListColumn.ACTIONS]: actionsColumn,
//     [ItemListColumn.ADD_TO_PLAYLIST]: addToPlaylistColumn,
//     [ItemListColumn.FILE_NAME]: fileNameColumn,
//     [ItemListColumn.FILE_PATH]: filePathColumn,
//     [ItemListColumn.FILE_SIZE]: fileSizeColumn,
//     [ItemListColumn.QUALITY]: qualityColumn,
//     [ItemListColumn.DISC_NUMBER]: discNumberColumn,
// };

export interface ItemListCellProps {
    context?: TableContext;
    handlers?: {
        onItemContextMenu?: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
    };
    index: number;
    isHovered?: boolean;
    item: unknown | undefined;
    itemType: ServerItemType;
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
        getColumns(columnOrder: ItemListColumnOrder) {
            const listColumns = [];

            for (const column of columnOrder) {
                // listColumns.push(itemListColumnMap[column]);
            }

            return listColumns;
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
    _itemExpandedReducer: Dispatch<SelectionStateAction>;
    _itemSelectionReducer: Dispatch<SelectionStateAction>;
    addSelection: (id: string) => void;
    clearAndSetGroupCollapsedById: (id: string) => void;
    clearAndSetSelectionById: (id: string) => void;
    clearGroupCollapsed: () => void;
    clearSelection: () => void;
    getGroupCollapsed: () => Record<string, boolean>;
    getGroupCollapsedById: (id: string) => boolean;
    getOrderedSelection: () => string[];
    getSelection: () => Record<string, boolean>;
    getSelectionById: (id: string) => boolean;
    removeSelectionById: (id: string) => void;
    setGroupCollapsed: (values: Record<string, boolean>) => void;
    setGroupCollapsedById: (id: string, expanded: boolean) => void;
    setSelection: (values: Record<string, boolean>) => void;
    setSelectionById: (id: string, selected: boolean) => void;
    toggleSelectionById: (id: string) => void;
}

export interface ItemListInternalState {
    _onMultiSelectionClick: (
        id: string,
        index: number,
        e: MouseEvent<HTMLDivElement | HTMLButtonElement>,
    ) => void;
    _onSingleSelectionClick: (id: string, index: number, e: MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
    groupCollapsed: Record<string, boolean>;
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
            return { ...state, [action.id]: !state[action.id] };
        }
    }
}

export function useItemListInternalState<TDataType, TItemType>(args: {
    data: (TDataType | undefined)[];
    getItemId?: (index: number, item: TItemType) => string;
}): ItemListInternalState {
    const { data, getItemId } = args;
    const [itemSelection, dispatchItemSelection] = useReducer(selectionStateReducer, {});
    const [itemExpanded, dispatchItemExpanded] = useReducer(selectionStateReducer, {});
    const [groupCollapsed, dispatchGroupCollapsed] = useReducer(selectionStateReducer, {});

    const lastSelectedIndex = useRef<number | null>(null);

    const _onMultiSelectionClick = (
        id: string,
        index: number,
        e: MouseEvent<HTMLDivElement | HTMLButtonElement>,
    ) => {
        // If SHIFT is pressed, toggle the range selection
        if (e.shiftKey) {
            const currentIndex = index;

            if (currentIndex === -1 || lastSelectedIndex.current === null)
                return;

            const itemsToToggle = itemListHelpers.table.getItemRange(
                data,
                currentIndex,
                lastSelectedIndex.current,
            );

            if (itemsToToggle.length > 0) {
                const shouldSelect = !itemSelection[id];
                const newSelections = { ...itemSelection };

                // Process each item in the range
                itemsToToggle.forEach((item, idx) => {
                    if (item !== undefined) {
                        const itemId = typeof item === 'string'
                            ? item
                            : getItemId?.(index + idx, item as TItemType) ?? '';

                        // Don't deselect the currently clicked item
                        if (itemId === id) {
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
                id,
                type: 'toggleById',
            });

            // If no modifier key is pressed, replace the selection with the new item or toggle if already selected
        }
        else {
            const isSelfSelected = itemSelection[id];

            if (isSelfSelected && Object.keys(itemSelection).length === 1) {
                dispatchItemSelection({
                    type: 'clear',
                });
            }
            else {
                dispatchItemSelection({
                    id,
                    type: 'clearAndSetById',
                });
            }
        }

        lastSelectedIndex.current = index;
    };

    const _onSingleSelectionClick = (id: string) => {
        const isSelfSelected = itemSelection[id];

        if (isSelfSelected && Object.keys(itemSelection).length === 1) {
            dispatchItemSelection({
                type: 'clear',
            });
        }
        else {
            dispatchItemSelection({
                id,
                type: 'clearAndSetById',
            });
        }
    };

    const reducers = {
        _itemExpandedReducer: dispatchItemExpanded,
        _itemSelectionReducer: dispatchItemSelection,
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
        getGroupCollapsed: () => {
            return groupCollapsed;
        },
        getGroupCollapsedById: (id: string) => {
            return groupCollapsed[id];
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
        setGroupCollapsed: (values: Record<string, boolean>) => {
            dispatchGroupCollapsed({ type: 'set', values });
        },
        setGroupCollapsedById: (id: string, expanded: boolean) => {
            dispatchGroupCollapsed({ id, type: 'setById', value: expanded });
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
        itemExpanded,
        itemSelection,
        reducers,
    };
}
