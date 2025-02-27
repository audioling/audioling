import type { AdapterAPI, AdapterError, ExtractAdapterResponse } from '@repo/shared-types/adapter-types';
import type { ServerType } from '@repo/shared-types/app-types';
import { adapterAPI } from '@repo/adapter-api';
import { useMutation } from '@tanstack/react-query';
import { showToast } from '/@/lib/toast';
import { useAuthStore } from '/@/stores/auth-store';

interface SignInRequest {
    baseUrl: string;
    displayName?: string;
    password: string;
    serverType: ServerType;
    username: string;
}

type SignInResponse = ExtractAdapterResponse<AdapterAPI['auth']['signIn']>;

async function signIn(values: SignInRequest) {
    const adapter = adapterAPI(values.serverType);

    const result = await adapter.auth.signIn({
        baseUrl: values.baseUrl,
        credential: values.password,
        username: values.username,
    });

    if (result[0]) {
        throw new Error(result[0].message);
    }

    return result[1];
}

export function useSignIn(serverId: string | null) {
    const appSignIn = useAuthStore.use.signIn();

    return useMutation<SignInResponse, AdapterError, SignInRequest>({
        mutationFn: (variables) => {
            return signIn(variables);
        },
        onError: (error) => {
            showToast.error(error.message);
        },
        onSuccess: (data, variables) => {
            appSignIn(serverId, {
                baseUrl: variables.baseUrl,
                credential: data.credential,
                displayName: variables.displayName,
                serverType: variables.serverType,
                username: data.username,
            });
        },
    });
}
