import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { usePostApiLibraryIdPlaylists } from '@/api/openapi-generated/playlists/playlists.ts';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';

interface CreatePlaylistFormProps {
    formId: string;
    libraryId: string;
    onSuccess: () => void;
}

export function CreatePlaylistForm({ formId, libraryId, onSuccess }: CreatePlaylistFormProps) {
    const queryClient = useQueryClient();
    const { mutate: createPlaylist } = usePostApiLibraryIdPlaylists();

    const form = useForm({
        defaultValues: {
            name: '',
        },
    });

    const handleSubmit = form.handleSubmit((data) => {
        if (!libraryId) {
            return;
        }

        createPlaylist(
            {
                data,
                libraryId,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: [`/api/${libraryId}/playlists`],
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
                    label="Name"
                    {...form.register('name', { required: true })}
                />
            </Stack>
        </form>
    );
}
