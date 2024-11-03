import type { FormEvent } from 'react';
import { LibraryListSortOptions, LibraryType, ListSortOrder } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { generatePath, useNavigate } from 'react-router-dom';
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

    const form = useForm({
        defaultValues: {
            baseUrl: '',
            displayName: '',
            password: '',
            type: LibraryType.SUBSONIC,
            username: '',
        },
    });

    const handleSubmit = form.handleSubmit((data) => {
        addLibrary(
            {
                data,
            },
            {
                onError: (error) => {
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
    });

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSubmit();
    };

    const ref = useFocusTrap(true);

    return (
        <Stack ref={ref} as="form" onSubmit={handleFormSubmit}>
            <TextInput
                label="Display Name"
                placeholder="My Library"
                {...form.register('displayName', { required: true })}
            />
            <TextInput
                data-autofocus
                label="Base URL"
                placeholder="http://192.168.1.1:4533"
                {...form.register('baseUrl', { required: true })}
            />
            <TextInput
                autoComplete="username"
                label="Username"
                {...form.register('username', { required: true })}
            />
            <PasswordInput
                autoComplete="current-password"
                label="Password"
                {...form.register('password', { required: true })}
            />

            <LibraryTypeSelector
                value={form.watch('type')}
                onChange={(e) => form.setValue('type', (e as LibraryType) || LibraryType.SUBSONIC)}
            />
            <Button
                isDisabled={!form.formState.isValid || form.formState.isSubmitting}
                type="submit"
                variant="filled"
            >
                Save
            </Button>
        </Stack>
    );
};
