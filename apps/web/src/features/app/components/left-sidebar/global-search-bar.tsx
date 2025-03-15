import { TextInput } from '@mantine/core';
import { Icon } from '/@/components/icon/icon';

export function GlobalSearchBar() {
    return (
        <TextInput
            disabled
            leftSection={<Icon icon="search" size="sm" />}
            placeholder="Search"
            size="xs"
            variant="filled"

        />
    );
}
