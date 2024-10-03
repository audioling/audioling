const getIsNextPage = (offset: number, limit: number, totalRecordCount: number) => {
    return Boolean(offset < totalRecordCount && offset + limit < totalRecordCount);
};

const getIsPrevPage = (offset: number, limit: number) => {
    return Boolean(offset > 0 && offset > limit);
};

export const controllerHelpers = {
    getIsNextPage,
    getIsPrevPage,
};
