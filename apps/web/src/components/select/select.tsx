import { Select } from '@mantine/core';

export const SelectComponentOverride = Select.extend({
    defaultProps: {
        checkIconPosition: 'right',
    },
});
