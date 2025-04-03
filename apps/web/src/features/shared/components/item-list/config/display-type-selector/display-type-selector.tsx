import { SegmentedControl, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import styles from './display-type-selector.module.css';
import { Icon } from '/@/components/icon/icon';
import { ItemListDisplayType } from '/@/features/shared/components/item-list/types';

interface DisplayTypeSelectorProps {
    onChange: (displayType: ItemListDisplayType) => void;
    value: ItemListDisplayType;
}

export function DisplayTypeSelector({ onChange, value }: DisplayTypeSelectorProps) {
    const { t } = useTranslation();

    return (
        <SegmentedControl
            classNames={{
                root: styles.segmentedControl,
            }}
            data={[
                {
                    label: (
                        <Stack align="center" gap="xs" justify="center" p="xs">
                            <Icon icon="layoutGrid" />
                            <Text size="xs">{t('app.itemList.config.display', { context: 'option_grid' })}</Text>
                        </Stack>

                    ),
                    value: ItemListDisplayType.GRID,
                },
                {
                    label: (
                        <Stack align="center" gap="xs" justify="center" p="xs">
                            <Icon icon="layoutTable" />
                            <Text size="xs">{t('app.itemList.config.display', { context: 'option_table' })}</Text>
                        </Stack>

                    ),
                    value: ItemListDisplayType.TABLE,
                },
            ]}
            size="xs"
            value={value}
            onChange={value => onChange(value as ItemListDisplayType)}
        />
    );
}
