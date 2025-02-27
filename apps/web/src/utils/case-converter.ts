export const caseConverter = {
    camelToHyphen: (str: string) => str.replace(/([A-Z])/g, '-$1').toLowerCase(),
};
