import { Container, rem } from '@mantine/core';

const CONTAINER_SIZES: Record<string, string> = {
    lg: rem('600px'),
    md: rem('500px'),
    sm: rem('400px'),
    xl: rem('1400px'),
    xs: rem('300px'),
    xxl: rem('1600px'),
    xxs: rem('200px'),
};

export const ContainerComponentOverride = Container.extend({
    vars: (_, { fluid, size }) => ({
        root: {
            '--container-size': fluid
                ? '100%'
                : size !== undefined && size in CONTAINER_SIZES
                    ? CONTAINER_SIZES[size]
                    : rem(size),
        },
    }),
});
