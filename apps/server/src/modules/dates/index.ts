import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);

export const initDateModule = () => {
    return {
        now: () => dayjs().utc().format(),
        toDate: (date: string) => dayjs(date).utc().toDate(),
        toString: (date: string | Date) => dayjs(date).utc().format(),
    };
};

export type DateModule = ReturnType<typeof initDateModule>;
