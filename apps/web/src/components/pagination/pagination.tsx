import { Pagination } from '@mantine/core';

export const PaginationComponentOverride = Pagination.extend({
    vars: (theme, props) => {
        const colorKey = props.color && Object.keys(theme.colors).includes(props.color) ? props.color : undefined;
        return {
            root: {
                '--pagination-active-color': colorKey
                    ? `var(--mantine-color-${colorKey}-contrast)`
                    : 'var(--mantine-primary-color-contrast)',
            },
        };
    },
});
