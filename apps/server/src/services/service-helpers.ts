import type { LibraryItemType, ListSortOrder } from '@repo/shared-types';

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

export const serviceHelpers = {
    getImageUrl,
    getImageUrls,
};
