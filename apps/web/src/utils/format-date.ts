import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);

const dateFn = {
    format: (date: string, format?: string) => dayjs(date).utc().format(format),
    formatLocal: (date: string, format?: string) => dayjs(date).format(format),
    now: (format?: string) => dayjs().utc().format(format),
    nowLocal: (format?: string) => dayjs().format(format),
    toDate: (date: string) => dayjs(date).utc().toDate(),
    toDateLocal: (date: string) => dayjs(date).toDate(),
    toString: (date: Date) => dayjs(date).utc().format(),
    toStringLocal: (date: Date) => dayjs(date).format(),
};

export function formatDate(date: string) {
    return dateFn.format(date, 'MMM DD, YYYY');
}

export function formatDateTime(date: string) {
    return dateFn.format(date, 'MMM DD, YYYY HH:mm');
}

export function formatDateLocal(date: string) {
    return dateFn.formatLocal(date, 'MMM DD, YYYY HH:mm');
}

export function formatDateTimeLocal(date: string) {
    return dateFn.formatLocal(date, 'MMM DD, YYYY HH:mm');
}
