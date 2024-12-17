import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { usePostApiLibraryIdPlaylists } from '@/api/openapi-generated/playlists/playlists.ts';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { TextArea } from '@/features/ui/text-area/text-area.tsx';
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
            description: '',
            isPublic: false,
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
                    required
                    label="Name"
                    placeholder="Enter a name for the playlist"
                    {...form.register('name', { required: true })}
                />
                <TextArea
                    label="Description"
                    placeholder="A brief description for the playlist"
                    {...form.register('description')}
                />
            </Stack>
        </form>
    );
}
