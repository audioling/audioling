const camelToSnake = (camel: string) => {
    return camel.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

const snakeToCamel = (snake: string) => {
    return snake.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const caseConverter = {
    camelToSnake,
    snakeToCamel,
};
