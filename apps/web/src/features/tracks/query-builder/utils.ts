import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import type { QueryClient } from '@tanstack/react-query';
import type { TrackItem } from '@/api/api-types.ts';
import { appDb } from '@/api/db/app-db.ts';
import { fetchTrackList } from '@/api/fetchers/tracks.ts';
import { fetchAllRecords } from '@/features/shared/offline-filters/offline-filter-utils.ts';

const fetcher = async (
    queryClient: QueryClient,
    libraryId: string,
    page: number,
    limit: number,
) => {
    const result = await fetchTrackList(queryClient, libraryId, {
        limit: limit.toString(),
        offset: (page * limit).toString(),
        sortBy: TrackListSortOptions.NAME,
        sortOrder: ListSortOrder.ASC,
    });

    return result.data as TrackItem[];
};

export async function fetchAllTracks(
    queryClient: QueryClient,
    libraryId: string,
    handlers?: {
        isAbortedFn?: () => Promise<boolean>;
        onAborted?: () => void;
        onFinish?: (totalCount: number) => void;
        onRecords?: (records: TrackItem[], progress: number) => Promise<void>;
        onStart?: () => void;
    },
    options?: {
        concurrentFetches?: number;
        limitPerPage?: number;
    },
) {
    return fetchAllRecords<TrackItem>(
        {
            count: 0,
            currentPage: 0,
            fetcher: (page, limit) => fetcher(queryClient, libraryId, page, limit),
            isAbortedFn: async () => {
                return handlers?.isAbortedFn?.() ?? false;
            },
            onAborted: () => {
                handlers?.onAborted?.();
            },
            onFinish: (totalCount) => {
                handlers?.onFinish?.(totalCount);
            },
            onRecords: async (records, progress) => {
                await handlers?.onRecords?.(records, progress);
                await appDb?.setBatch(
                    LibraryItemType.TRACK,
                    records.map((record) => ({
                        key: record.id,
                        value: record,
                    })),
                );
            },
            onStart: () => {
                handlers?.onStart?.();
            },
        },
        options,
    );
}
