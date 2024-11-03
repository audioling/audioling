import { ListSortOrder, PlaylistFolderListSortOptions } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
    useGetApiLibraryIdPlaylistsFoldersSuspense,
    usePostApiLibraryIdPlaylistsFolders,
} from '@/api/openapi-generated/playlists/playlists.ts';
import { Select } from '@/features/ui/select/select.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';

interface CreatePlaylistFolderFormProps {
    formId: string;
    libraryId: string;
    onSuccess: () => void;
}

export function CreatePlaylistFolderForm({
    formId,
    libraryId,
    onSuccess,
}: CreatePlaylistFolderFormProps) {
    const queryClient = useQueryClient();
    const { mutate: createPlaylistFolder } = usePostApiLibraryIdPlaylistsFolders();

    const { data: playlistsFolders } = useGetApiLibraryIdPlaylistsFoldersSuspense(libraryId, {
        sortBy: PlaylistFolderListSortOptions.NAME,
        sortOrder: ListSortOrder.ASC,
    });

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
        <Stack as="form" id={formId} onSubmit={handleSubmit}>
            <TextInput data-autofocus label="Name" {...form.register('name', { required: true })} />
            <Select
                data={parentOptions}
                label="Parent"
                {...form.register('parentId')}
                onChange={(e) => form.setValue('parentId', e === null ? '' : e)}
            />
        </Stack>
    );
}
