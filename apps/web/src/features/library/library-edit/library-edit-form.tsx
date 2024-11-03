import { LibraryListSortOptions, LibraryType, ListSortOrder } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
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

    const form = useForm({
        defaultValues: {
            baseUrl: library.data.baseUrl,
            displayName: library.data.displayName,
            password: '',
            username: '',
        },
    });

    const handleSubmit = form.handleSubmit((data) => {
        editLibrary(
            {
                data,
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
    });

    const handleRemoveLibrary = () => {
        removeLibrary(
            { id: libraryId },
            { onSuccess: () => navigate(generatePath(APP_ROUTE.DASHBOARD_LIBRARY_SELECT)) },
        );
    };

    const ref = useFocusTrap(true);

    return (
        <Stack ref={ref} as="form" onSubmit={handleSubmit}>
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
                {...form.register('displayName', { required: true })}
            />

            <TextInput
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
            <Button
                isDisabled={!form.formState.isValid || form.formState.isSubmitting}
                type="submit"
                variant="filled"
            >
                Save
            </Button>
            <Divider />
            <Button disabled={isRemovingLibrary} variant="danger" onClick={handleRemoveLibrary}>
                Remove library
            </Button>
        </Stack>
    );
};
