import { Tooltip } from '@mantine/core';

export const TooltipComponentOverride = Tooltip.extend({
    vars: () => ({
        tooltip: {
            '--tooltip-bg': 'var(--mantine-color-primary-color-filled)',
            '--tooltip-color': 'var(--mantine-color-primary-color-contrast)',
        },
    }),
});
