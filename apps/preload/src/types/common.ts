export type MessageObj<T> = {
    [K in keyof T]: (...args: any) => void;
};
