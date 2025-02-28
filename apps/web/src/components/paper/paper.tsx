import { alpha, Paper } from '@mantine/core';

export const PaperComponentOverride = Paper.extend({
    defaultProps: {
        shadow: 'xl',
    },
    styles: () => {
        return {
            root: {
                backgroundColor: alpha('var(--mantine-color-default)', 0.135),
            },
        };
    },
});
