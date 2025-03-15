import { Card } from '@mantine/core';

export const CardComponentOverride = Card.extend({
    defaultProps: {
        p: 'md',
        shadow: 'xs',
    },
});
