export function formatSize(size: number) {
    const mb = size / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
}
