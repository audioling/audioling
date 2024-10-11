import type { FormEvent } from 'react';
import { LibraryListSortOptions, LibraryType, ListSortOrder } from '@repo/shared-types';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import type { PutApiLibrariesIdBody } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import {
    getGetApiLibrariesQueryKey,
    useDeleteApiLibrariesId,
    useGetApiLibrariesIdSuspense,
    usePutApiLibrariesId,
} from '@/api/openapi-generated/libraries/libraries.ts';
import JellyfinIcon from '@/assets/logos/jellyfin.png';
import NavidromeIcon from '@/assets/logos/navidrome.png';
import SubsonicIcon from '@/assets/logos/opensubsonic.png';
import { Button } from '@/features/ui/button/button.tsx';
import { Divider } from '@/features/ui/divider/divider.tsx';
import { PasswordInput } from '@/features/ui/password-input/password-input.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';
import { useFocusTrap } from '@/hooks/use-focus-trap.ts';
import { APP_ROUTE } from '@/routes/app-routes.ts';

export const LibraryEditForm = () => {
    const { libraryId } = useParams<{ libraryId: string }>() as { libraryId: string };
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: library } = useGetApiLibrariesIdSuspense(libraryId, {
        query: {
            gcTime: 0,
            staleTime: 0,
        },
    });

    const { mutate: editLibrary } = usePutApiLibrariesId();
    const { mutate: removeLibrary, isPending: isRemovingLibrary } = useDeleteApiLibrariesId();

    const { Field, handleSubmit, Subscribe } = useForm<PutApiLibrariesIdBody>({
        defaultValues: {
            baseUrl: library.data.baseUrl,
            displayName: library.data.displayName,
            password: '',
            username: '',
        },
        onSubmit: async (e) => {
            editLibrary(
                {
                    data: e.value,
                    id: libraryId,
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

    const handleRemoveLibrary = () => {
        removeLibrary(
            { id: libraryId },
            { onSuccess: () => navigate(generatePath(APP_ROUTE.DASHBOARD_LIBRARY_SELECT)) },
        );
    };

    const ref = useFocusTrap(true);

    return (
        <Stack
            ref={ref}
            as="form"
            onSubmit={handleFormSubmit}
        >
            <Field
                children={(field) => (
                    <TextInput
                        data-autofocus
                        label="Display Name"
                        placeholder="My Library"
                        rightSection={
                            <img
                                height="20px"
                                src={
                                    library.data.type === LibraryType.SUBSONIC
                                        ? SubsonicIcon
                                        : library.data.type === LibraryType.NAVIDROME
                                          ? NavidromeIcon
                                          : JellyfinIcon
                                }
                                width="20px"
                            />
                        }
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
            <Divider />
            <Button
                disabled={isRemovingLibrary}
                variant="danger"
                onClick={handleRemoveLibrary}
            >
                Remove library
            </Button>
        </Stack>
    );
};
