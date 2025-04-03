import { SegmentedControl, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import styles from './pagination-type-selector.module.css';
import { Icon } from '/@/components/icon/icon';
import { ItemListPaginationType } from '/@/features/shared/components/item-list/types';

interface PaginationTypeSelectorProps {
    onChange: (paginationType: ItemListPaginationType) => void;
    value: ItemListPaginationType;
}

export function PaginationTypeSelector({ onChange, value }: PaginationTypeSelectorProps) {
    const { t } = useTranslation();

    return (
        <SegmentedControl
            classNames={{ root: styles.segmentedControl }}
            data={[
                {
                    label: (
                        <Stack align="center" gap="xs" justify="center" p="xs">
                            <Icon icon="listInfinite" />
                            <Text size="xs">{t('app.itemList.config.pagination', { context: 'option_infinite' })}</Text>
                        </Stack>

                    ),
                    value: ItemListPaginationType.INFINITE,
                },
                {
                    label: (
                        <Stack align="center" gap="xs" justify="center" p="xs">
                            <Icon icon="listPaginated" />
                            <Text size="xs">{t('app.itemList.config.pagination', { context: 'option_pages' })}</Text>
                        </Stack>
                    ),
                    value: ItemListPaginationType.PAGINATED,
                },
            ]}
            size="xs"
            value={value}
            onChange={value => onChange(value as ItemListPaginationType)}
        />
    );
}
