export const itemListHelpers = {
    getInitialData(itemCount: number) {
        const items = Array(itemCount).fill(undefined);
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
};
