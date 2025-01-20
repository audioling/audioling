import type { Dispatch, SetStateAction } from 'react';
import type { ColumnHelper, Row } from '@tanstack/react-table';
import { actionsColumn } from '@/features/ui/item-list/item-table/columns/actions-column.tsx';
import { addToPlaylistColumn } from '@/features/ui/item-list/item-table/columns/add-to-playlist-column.tsx';
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

export enum ItemListColumn {
    ACTIONS = 'actions',
    ADD_TO_PLAYLIST = 'addToPlaylist',
    ALBUM = 'album',
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

export type ItemListColumnOrder = (typeof ItemListColumn)[keyof typeof ItemListColumn][];

const columnMap = {
    [ItemListColumn.ROW_INDEX]: rowIndexColumn,
    [ItemListColumn.NAME]: nameColumn,
    [ItemListColumn.STANDALONE_COMBINED]: standaloneCombinedColumn,
    [ItemListColumn.ALBUM]: albumColumn,
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

export const itemListHelpers = {
    getInitialData(itemCount: number) {
        const items = new Array(itemCount);
        for (let i = 0; i < itemCount; i++) {
            items[i] = undefined;
        }
        return items;
    },
    getPageMap(itemCount: number, pageSize: number) {
        const pageCount = Math.ceil(itemCount / pageSize);

        const pageMap: Record<number, boolean> = {};

        for (let i = 0; i < pageCount; i++) {
            pageMap[i] = false;
        }

        return pageMap;
    },
    getPagesToLoad(
        startIndex: number,
        endIndex: number,
        pageSize: number,
        loadedPages: Record<number, boolean>,
    ): number[] {
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
            if (columnSize > 100000) return `${columnSize - 100000}fr`;
            return `${columnSize}px`;
        },
        getColumns<T>(columnHelper: ColumnHelper<T>, columns: ItemListColumn[]) {
            const listColumns = [];

            for (const column of columns) {
                listColumns.push(columnMap[column](columnHelper));
            }

            return listColumns;
        },
        getRowRange<T>(rows: Row<T>[], currentIndex: number, selectedIndex: number): Row<T>[] {
            const rangeStart = selectedIndex > currentIndex ? currentIndex : selectedIndex;
            const rangeEnd = rangeStart === currentIndex ? selectedIndex : currentIndex;
            return rows.slice(rangeStart, rangeEnd + 1);
        },
        numberToColumnSize(size: number, unit: 'px' | 'fr') {
            if (unit === 'px') return size;
            return size + 100000;
        },
    },
    updateFavorite<T>(
        setData: Dispatch<SetStateAction<T[]>>,
        idMap: Record<string, number>,
        ids: string[],
        favorite: boolean,
    ) {
        setData((prevData) => {
            const newData = [...prevData];
            ids.forEach((id) => {
                const index = idMap[id];
                if (index !== undefined && index !== -1) {
                    if (newData[index]) {
                        newData[index] = {
                            ...newData[index],
                            userFavorite: favorite,
                        };
                    }
                }
            });
            return newData;
        });
    },
};
