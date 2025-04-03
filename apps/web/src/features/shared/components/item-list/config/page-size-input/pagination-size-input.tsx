import { Slider } from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE_OPTIONS = [
    {
        value: 50,
    },
    {
        label: '100',
        value: 100,
    },
    {
        value: 200,
    },
    {
        label: '300',
        value: 300,
    },
    {
        value: 400,
    },
    {
        label: '500',
        value: 500,
    },
];

interface PaginationSizeInputProps {
    onChange: (value: number) => void;
    value: number;
}

export function PaginationSizeInput({ onChange, value }: PaginationSizeInputProps) {
    const { t } = useTranslation();

    const [localValue, setLocalValue] = useState(value);

    return (
        <Slider
            label={`${t('app.itemList.config.pageSize', { context: 'label', count: localValue })}`}
            marks={PAGE_SIZE_OPTIONS}
            max={PAGE_SIZE_OPTIONS[PAGE_SIZE_OPTIONS.length - 1].value}
            min={50}
            px="sm"
            step={50}
            value={localValue}
            onChange={setLocalValue}
            onChangeEnd={e => onChange(e)}
        />
    );
}
