import type { FormEvent } from 'react';
import { LibraryListSortOptions, LibraryType, ListSortOrder } from '@repo/shared-types';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { generatePath, useNavigate } from 'react-router-dom';
import type { PostApiLibrariesBody } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import {
    getGetApiLibrariesQueryKey,
    usePostApiLibraries,
} from '@/api/openapi-generated/libraries/libraries.ts';
import { LibraryTypeSelector } from '@/features/library/library-add/library-type-selector.tsx';
import { Button } from '@/features/ui/button/button.tsx';
import { PasswordInput } from '@/features/ui/password-input/password-input.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';
import { useFocusTrap } from '@/hooks/use-focus-trap.ts';
import { APP_ROUTE } from '@/routes/app-routes.ts';

export const LibraryAddForm = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { mutate: addLibrary } = usePostApiLibraries();

    const { Field, handleSubmit, Subscribe } = useForm<PostApiLibrariesBody>({
        defaultValues: {
            baseUrl: '',
            displayName: '',
            password: '',
            type: LibraryType.SUBSONIC,
            username: '',
        },
        onSubmit: async (e) => {
            addLibrary(
                {
                    data: e.value,
                },
                {
                    onError: (error) => {
                        // TODO: handle error
                        console.error(error);
                    },
                    onSuccess: async () => {
                        navigate(generatePath(APP_ROUTE.DASHBOARD_LIBRARY_SELECT));
                        queryClient.invalidateQueries({
                            queryKey: getGetApiLibrariesQueryKey({
                                sortBy: LibraryListSortOptions.NAME,
                                sortOrder: ListSortOrder.ASC,
                            }),
                        });
                    },
                },
            );
        },
        validators: {
            onChange: ({ value }) => {
                return {
                    fields: {
                        baseUrl: value.baseUrl ? undefined : 'Base URL is required',
                        displayName: value.displayName ? undefined : 'Display Name is required',
                        password: value.password ? undefined : 'Password is required',
                        type: value.type ? undefined : 'Type is required',
                        username: value.username ? undefined : 'Username is required',
                    },
                };
            },
        },
    });

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSubmit();
    };

    const ref = useFocusTrap(true);

    return (
        <Stack ref={ref} as="form" onSubmit={handleFormSubmit}>
            <Field
                children={(field) => (
                    <TextInput
                        label="Display Name"
                        placeholder="My Library"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.currentTarget.value)}
                    />
                )}
                name="displayName"
            />
            <Field
                children={(field) => (
                    <TextInput
                        data-autofocus
                        label="Base URL"
                        placeholder="http://192.168.1.1:4533"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.currentTarget.value)}
                    />
                )}
                name="baseUrl"
            />
            <Field
                children={(field) => (
                    <TextInput
                        autoComplete="username"
                        label="Username"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.currentTarget.value)}
                    />
                )}
                name="username"
            />
            <Field
                children={(field) => (
                    <PasswordInput
                        autoComplete="current-password"
                        label="Password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.currentTarget.value)}
                    />
                )}
                name="password"
            />
            <Field
                children={(field) => (
                    <LibraryTypeSelector
                        value={field.state.value as LibraryType}
                        onChange={(e) =>
                            field.handleChange((e as LibraryType) || LibraryType.SUBSONIC)
                        }
                    />
                )}
                name="type"
            />
            <Subscribe
                children={(props) => (
                    <Button
                        isDisabled={!props.canSubmit || props.isSubmitting}
                        type="submit"
                        variant="filled"
                    >
                        Save
                    </Button>
                )}
            />
        </Stack>
    );
};
