import type { Row } from '@tanstack/react-table';

export const getRowRange = <T>(
    rows: Row<T>[],
    currentIndex: number,
    selectedIndex: number,
): Row<T>[] => {
    const rangeStart = selectedIndex > currentIndex ? currentIndex : selectedIndex;
    const rangeEnd = rangeStart === currentIndex ? selectedIndex : currentIndex;
    return rows.slice(rangeStart, rangeEnd + 1);
};
