import { type FormEvent, useRef } from 'react';
import type { LibraryType } from '@repo/shared-types';
import { useForm } from 'react-hook-form';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import type { Library } from '@/api/api-types.ts';
import { usePostApiLibrariesIdAuth } from '@/api/openapi-generated/libraries/libraries.ts';
import {
    useAuthLibrary,
    useAuthStore,
    useInvalidateAuthLibrary,
    useSetAuthLibrary,
} from '@/features/authentication/stores/auth-store.ts';
import { Button } from '@/features/ui/button/button.tsx';
import { Divider } from '@/features/ui/divider/divider.tsx';
import { Grid } from '@/features/ui/grid/grid.tsx';
import { PasswordInput } from '@/features/ui/password-input/password-input.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';
import { useFocusTrap } from '@/hooks/use-focus-trap.ts';
import { APP_ROUTE } from '@/routes/app-routes.ts';

const SUBMIT_FLAG = {
    SAVE: 1,
    SAVE_AND_CONNECT: 2,
};

export const AuthLibraryEditForm = (props: { library: Library }) => {
    const { library: serverLibrary } = props;
    const { libraryId } = useParams<{ libraryId: string }>() as { libraryId: string };
    const navigate = useNavigate();
    const submitFlag = useRef(SUBMIT_FLAG.SAVE_AND_CONNECT);

    const library = useAuthLibrary(libraryId);
    const isConnected = Boolean(library?.username && library?.credential);
    const setAuthLibrary = useSetAuthLibrary();
    const invalidateAuthLibrary = useInvalidateAuthLibrary();

    const { mutate: auth } = usePostApiLibrariesIdAuth();

    const form = useForm<{
        overrideBaseUrl: string;
        password: string;
        username: string;
    }>({
        defaultValues: {
            overrideBaseUrl: library?.overrideBaseUrl || '',
            password: '',
            username: library?.username || '',
        },
    });

    const handleSubmit = form.handleSubmit((data) => {
        const onComplete = () => {
            const library = useAuthStore.getState().libraries[libraryId];
            const isConnected = Boolean(library?.username && library?.credential);

            if (isConnected && submitFlag.current === SUBMIT_FLAG.SAVE_AND_CONNECT) {
                navigate(generatePath(APP_ROUTE.DASHBOARD_HOME, { libraryId }));
            } else if (submitFlag.current === SUBMIT_FLAG.SAVE) {
                navigate(generatePath(APP_ROUTE.DASHBOARD_LIBRARY_SELECT));
            }
        };

        // Handle authentication only if the user has entered a username and password
        if (data.username && data.password) {
            auth(
                {
                    data: {
                        password: data.password,
                        username: data.username,
                    },
                    id: libraryId,
                },
                {
                    onError: (error) => {
                        console.error(error);
                    },
                    onSuccess: (response) => {
                        setAuthLibrary(libraryId, {
                            credential: response.data.credential,
                            overrideBaseUrl: data.overrideBaseUrl || null,
                            type: response.data.type as LibraryType,
                            username: response.data.username,
                        });

                        return onComplete();
                    },
                },
            );
        } else if (data.overrideBaseUrl) {
            setAuthLibrary(libraryId, {
                overrideBaseUrl: data.overrideBaseUrl,
            });

            return onComplete();
        } else {
            return onComplete();
        }
    });

    const handleFormSubmit = (e: FormEvent, flag: number) => {
        e.preventDefault();
        submitFlag.current = flag;
        handleSubmit();
    };

    const handleInvalidateCredentials = () => {
        invalidateAuthLibrary(libraryId);
        navigate(generatePath(APP_ROUTE.DASHBOARD_LIBRARY_SELECT));
    };

    const ref = useFocusTrap(true);

    return (
        <Stack
            ref={ref}
            as="form"
            onSubmit={(e) => handleFormSubmit(e, SUBMIT_FLAG.SAVE_AND_CONNECT)}
        >
            <TextInput
                data-autofocus
                autoComplete="username"
                label="Username"
                {...form.register('username', { required: true })}
            />
            <PasswordInput
                autoComplete="current-password"
                label="Password"
                {...form.register('password')}
            />
            <TextInput
                label="Override URL"
                placeholder={serverLibrary.baseUrl}
                {...form.register('overrideBaseUrl')}
            />
            <Grid grow gutter="xs">
                <Grid.Col grow span={4}>
                    <Button
                        variant="default"
                        onClick={(e) => handleFormSubmit(e, SUBMIT_FLAG.SAVE)}
                    >
                        Save
                    </Button>
                </Grid.Col>
                <Grid.Col grow span={8}>
                    <Button
                        disabled={!form.formState.isValid || form.formState.isSubmitting}
                        type="submit"
                        variant="filled"
                    >
                        Save and connect
                    </Button>
                </Grid.Col>
            </Grid>
            <Divider />
            <Button disabled={!isConnected} variant="subtle" onClick={handleInvalidateCredentials}>
                Invalidate credentials
            </Button>
        </Stack>
    );
};
