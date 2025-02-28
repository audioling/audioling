import { Card } from '@mantine/core';

export const CardComponentOverride = Card.extend({
    defaultProps: {
        p: 'xl',
        shadow: 'xl',
        withBorder: true,
    },
    styles: (theme) => {
        return {
            root: {
                backgroundColor:
        theme.primaryColor === 'rose' || theme.primaryColor === 'green'
            ? 'var(--mantine-color-secondary-filled)'
            : undefined,
            },
        };
    },
});
