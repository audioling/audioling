import { type FormEvent, useRef } from 'react';
import { useForm } from '@tanstack/react-form';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import type { Library } from '@/api/api-types.ts';
import { usePostApiLibrariesIdAuth } from '@/api/openapi-generated/libraries/libraries.ts';
import {
    useAuthLibrary,
    useAuthStore,
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
    const setAuthLibrary = useSetAuthLibrary();

    const { mutate: auth } = usePostApiLibrariesIdAuth();

    const isAlreadyConnected = Boolean(library?.username && library?.credential);

    const { Field, handleSubmit } = useForm<{
        overrideBaseUrl: string;
        password: string;
        username: string;
    }>({
        defaultValues: {
            overrideBaseUrl: library?.overrideBaseUrl || '',
            password: '',
            username: library?.username || '',
        },
        onSubmit: async (e) => {
            const onComplete = () => {
                const library = useAuthStore.getState().libraries[libraryId];
                const isConnected = Boolean(library.username && library.credential);
                console.log('library', library, isConnected, submitFlag.current);

                if (isConnected && submitFlag.current === SUBMIT_FLAG.SAVE_AND_CONNECT) {
                    navigate(generatePath(APP_ROUTE.DASHBOARD_HOME, { libraryId }));
                } else {
                    navigate(generatePath(APP_ROUTE.DASHBOARD_LIBRARY_SELECT));
                }
            };

            // Handle authentication only if the user has entered a username and password
            if (e.value.username && e.value.password) {
                auth(
                    {
                        data: {
                            password: e.value.password,
                            username: e.value.username,
                        },
                        id: libraryId,
                    },
                    {
                        onError: () => {
                            // TODO: Handle error
                        },
                        onSuccess: (response) => {
                            setAuthLibrary(libraryId, {
                                credential: response.data.credential,
                                overrideBaseUrl: e.value.overrideBaseUrl || null,
                                username: response.data.username,
                            });
                        },
                    },
                );
            } else if (e.value.overrideBaseUrl) {
                setAuthLibrary(libraryId, {
                    overrideBaseUrl: e.value.overrideBaseUrl,
                });
            }

            onComplete();
        },
    });

    const handleFormSubmit = (e: FormEvent, flag: number) => {
        e.preventDefault();
        submitFlag.current = flag;
        handleSubmit();
    };

    const ref = useFocusTrap(true);

    return (
        <Stack
            ref={ref}
            as="form"
            onSubmit={(e) => handleFormSubmit(e, SUBMIT_FLAG.SAVE_AND_CONNECT)}
        >
            <Field
                children={(field) => (
                    <TextInput
                        data-autofocus
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
                        label="Password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.currentTarget.value)}
                    />
                )}
                name="password"
            />
            <Divider />
            <Field
                children={(field) => (
                    <TextInput
                        label="Override URL"
                        placeholder={serverLibrary.baseUrl}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.currentTarget.value)}
                    />
                )}
                name="overrideBaseUrl"
            />
            <Grid
                grow
                gap="xs"
            >
                <Grid.Col
                    grow
                    span={4}
                >
                    <Button
                        variant="default"
                        onClick={(e) => handleFormSubmit(e, SUBMIT_FLAG.SAVE)}
                    >
                        Save
                    </Button>
                </Grid.Col>
                <Grid.Col
                    grow
                    span={8}
                >
                    <Button
                        disabled={!isAlreadyConnected}
                        type="submit"
                        variant="filled"
                    >
                        Save and connect
                    </Button>
                </Grid.Col>
            </Grid>
        </Stack>
    );
};
