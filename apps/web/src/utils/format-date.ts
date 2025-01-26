import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);

const dateFn = {
    format: (date: string, format?: string) => dayjs(date).utc().format(format),
    now: (format?: string) => dayjs().utc().format(format),
    toDate: (date: string) => dayjs(date).utc().toDate(),
    toString: (date: Date) => dayjs(date).utc().format(),
};

export function formatDate(date: string) {
    return dateFn.format(date, 'MMM DD, YYYY');
}

export function formatDateTime(date: string) {
    return dateFn.format(date, 'MMM DD, YYYY HH:mm');
}
