import { faker } from '@faker-js/faker';

export type Person = {
    age: number;
    createdAt: Date;
    firstName: string;
    id: string;
    lastName: string;
    progress: number;
    status: 'relationship' | 'complicated' | 'single';
    visits: number;
};

const range = (len: number) => {
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
};

const newPerson = (index: number): Person => {
    return {
        age: faker.number.int(40),
        createdAt: faker.date.anytime(),
        firstName: faker.person.firstName(),
        id: String(index + 1),
        lastName: faker.person.lastName(),
        progress: faker.number.int(100),
        status: faker.helpers.shuffle<Person['status']>([
            'relationship',
            'complicated',
            'single',
        ])[0]!,
        visits: faker.number.int(1000),
    };
};

export function makeData(...lens: number[]) {
    const makeDataLevel = (depth = 0): Person[] => {
        const len = lens[depth]!;
        return range(len).map((d): Person => {
            return {
                ...newPerson(d),
            };
        });
    };

    return makeDataLevel();
}
