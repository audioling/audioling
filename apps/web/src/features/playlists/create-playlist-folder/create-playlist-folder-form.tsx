import type { FormEvent } from 'react';
import { ListSortOrder, PlaylistFolderListSortOptions } from '@repo/shared-types';
import { Field, useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
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

    console.log('parentOptions', parentOptions);

    const form = useForm<{ name: string; parentId: string }>({
        defaultValues: {
            name: '',
            parentId: '',
        },
        onSubmit: ({ value }) => {
            if (!libraryId) {
                return;
            }

            createPlaylistFolder(
                {
                    data: {
                        name: value.name,
                        parentId: value.parentId || undefined,
                    },
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
        },
        validators: {
            onSubmit: ({ value }) => {
                if (value.name.length === 0) {
                    return 'Name is required';
                }

                return undefined;
            },
        },
    });

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.handleSubmit();
    };

    return (
        <Stack as="form" id={formId} onSubmit={handleFormSubmit}>
            <Field
                children={(field) => (
                    <TextInput
                        data-autofocus
                        label="Name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.currentTarget.value)}
                    />
                )}
                form={form}
                name="name"
            />
            <Field
                children={(field) => (
                    <Select
                        data={[
                            {
                                label: 'hello',
                                value: 'hello',
                            },
                        ]}
                        label="Parent"
                        value={field.state.value}
                        onChange={(e) => {
                            if (e) field.handleChange(e);
                        }}
                    />
                )}
                form={form}
                name="parentId"
            />
        </Stack>
    );
}
