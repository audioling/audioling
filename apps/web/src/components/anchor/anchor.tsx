import { Anchor } from '@mantine/core';

export const AnchorComponentOverride = Anchor.extend({
    defaultProps: {
        underline: 'always',
    },
});
