import { init } from '@paralleldrive/cuid2';

const cuid = init();

export type InitIdFactoryModule = () => {
    generate: () => string;
};

export type IdFactoryModule = ReturnType<InitIdFactoryModule>;

export enum IdAdapter {
    CUID2 = 'cuid2',
}

const cuid2Factory: InitIdFactoryModule = () => {
    return {
        generate: () => {
            return cuid();
        },
    };
};

export const initIdFactoryModule = () => {
    return cuid2Factory();
};
