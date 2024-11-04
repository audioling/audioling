export const estimateTotalRecordCount = async (
    fetcher: (page: number, limit: number) => Promise<number>,
    limit: number,
) => {
    // Recursive binary search across all pages to estimate total rows
    async function estimateTotalRowsRecursive(
        low: number,
        high: number,
        limit: number,
    ): Promise<number> {
        if (low > high) {
            return 0; // This condition is just a safeguard and shouldn't be reached
        }

        const mid = Math.floor((low + high) / 2);
        const data = await fetcher(mid, limit);

        if (data < limit) {
            // If the current page contains fewer than 500 items, it's close to the last page
            const itemCount = (mid - 1) * limit + data;
            return itemCount;
        } else {
            // If the current page is full, search in the higher half
            return estimateTotalRowsRecursive(mid + 1, high, limit);
        }
    }

    // Function to estimate total rows with limited page size
    async function estimateTotalRows(): Promise<number> {
        let low = 1;
        let high = 2;

        // Step 1: Exponentially grow the number of pages to get an upper bound for the total pages
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const data = await fetcher(high, limit);

            if (data < limit) {
                // If we encounter the last page, break out of the loop
                break;
            }

            // Double the upper bound for the number of pages
            low = high;
            high *= 2;
        }

        // Step 2: Perform binary search across all pages to find the exact number of rows
        return estimateTotalRowsRecursive(low, high, limit);
    }

    return estimateTotalRows();
};

export const exactTotalRecordCount = async (
    fetcher: (page: number, limit: number) => Promise<number>,
    startPage: number,
    limit: number,
) => {
    const fetchCountRecursive = async (
        page: number,
        limit: number,
        reverse: boolean,
        totalRecordCount: number,
        previousPageRecordCount?: number,
    ): Promise<number> => {
        const currentPageRecordCount = await fetcher(page, limit);

        if (currentPageRecordCount !== limit && currentPageRecordCount !== 0) {
            totalRecordCount += currentPageRecordCount;
            return totalRecordCount;
        }

        // Handle the case when the last page is equal to the limit and is ascending
        if (
            !reverse &&
            currentPageRecordCount !== limit &&
            currentPageRecordCount === 0 &&
            currentPageRecordCount === previousPageRecordCount
        ) {
            return totalRecordCount;
        }

        if (reverse) {
            totalRecordCount -= limit;
            return fetchCountRecursive(
                page - 1,
                limit,
                true,
                totalRecordCount,
                currentPageRecordCount,
            );
        } else {
            totalRecordCount += currentPageRecordCount;
            return fetchCountRecursive(
                page + 1,
                limit,
                false,
                totalRecordCount,
                currentPageRecordCount,
            );
        }
    };

    const estimatedStartRecordCount = startPage * limit;
    const startPageRecordCount = await fetcher(startPage, limit);
    const isLastPage = startPageRecordCount < limit && startPageRecordCount !== 0;

    if (isLastPage) {
        if (estimatedStartRecordCount < limit) {
            return estimatedStartRecordCount + startPageRecordCount;
        }

        return estimatedStartRecordCount - limit + startPageRecordCount;
    }

    const shouldReverse = startPageRecordCount < limit;

    const count = await fetchCountRecursive(
        startPage,
        limit,
        shouldReverse,
        estimatedStartRecordCount,
    );
    return count;
};
