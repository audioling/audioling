import { LibraryItemType } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { PlaylistItem } from '@/api/api-types.ts';
import type { PutApiLibraryIdPlaylistsIdBody } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { usePutApiLibraryIdPlaylistsId } from '@/api/openapi-generated/playlists/playlists.ts';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { TextArea } from '@/features/ui/text-area/text-area.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';

interface UpdatePlaylistFormProps {
    formId: string;
    libraryId: string;
    onSuccess: () => void;
    playlist: PlaylistItem;
}

export function UpdatePlaylistForm({
    formId,
    libraryId,
    onSuccess,
    playlist,
}: UpdatePlaylistFormProps) {
    const queryClient = useQueryClient();
    const { mutate: updatePlaylist, isPending } = usePutApiLibraryIdPlaylistsId();

    const form = useForm<PutApiLibraryIdPlaylistsIdBody>({
        defaultValues: {
            description: playlist.description || undefined,
            isPublic: playlist.isPublic,
            name: playlist.name,
        },
    });

    const handleSubmit = form.handleSubmit((data) => {
        if (!libraryId) {
            return;
        }

        updatePlaylist(
            {
                data,
                id: playlist.id,
                libraryId,
            },
            {
                onSuccess: async () => {
                    await queryClient.invalidateQueries({
                        exact: false,
                        queryKey: [`/api/${libraryId}/playlists/${playlist.id}`],
                    });

                    await queryClient.invalidateQueries({
                        exact: false,
                        queryKey: [`/api/${libraryId}/playlists`],
                    });

                    await queryClient.invalidateQueries({
                        queryKey: itemListHelpers.getListQueryKey(
                            libraryId,
                            'playlists',
                            LibraryItemType.PLAYLIST,
                        ),
                    });

                    await queryClient.invalidateQueries({
                        queryKey: itemListHelpers.getDataQueryKey(
                            libraryId,
                            LibraryItemType.PLAYLIST,
                        ),
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
