import { normalizeText } from 'normalize-text';

const normalizeString = (value: string) => {
    return normalizeText(value).split(' ').join('-').toLowerCase();
};

export const db = {
    normalizeString,
};
