import { SegmentedControl, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Icon } from '/@/components/icon/icon';
import { Tooltip } from '/@/components/tooltip/tooltip';
import { ItemListPaginationType } from '/@/features/shared/components/item-list/types';

interface PaginationTypeSelectorProps {
    onChange: (paginationType: ItemListPaginationType) => void;
    value: ItemListPaginationType;
}

export function PaginationTypeSelector({ onChange, value }: PaginationTypeSelectorProps) {
    const { t } = useTranslation();

    return (
        <SegmentedControl
            data={[
                {
                    label: (
                        <Tooltip label={t('app.itemList.pagination.infinite')}>
                            <Stack align="center" justify="center" p="xs">
                                <Icon icon="listInfinite" />
                            </Stack>
                        </Tooltip>

                    ),
                    value: ItemListPaginationType.INFINITE,
                },
                {
                    label: (
                        <Tooltip label={t('app.itemList.pagination.paginated')}>
                            <Stack align="center" justify="center" p="xs">
                                <Icon icon="listPaginated" />
                            </Stack>
                        </Tooltip>

                    ),
                    value: ItemListPaginationType.PAGINATED,
                },
            ]}
            value={value}
            onChange={value => onChange(value as ItemListPaginationType)}
        />
    );
}
