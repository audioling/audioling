import { useMemo, useRef, useState } from 'react';
import { ArtistListSortOptions, ListSortOrder } from '@repo/shared-types';
import { useParams } from 'react-router';
import { useGetApiLibraryIdAlbumArtists } from '@/api/openapi-generated/album-artists/album-artists.ts';
import { SelectInput } from '@/features/ui/select-input/select-input.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';
import { useDebouncedValue } from '@/hooks/use-debounced-value.ts';

interface AlbumArtistSelectProps {
    onChange: (value: string | null) => void;
    value: string;
}

export function AlbumArtistSelect(props: AlbumArtistSelectProps) {
    const { onChange, value } = props;
    const { libraryId } = useParams() as { libraryId: string };

    const [searchValue, setSearchValue] = useState(value || '');
    const [debouncedSearchValue] = useDebouncedValue(searchValue, 500);

    const { data, isFetching } = useGetApiLibraryIdAlbumArtists(
        libraryId,
        {
            limit: '100',
            offset: '0',
            searchTerm: debouncedSearchValue,
            sortBy: ArtistListSortOptions.NAME,
            sortOrder: ListSortOrder.ASC,
        },
        {
            query: {
                enabled: !!debouncedSearchValue,
                placeholderData: (prev) => prev,
            },
        },
    );

    const options = useMemo(() => {
        if (!data) return [];

        return data.data.map((artist) => ({
            label: artist.name,
            value: artist.id,
        }));
    }, [data]);

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
