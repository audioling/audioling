import { useEffect } from 'react';
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
    setIsLoading: (isLoading: boolean) => void;
}

export function CreatePlaylistForm({
    formId,
    libraryId,
    onSuccess,
    setIsLoading,
}: CreatePlaylistFormProps) {
    const queryClient = useQueryClient();
    const { mutate: createPlaylist, isPending } = usePostApiLibraryIdPlaylists();

    const form = useForm({
        defaultValues: {
            description: '',
            folderId: '',
            isPublic: false,
            name: '',
        },
    });

    useEffect(() => {
        setIsLoading(isPending);
    }, [isPending, setIsLoading]);

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
                    disabled={isPending}
                    label="Name"
                    placeholder="Enter a name for the playlist"
                    {...form.register('name', { required: true })}
                />
                <TextArea
                    disabled={isPending}
                    label="Description"
                    placeholder="A brief description for the playlist"
                    {...form.register('description')}
                />
            </Stack>
        </form>
    );
}
