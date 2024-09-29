import type { ListSortOrder } from '@repo/shared-types';

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
    sortBy?: TSortOptions;
    sortOrder?: ListSortOrder;
}
