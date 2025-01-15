import fs from 'fs/promises';
import path from 'path';
import type { LibraryItemType, ListSortOrder } from '@repo/shared-types';
import { CONSTANTS } from '@/constants.js';

export interface ServiceHelpers {
    create: <TValues>(args: InsertServiceArgs<TValues>) => Promise<TValues>;
    deleteById: (args: DeleteByIdServiceArgs) => Promise<void>;
    findById: <TValues>(args: FindByIdServiceArgs) => Promise<TValues>;
}

export interface InsertServiceArgs<TValues> {
    values: Omit<TValues, 'id'>;
}

export interface InsertFromAdapterServiceArgs<TValues> {
    libraryFolderId: string;
    libraryId: string;
    values: TValues;
}

export interface FindByIdServiceArgs {
    id: string;
}

export interface DeleteByIdServiceArgs {
    id: string;
}

export interface UpdateByIdServiceArgs<TValues> {
    id: string;
    values: TValues;
}

export interface SetFavoriteServiceArgs {
    userId: string;
    values: { id: string; isFavorite: boolean }[];
}

export interface FindManyServiceArgs<TSortOptions> {
    folderId?: string[];
    limit?: number;
    offset?: number;
    searchTerm?: string;
    sortBy: TSortOptions;
    sortOrder: ListSortOrder;
}

const getImageUrl = (id: string, libraryId: string, type: LibraryItemType) => {
    return `/api/${libraryId}/images/${id}?type=${type}`;
};

const getImageUrls = (args: { id: string | null; libraryId: string; type: LibraryItemType }[]) => {
    const urls = [];

    for (const url of args) {
        if (url.id) {
            urls.push(getImageUrl(url.id, url.libraryId, url.type));
        }
    }

    return urls;
};

const fetchAllRecords = async <T>(args: {
    count: number;
    currentPage: number;
    fetcher: (page: number, limit: number) => Promise<T[]>;
    isAbortedFn?: () => Promise<boolean>;
    onAborted?: () => void;
    onFinish?: (totalCount: number) => void;
    onRecords: (records: T[], progress: number) => void;
    onStart?: () => void;
}) => {
    const { isAbortedFn, count, currentPage, fetcher, onAborted, onFinish, onRecords, onStart } =
        args;

    // Run onStart if this is the first page
    if (currentPage === 0) {
        onStart?.();
    }

    const limit = 500;
    const concurrentFetches = 5;

    const isAborted = await isAbortedFn?.();
    if (isAborted) {
        onAborted?.();
        return;
    }

    // Create array of concurrent fetch promises
    const fetchPromises = Array.from({ length: concurrentFetches }, (_, i) =>
        fetcher(currentPage + i, limit),
    );

    // Wait for all fetches to complete
    const results = await Promise.all(fetchPromises);

    // Process all results
    let totalRecords = 0;
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.length === 0) {
            onFinish?.(count + totalRecords);
            return;
        }
        onRecords(result, (currentPage + i) * limit);
        totalRecords += result.length;
    }

    // If any batch had fewer items than limit, we've reached the end
    if (results.some((result) => result.length < limit)) {
        onFinish?.(count + totalRecords);
        return;
    }

    // Continue with next batch of pages
    return fetchAllRecords({
        count: count + totalRecords,
        currentPage: currentPage + concurrentFetches,
        fetcher,
        isAbortedFn,
        onAborted,
        onFinish,
        onRecords,
        onStart,
    });
};

const checkIndexStatus = async (args: { id: string; libraryId: string }) => {
    const { id, libraryId } = args;
    const indexFile = path.join(CONSTANTS.LIBRARY_DIR(libraryId), 'indexes', `${id}-status.json`);
    const indexStatus = await fs.readFile(indexFile);
    return JSON.parse(indexStatus.toString()) as
        | {
              dateFinished: string;
              status: 'running' | 'finished';
              totalRecordCount: number;
          }
        | undefined;
};

const writeIndexStatus = async (args: {
    id: string;
    libraryId: string;
    status: {
        dateFinished: string;
        totalRecordCount: number;
    };
}) => {
    const { id, libraryId, status } = args;
    const indexFile = path.join(CONSTANTS.LIBRARY_DIR(libraryId), 'indexes', `${id}-status.json`);
    await fs.writeFile(indexFile, JSON.stringify({ id, status }));
};

const deleteIndexStatus = async (args: { id: string; libraryId: string }) => {
    const { id, libraryId } = args;
    const indexFile = path.join(CONSTANTS.LIBRARY_DIR(libraryId), 'indexes', `${id}-status.json`);
    await fs.unlink(indexFile);
};

const writeIndex = async <T>(args: {
    id: string;
    libraryId: string;
    parentId: string;
    records: T[];
}) => {
    const { id, libraryId, parentId } = args;

    const fileDir = path.join(CONSTANTS.LIBRARY_DIR(libraryId), 'indexes', parentId);
    const filePath = path.join(fileDir, `${id}.json`);

    const dirExists = await fs
        .access(fileDir)
        .then(() => true)
        .catch(() => false);

    if (!dirExists) {
        await fs.mkdir(fileDir, { recursive: true });
    }

    const fileExists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);

    if (!fileExists) {
        await fs.writeFile(filePath, '');
    }

    const values = JSON.stringify(args.records);

    await fs.writeFile(filePath, values, { encoding: 'utf-8' });
};

const deleteIndex = async (args: { id: string; libraryId: string }) => {
    const { id, libraryId } = args;
    const fileDir = path.join(CONSTANTS.LIBRARY_DIR(libraryId), 'indexes');

    const files = await fs.readdir(fileDir);

    const indexFiles = files.filter((file) => file.includes(id));
    for (const indexFile of indexFiles) {
        await fs.unlink(path.join(fileDir, indexFile));
    }
};

const readIndexFile = async <T>(args: { path: string }) => {
    const { path } = args;

    const file = await fs.readFile(path);
    const parsed = JSON.parse(file.toString());

    return parsed as T[];
};

const iterateIndex = async <T>(args: {
    id: string;
    libraryId: string;
    onRecords: (records: T[], index: number) => void;
}) => {
    const { id, libraryId, onRecords } = args;

    const indexDir = path.join(CONSTANTS.LIBRARY_DIR(libraryId), 'indexes', id);
    const indexFiles = await fs.readdir(indexDir);

    let index = 0;
    for (const indexFile of indexFiles) {
        const records = await readIndexFile<T>({ path: path.join(indexDir, indexFile) });
        onRecords(records, index);
        index += records.length;
    }
};

const saveQuery = async <T>(args: {
    id: string;
    libraryId: string;
    records: T[];
    type: string;
}) => {
    const { id, libraryId, records, type } = args;
    const queryDir = path.join(CONSTANTS.LIBRARY_DIR(libraryId), 'queries', type);

    // Create the query directory if it doesn't exist
    const dirExists = await fs
        .access(queryDir)
        .then(() => true)
        .catch(() => false);

    if (!dirExists) {
        await fs.mkdir(queryDir, { recursive: true });
    }

    await fs.writeFile(path.join(queryDir, `${id}.json`), JSON.stringify(records), {
        encoding: 'utf-8',
    });
};

const getQuery = async <T>(args: { id: string; libraryId: string; type: string }) => {
    const { id, libraryId, type } = args;
    const queryDir = path.join(CONSTANTS.LIBRARY_DIR(libraryId), 'queries', type);

    // Check if the query file exists
    const fileExists = await fs
        .access(path.join(queryDir, `${id}.json`))
        .then(() => true)
        .catch(() => false);

    if (!fileExists) {
        return null;
    }

    const file = await fs.readFile(path.join(queryDir, `${id}.json`));
    const parsed = JSON.parse(file.toString());
    return parsed as T[];
};

const deleteQuery = async (args: { id: string; libraryId: string; type: string }) => {
    const { id, libraryId, type } = args;
    const queryDir = path.join(CONSTANTS.LIBRARY_DIR(libraryId), 'queries', type);
    await fs.unlink(path.join(queryDir, `${id}.json`));
};

const deleteQueryByType = async (args: { id?: string; libraryId: string; type: string }) => {
    const { id, libraryId, type } = args;
    const queryDir = path.join(CONSTANTS.LIBRARY_DIR(libraryId), 'queries', type);

    if (id) {
        await fs.unlink(path.join(queryDir, `${id}.json`));
    } else {
        await fs.rmdir(queryDir);
    }
};

export const serviceHelpers = {
    checkIndexStatus,
    deleteIndex,
    deleteIndexStatus,
    deleteQuery,
    deleteQueryByType,
    fetchAllRecords,
    getImageUrl,
    getImageUrls,
    getQuery,
    iterateIndex,
    readIndexFile,
    saveQuery,
    writeIndex,
    writeIndexStatus,
};
