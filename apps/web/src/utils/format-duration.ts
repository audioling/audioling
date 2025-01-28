export function formatDuration(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${secondsLeft.toString().padStart(2, '0')}`;
}

export function formatHumanDuration(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${secondsLeft}s`;
    }

    if (minutes > 0) {
        return `${minutes}m ${secondsLeft}s`;
    }

    return `${secondsLeft}s`;
}
