import { useEffect, useState } from 'react';
import type { FastAverageColorResult } from 'fast-average-color';
import { FastAverageColor } from 'fast-average-color';

export function useImageColor(imageUrl: string) {
    const [color, setColor] = useState<FastAverageColorResult | null>(null);

    useEffect(() => {
        const fac = new FastAverageColor();

        fac.getColorAsync(imageUrl).then((value) => {
            setColor(value);
        });

        return () => {
            fac.destroy();
        };
    }, [imageUrl]);

    return color;
}
