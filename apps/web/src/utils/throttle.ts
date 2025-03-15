export function throttle<T extends (...args: any[]) => unknown>(func: T, timeFrame: number) {
    let lastTime = 0;
    return function (...args: Parameters<T>) {
        const now = new Date().valueOf();
        if (now - lastTime >= timeFrame) {
            func(...args);
            lastTime = now;
        }
    };
}
