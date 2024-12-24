import { useEffect } from 'react';
import { ListSortOrder, PlaylistFolderListSortOptions } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
    useGetApiLibraryIdPlaylistsFoldersSuspense,
    usePostApiLibraryIdPlaylistsFolders,
} from '@/api/openapi-generated/playlists/playlists.ts';
import { SelectInput } from '@/features/ui/select-input/select-input.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';

interface CreatePlaylistFolderFormProps {
    formId: string;
    libraryId: string;
    onSuccess: () => void;
    setIsLoading: (isLoading: boolean) => void;
}

export function CreatePlaylistFolderForm({
    formId,
    libraryId,
    onSuccess,
    setIsLoading,
}: CreatePlaylistFolderFormProps) {
    const queryClient = useQueryClient();
    const { mutate: createPlaylistFolder, isPending } = usePostApiLibraryIdPlaylistsFolders();

    const { data: playlistsFolders } = useGetApiLibraryIdPlaylistsFoldersSuspense(libraryId, {
        sortBy: PlaylistFolderListSortOptions.NAME,
        sortOrder: ListSortOrder.ASC,
    });

    useEffect(() => {
        setIsLoading(isPending);
    }, [isPending, setIsLoading]);

    const parentOptions = playlistsFolders.data.map((folder) => ({
        label: folder.name,
        value: folder.id,
    }));

    const form = useForm({
        defaultValues: {
            name: '',
            parentId: '',
        },
    });

    const handleSubmit = form.handleSubmit((data) => {
        setIsLoading(true);
        createPlaylistFolder(
            {
                data: {
                    name: data.name,
                    parentId: data.parentId || undefined,
                },
                libraryId,
            },
            {
                onSuccess: async () => {
                    await queryClient.invalidateQueries({
                        queryKey: [`/api/${libraryId}/playlists`],
                    });

                    await queryClient.invalidateQueries({
                        queryKey: [`/api/${libraryId}/playlists/folders`],
                    });
                    onSuccess();
                },
            },
        );
    });

    return (
        <form id={formId} onSubmit={handleSubmit}>
            <Stack>
                <TextInput
                    data-autofocus
                    disabled={isPending}
                    label="Name"
                    {...form.register('name', { required: true })}
                />
                <SelectInput
                    data={parentOptions}
                    disabled={isPending}
                    label="Parent"
                    {...form.register('parentId')}
                    value={form.getValues('parentId')}
                    onChange={(e) => form.setValue('parentId', e === null ? '' : e)}
                />
            </Stack>
        </form>
    );
}
