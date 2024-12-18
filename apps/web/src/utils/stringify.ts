import stringify from 'safe-stable-stringify';

export function safeStringify(value: Record<string, unknown>) {
    return stringify(value);
}
