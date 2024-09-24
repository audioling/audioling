// github.com/mantinedev/mantine/blob/master/packages/@mantine/hooks/src/use-debounced-state/use-debounced-state.ts

import type { SetStateAction } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useDebouncedState<T = unknown>(
    defaultValue: T,
    wait: number,
    options = { leading: false },
) {
    const [value, setValue] = useState(defaultValue);
    const timeoutRef = useRef<number | null>(null);
    const leadingRef = useRef(true);

    const clearTimeout = () => window.clearTimeout(timeoutRef.current!);
    useEffect(() => clearTimeout, []);

    const debouncedSetValue = useCallback(
        (newValue: SetStateAction<T>) => {
            clearTimeout();
            if (leadingRef.current && options.leading) {
                setValue(newValue);
            } else {
                timeoutRef.current = window.setTimeout(() => {
                    leadingRef.current = true;
                    setValue(newValue);
                }, wait);
            }
            leadingRef.current = false;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [options.leading],
    );

    return [value, debouncedSetValue] as const;
}
