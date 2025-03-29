import { SegmentedControl, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Icon } from '/@/components/icon/icon';
import { Tooltip } from '/@/components/tooltip/tooltip';
import { ItemListDisplayType } from '/@/features/shared/components/item-list/types';

interface DisplayTypeSelectorProps {
    onChange: (displayType: ItemListDisplayType) => void;
    value: ItemListDisplayType;
}

export function DisplayTypeSelector({ onChange, value }: DisplayTypeSelectorProps) {
    const { t } = useTranslation();
    return (
        <SegmentedControl
            data={[
                {
                    label: (
                        <Tooltip label={t('app.itemList.display.grid')}>
                            <Stack align="center" justify="center" p="xs">
                                <Icon icon="layoutGrid" />
                            </Stack>
                        </Tooltip>

                    ),
                    value: ItemListDisplayType.GRID,
                },
                {
                    label: (
                        <Tooltip label={t('app.itemList.display.table')}>
                            <Stack align="center" justify="center" p="xs">
                                <Icon icon="layoutTable" />
                            </Stack>
                        </Tooltip>

                    ),
                    value: ItemListDisplayType.TABLE,
                },
            ]}
            value={value}
            onChange={value => onChange(value as ItemListDisplayType)}
        />
    );
}
