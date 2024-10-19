// import { useEffect, useRef, useState } from 'react';
// import {
//     rgbaToThumbHash,
//     thumbHashToDataURL,
//     thumbHashToRGBA,
// } from '@/features/ui/image/image-utils.ts';

import { useEffect, useRef } from 'react';
import { rgbaToThumbHash, thumbHashToDataURL } from '@/features/ui/image/image-utils.ts';

export type Props = React.CanvasHTMLAttributes<HTMLCanvasElement> & {
    hash: string;
    height: number;
    punch?: number;
    width: number;
};

export const ThumbhashImage = ({ hash, height, punch, width, ...rest }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            const scale = 100 / Math.max(width, height);
            canvasRef.current.width = Math.round(width * scale);
            canvasRef.current.height = Math.round(height * scale);
            const pixels = ctx?.getImageData(0, 0, width, height);
            const binaryThumbHash = rgbaToThumbHash(pixels?.width, pixels?.height, pixels?.data);

            // ThumbHash to data URL
            const placeholderURL = thumbHashToDataURL(binaryThumbHash);

            // const placeholderURL = "data:image/png;base64,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"

            canvasRef.current.style.background = `center / cover url(${placeholderURL})`;
            console.log('placeholderURL :>> ', placeholderURL);
        }
    }, [hash, height, punch, width, canvasRef]);

    return (
        <canvas
            ref={canvasRef}
            height={height}
            width={width}
            {...rest}
        />
    );
};
