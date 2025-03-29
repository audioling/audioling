import type { FastAverageColorResult } from 'fast-average-color';
import { FastAverageColor } from 'fast-average-color';
import { useEffect, useRef, useState } from 'react';

export function useImageColor(imageUrl: string) {
    const isLoadedRef = useRef(false);
    const [color, setColor] = useState<FastAverageColorResult | null>(null);

    useEffect(() => {
        const fac = new FastAverageColor();

        if (!isLoadedRef.current) {
            fac.getColorAsync(imageUrl).then((value) => {
                setColor(value);
                isLoadedRef.current = true;
            });
        }

        return () => {
            fac.destroy();
            isLoadedRef.current = false;
        };
    }, [imageUrl]);

    return { color, isLoaded: isLoadedRef.current };
}
