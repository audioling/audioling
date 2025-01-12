import { useMemo, useRef, useState } from 'react';
import { GenreListSortOptions, ListSortOrder } from '@repo/shared-types';
import { useParams } from 'react-router';
import { useGetApiLibraryIdGenres } from '@/api/openapi-generated/genres/genres.ts';
import { SelectInput } from '@/features/ui/select-input/select-input.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';
import { useDebouncedValue } from '@/hooks/use-debounced-value.ts';

interface GenreSelectProps {
    onChange: (value: string | null) => void;
    value: string;
}

export function GenreSelect(props: GenreSelectProps) {
    const { onChange, value } = props;
    const { libraryId } = useParams() as { libraryId: string };

    const [searchValue, setSearchValue] = useState(value || '');
    const [debouncedSearchValue] = useDebouncedValue(searchValue, 200);

    const { data, isFetching } = useGetApiLibraryIdGenres(
        libraryId,
        {
            limit: '-1',
            offset: '0',
            sortBy: GenreListSortOptions.NAME,
            sortOrder: ListSortOrder.ASC,
        },
        {
            query: {
                placeholderData: (prev) => prev,
            },
        },
    );

    const options = useMemo(() => {
        if (!data) return [];

        if (debouncedSearchValue) {
            return data.data
                .filter((genre) =>
                    genre.name.toLowerCase().includes(debouncedSearchValue.toLowerCase()),
                )
                .map((genre) => ({
                    label: genre.name,
                    value: genre.id,
                }));
        }

        return data.data.map((genre) => ({
            label: genre.name,
            value: genre.id,
        }));
    }, [data, debouncedSearchValue]);

    const ref = useRef<HTMLInputElement>(null);

    const handleOpenChange = (open: boolean) => {
        if (open) {
            setTimeout(() => {
                ref.current?.focus();
            }, 50);
        }
    };

    return (
        <SelectInput
            data={options}
            stickyContent={
                <TextInput
                    ref={ref}
                    leftIcon={isFetching ? 'spinner' : 'search'}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            }
            value={value}
            onChange={onChange}
            onOpenChange={handleOpenChange}
        />
    );
}
