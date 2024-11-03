import type { FormEvent } from 'react';
import { Field, useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
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

    const form = useForm<{ name: string }>({
        defaultValues: {
            name: '',
        },
        onSubmit: ({ value }) => {
            if (!libraryId) {
                return;
            }

            createPlaylist(
                {
                    data: {
                        name: value.name,
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
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.currentTarget.value)}
                    />
                )}
                form={form}
                name="name"
            />
        </Stack>
    );
}
