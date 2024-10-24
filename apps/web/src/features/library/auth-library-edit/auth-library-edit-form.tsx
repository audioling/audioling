import { type FormEvent, useRef } from 'react';
import { useForm } from '@tanstack/react-form';
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

    const { Field, handleSubmit, Subscribe } = useForm<{
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
                const isConnected = Boolean(library?.username && library?.credential);

                if (isConnected && submitFlag.current === SUBMIT_FLAG.SAVE_AND_CONNECT) {
                    navigate(generatePath(APP_ROUTE.DASHBOARD_HOME, { libraryId }));
                } else if (submitFlag.current === SUBMIT_FLAG.SAVE) {
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
                        onError: (error) => {
                            console.error(error);
                        },
                        onSuccess: (response) => {
                            setAuthLibrary(libraryId, {
                                credential: response.data.credential,
                                overrideBaseUrl: e.value.overrideBaseUrl || null,
                                username: response.data.username,
                            });

                            return onComplete();
                        },
                    },
                );
            } else if (e.value.overrideBaseUrl) {
                setAuthLibrary(libraryId, {
                    overrideBaseUrl: e.value.overrideBaseUrl,
                });

                return onComplete();
            } else {
                return onComplete();
            }
        },
        validators: {
            onChange: ({ value }) => {
                return {
                    fields: {
                        password:
                            isConnected || value.password ? undefined : 'Password is required',
                        username:
                            isConnected || value.username ? undefined : 'Username is required',
                    },
                };
            },
        },
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
            <Field
                children={(field) => (
                    <TextInput
                        data-autofocus
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
                    <Subscribe
                        children={(props) => {
                            return (
                                <Button
                                    disabled={!props.canSubmit || props.isSubmitting}
                                    type="submit"
                                    variant="filled"
                                >
                                    Save and connect
                                </Button>
                            );
                        }}
                    />
                </Grid.Col>
            </Grid>
            <Divider />
            <Button disabled={!isConnected} variant="subtle" onClick={handleInvalidateCredentials}>
                Invalidate credentials
            </Button>
        </Stack>
    );
};
