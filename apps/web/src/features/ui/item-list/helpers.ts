import { type MutableRefObject } from 'react';
import type { LibraryItemType } from '@repo/shared-types';
import { type QueryClient, type QueryKey } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { actionsColumn } from '@/features/ui/item-list/item-table/columns/actions-column.tsx';
import { addToPlaylistColumn } from '@/features/ui/item-list/item-table/columns/add-to-playlist-column.tsx';
import { albumArtistsColumn } from '@/features/ui/item-list/item-table/columns/album-artists.column.tsx';
import { albumColumn } from '@/features/ui/item-list/item-table/columns/album-column.tsx';
import { albumCountColumn } from '@/features/ui/item-list/item-table/columns/album-count-column.tsx';
import { artistsColumn } from '@/features/ui/item-list/item-table/columns/artists-column.tsx';
import { dateAddedColumn } from '@/features/ui/item-list/item-table/columns/date-added-column.tsx';
import { durationColumn } from '@/features/ui/item-list/item-table/columns/duration-column.tsx';
import { favoriteColumn } from '@/features/ui/item-list/item-table/columns/favorite-column.tsx';
import { genreColumn } from '@/features/ui/item-list/item-table/columns/genre-column.tsx';
import { imageColumn } from '@/features/ui/item-list/item-table/columns/image-column.tsx';
import { lastPlayedColumn } from '@/features/ui/item-list/item-table/columns/last-played-column.tsx';
import { nameColumn } from '@/features/ui/item-list/item-table/columns/name-column.tsx';
import { playCountColumn } from '@/features/ui/item-list/item-table/columns/play-count-column.tsx';
import { ratingColumn } from '@/features/ui/item-list/item-table/columns/rating-column.tsx';
import { releaseDateColumn } from '@/features/ui/item-list/item-table/columns/release-date-column.tsx';
import { rowIndexColumn } from '@/features/ui/item-list/item-table/columns/row-index-column.tsx';
import { standaloneCombinedColumn } from '@/features/ui/item-list/item-table/columns/standalone-combined-column.tsx';
import { trackCountColumn } from '@/features/ui/item-list/item-table/columns/track-count-column.tsx';
import { trackNumberColumn } from '@/features/ui/item-list/item-table/columns/track-number-column.tsx';
import { yearColumn } from '@/features/ui/item-list/item-table/columns/year-column.tsx';
import type { TableContext } from '@/features/ui/item-list/item-table/item-table.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';

export enum ItemListColumn {
    ACTIONS = 'actions',
    ADD_TO_PLAYLIST = 'addToPlaylist',
    ALBUM = 'album',
    ALBUM_ARTISTS = 'albumArtists',
    ALBUM_COUNT = 'albumCount',
    ARTISTS = 'artists',
    DATE_ADDED = 'dateAdded',
    DURATION = 'duration',
    FAVORITE = 'favorite',
    GENRE = 'genre',
    IMAGE = 'image',
    LAST_PLAYED = 'lastPlayed',
    NAME = 'name',
    PLAY_COUNT = 'playCount',
    RATING = 'rating',
    RELEASE_DATE = 'releaseDate',
    ROW_INDEX = 'rowIndex',
    STANDALONE_COMBINED = 'combined',
    TRACK_COUNT = 'trackCount',
    TRACK_NUMBER = 'trackNumber',
    YEAR = 'year',
}

export type ItemListColumnDefinition = {
    cell: React.ComponentType<ItemListCellProps>;
    header: React.ComponentType;
    id: ItemListColumn;
    size: number;
};

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
    [ItemListColumn.ALBUM_COUNT]: albumCountColumn,
    [ItemListColumn.TRACK_COUNT]: trackCountColumn,
    [ItemListColumn.TRACK_NUMBER]: trackNumberColumn,
    [ItemListColumn.RATING]: ratingColumn,
    [ItemListColumn.RELEASE_DATE]: releaseDateColumn,
    [ItemListColumn.YEAR]: yearColumn,
    [ItemListColumn.ACTIONS]: actionsColumn,
    [ItemListColumn.ADD_TO_PLAYLIST]: addToPlaylistColumn,
};

export interface ItemListCellProps {
    context?: TableContext;
    index: number;
    isHovered?: boolean;
    item: unknown | undefined;
    itemType: LibraryItemType;
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
    if (unit === 'px') return size;
    return size + 100000;
}

export const itemListHelpers = {
    generateListId(libraryId: string, pathname: string) {
        return `${libraryId}-${pathname}-${nanoid()}`;
    },
    getDataQueryKey(libraryId: string, type: LibraryItemType) {
        return [libraryId, 'data', type];
    },
    getInitialData(itemCount: number) {
        return Array.from({ length: itemCount }, () => undefined);
    },
    getListQueryKey(libraryId: string, listKey: string, type: LibraryItemType) {
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
        loadedPages: MutableRefObject<Record<number, boolean>>;
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
            if (!loadedPages.current[page]) {
                pagesToLoad.push(page);
            }
        }

        return pagesToLoad;
    },
    table: {
        columnSizeToStyle(columnSize: number) {
            if (columnSize > 100000) return `minmax(0px, ${columnSize - 100000}fr)`;
            return `${columnSize}px`;
        },
        getColumns(columnOrder: ItemListColumnOrder) {
            const listColumns = [];

            for (const column of columnOrder) {
                listColumns.push(itemListColumnMap[column]);
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
            if (unit === 'px') return size;
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
                if (!prev?.[id]) continue;
                updates[id] = { ...prev[id], userFavorite: favorite };
            }
            return { ...prev, ...updates };
        });
    },
};
