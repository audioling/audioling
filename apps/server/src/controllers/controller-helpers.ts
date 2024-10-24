import type { LibraryItemType } from '@repo/shared-types';

const getIsNextPage = (offset: number, limit: number, totalRecordCount: number) => {
    return Boolean(offset < totalRecordCount && offset + limit < totalRecordCount);
};

const getIsPrevPage = (offset: number, limit: number) => {
    return Boolean(offset > 0 && offset > limit);
};

const getImageUrl = (libraryId: string, id: string | null, type: LibraryItemType) => {
    return `/api/${libraryId}/images/${id}?type=${type}`;
};

export const controllerHelpers = {
    getImageUrl,
    getIsNextPage,
    getIsPrevPage,
};
