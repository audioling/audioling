const credential = (values: string[]) => {
    return values.join('::::');
};

const reverseCredential = (value: string) => {
    return value.split('::::');
};

export const delimiter = {
    credential,
    reverseCredential,
};
