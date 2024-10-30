import { Buffer } from 'buffer';

/**
 * Decodes a ThumbHash to an RGBA image. RGB is not be premultiplied by A.
 *
 * @param hash The bytes of the ThumbHash.
 * @returns The width, height, and pixels of the rendered placeholder image.
 */
function thumbHashToRGBA(hash: Buffer) {
    const { PI, min, max, cos, round } = Math;

    // Read the constants
    const header24 = hash[0] | (hash[1] << 8) | (hash[2] << 16);
    const header16 = hash[3] | (hash[4] << 8);
    const l_dc = (header24 & 63) / 63;
    const p_dc = ((header24 >> 6) & 63) / 31.5 - 1;
    const q_dc = ((header24 >> 12) & 63) / 31.5 - 1;
    const l_scale = ((header24 >> 18) & 31) / 31;
    const hasAlpha = header24 >> 23;
    const p_scale = ((header16 >> 3) & 63) / 63;
    const q_scale = ((header16 >> 9) & 63) / 63;
    const isLandscape = header16 >> 15;
    const lx = max(3, isLandscape ? (hasAlpha ? 5 : 7) : header16 & 7);
    const ly = max(3, isLandscape ? header16 & 7 : hasAlpha ? 5 : 7);
    const a_dc = hasAlpha ? (hash[5] & 15) / 15 : 1;
    const a_scale = (hash[5] >> 4) / 15;

    // Read the varying factors (boost saturation by 1.25x to compensate for quantization)
    const ac_start = hasAlpha ? 6 : 5;
    let ac_index = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decodeChannel = (nx: number, ny: number, scale: number) => {
        const ac = [];
        for (let cy = 0; cy < ny; cy++)
            for (let cx = cy ? 0 : 1; cx * ny < nx * (ny - cy); cx++)
                ac.push(
                    (((hash[ac_start + (ac_index >> 1)] >> ((ac_index++ & 1) << 2)) & 15) / 7.5 -
                        1) *
                        scale,
                );
        return ac;
    };
    const l_ac = decodeChannel(lx, ly, l_scale);
    const p_ac = decodeChannel(3, 3, p_scale * 1.25);
    const q_ac = decodeChannel(3, 3, q_scale * 1.25);
    const a_ac = hasAlpha && decodeChannel(5, 5, a_scale);

    // Decode using the DCT into RGB
    const ratio = thumbHashToApproximateAspectRatio(hash);
    const w = round(ratio > 1 ? 32 : 32 * ratio);
    const h = round(ratio > 1 ? 32 / ratio : 32);
    const rgba = new Uint8Array(w * h * 4),
        fx = [],
        fy = [];
    for (let y = 0, i = 0; y < h; y++) {
        for (let x = 0; x < w; x++, i += 4) {
            let l = l_dc,
                p = p_dc,
                q = q_dc,
                a = a_dc;

            // Precompute the coefficients
            for (let cx = 0, n = max(lx, hasAlpha ? 5 : 3); cx < n; cx++)
                fx[cx] = cos((PI / w) * (x + 0.5) * cx);
            for (let cy = 0, n = max(ly, hasAlpha ? 5 : 3); cy < n; cy++)
                fy[cy] = cos((PI / h) * (y + 0.5) * cy);

            // Decode L
            for (let cy = 0, j = 0; cy < ly; cy++)
                for (let cx = cy ? 0 : 1, fy2 = fy[cy] * 2; cx * ly < lx * (ly - cy); cx++, j++)
                    l += l_ac[j] * fx[cx] * fy2;

            // Decode P and Q
            for (let cy = 0, j = 0; cy < 3; cy++) {
                for (let cx = cy ? 0 : 1, fy2 = fy[cy] * 2; cx < 3 - cy; cx++, j++) {
                    const f = fx[cx] * fy2;
                    p += p_ac[j] * f;
                    q += q_ac[j] * f;
                }
            }

            // Decode A
            if (hasAlpha)
                for (let cy = 0, j = 0; cy < 5; cy++)
                    for (let cx = cy ? 0 : 1, fy2 = fy[cy] * 2; cx < 5 - cy; cx++, j++)
                        a += (a_ac as number[])[j] * fx[cx] * fy2;

            // Convert to RGB
            const b = l - (2 / 3) * p;
            const r = (3 * l - b + q) / 2;
            const g = r - q;
            rgba[i] = max(0, 255 * min(1, r));
            rgba[i + 1] = max(0, 255 * min(1, g));
            rgba[i + 2] = max(0, 255 * min(1, b));
            rgba[i + 3] = max(0, 255 * min(1, a));
        }
    }
    return { h, rgba, w };
}

/**
 * Extracts the average color from a ThumbHash. RGB is not be premultiplied by A.
 *
 * @param hash The bytes of the ThumbHash.
 * @returns The RGBA values for the average color. Each value ranges from 0 to 1.
 */
function thumbHashToAverageRGBA(hash: Uint8Array) {
    const { min, max } = Math;
    const header = hash[0] | (hash[1] << 8) | (hash[2] << 16);
    const l = (header & 63) / 63;
    const p = ((header >> 6) & 63) / 31.5 - 1;
    const q = ((header >> 12) & 63) / 31.5 - 1;
    const hasAlpha = header >> 23;
    const a = hasAlpha ? (hash[5] & 15) / 15 : 1;
    const b = l - (2 / 3) * p;
    const r = (3 * l - b + q) / 2;
    const g = r - q;
    return {
        a,
        b: max(0, min(1, b)),
        g: max(0, min(1, g)),
        r: max(0, min(1, r)),
    };
}

/**
 * Extracts the approximate aspect ratio of the original image.
 *
 * @param hash The bytes of the ThumbHash.
 * @returns The approximate aspect ratio (i.e. width / height).
 */
function thumbHashToApproximateAspectRatio(hash: Buffer) {
    const header = hash[3];
    const hasAlpha = hash[2] & 0x80;
    const isLandscape = hash[4] & 0x80;
    const lx = isLandscape ? (hasAlpha ? 5 : 7) : header & 7;
    const ly = isLandscape ? header & 7 : hasAlpha ? 5 : 7;
    return lx / ly;
}

/**
 * Encodes an RGBA image to a PNG data URL. RGB should not be premultiplied by
 * A. This is optimized for speed and simplicity and does not optimize for size
 * at all. This doesn't do any compression (all values are stored uncompressed).
 *
 * @param w The width of the input image. Must be ≤100px.
 * @param h The height of the input image. Must be ≤100px.
 * @param rgba The pixels in the input image, row-by-row. Must have w*h*4 elements.
 * @returns A data URL containing a PNG for the input image.
 */
function rgbaToDataURL(w: number, h: number, rgba: Uint8Array) {
    const row = w * 4 + 1;
    const idat = 6 + h * (5 + row);
    const bytes = [
        137,
        80,
        78,
        71,
        13,
        10,
        26,
        10,
        0,
        0,
        0,
        13,
        73,
        72,
        68,
        82,
        0,
        0,
        w >> 8,
        w & 255,
        0,
        0,
        h >> 8,
        h & 255,
        8,
        6,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        idat >>> 24,
        (idat >> 16) & 255,
        (idat >> 8) & 255,
        idat & 255,
        73,
        68,
        65,
        84,
        120,
        1,
    ];
    const table = [
        0, 498536548, 997073096, 651767980, 1994146192, 1802195444, 1303535960, 1342533948,
        -306674912, -267414716, -690576408, -882789492, -1687895376, -2032938284, -1609899400,
        -1111625188,
    ];
    let a = 1,
        b = 0;
    for (let y = 0, i = 0, end = row - 1; y < h; y++, end += row - 1) {
        bytes.push(y + 1 < h ? 0 : 1, row & 255, row >> 8, ~row & 255, (row >> 8) ^ 255, 0);
        for (b = (b + a) % 65521; i < end; i++) {
            const u = rgba[i] & 255;
            bytes.push(u);
            a = (a + u) % 65521;
            b = (b + a) % 65521;
        }
    }
    bytes.push(
        b >> 8,
        b & 255,
        a >> 8,
        a & 255,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        73,
        69,
        78,
        68,
        174,
        66,
        96,
        130,
    );
    // eslint-disable-next-line prefer-const
    for (let [start, end] of [
        [12, 29],
        [37, 41 + idat],
    ]) {
        let c = ~0;
        for (let i = start; i < end; i++) {
            c ^= bytes[i];
            c = (c >>> 4) ^ table[c & 15];
            c = (c >>> 4) ^ table[c & 15];
        }
        c = ~c;
        bytes[end++] = c >>> 24;
        bytes[end++] = (c >> 16) & 255;
        bytes[end++] = (c >> 8) & 255;
        bytes[end++] = c & 255;
    }
    return 'data:image/png;base64,' + btoa(String.fromCharCode(...bytes));
}

/**
 * Decodes a ThumbHash to a PNG data URL. This is a convenience function that
 * just calls "thumbHashToRGBA" followed by "rgbaToDataURL".
 *
 * @param base64Hash The bytes of the ThumbHash.
 * @returns A data URL containing a PNG for the rendered ThumbHash.
 */
function thumbHashToDataURL(base64Hash: string) {
    const buffer = Buffer.from(base64Hash, 'base64');
    const image = thumbHashToRGBA(buffer);
    return rgbaToDataURL(image.w, image.h, image.rgba);
}

export const imageUtils = {
    rgbaToDataURL,
    thumbHashToApproximateAspectRatio,
    thumbHashToAverageRGBA,
    thumbHashToDataURL,
};
