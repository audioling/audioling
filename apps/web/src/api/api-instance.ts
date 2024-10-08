import type { AxiosError, AxiosRequestConfig } from 'axios';
import Axios from 'axios';
import { useAuthStore } from '@/features/authentication/stores/auth-store.ts';

export const axiosInstance = Axios.create();

axiosInstance.interceptors.request.use((config) => {
    const authState = useAuthStore.getState();

    if (authState.user && authState.baseUrl) {
        config.baseURL = authState.baseUrl;
        config.headers.Authorization = `Bearer ${authState.user?.token.token}`;
    } else {
        if (config.url !== '/auth/sign-in') {
            console.log('Signing out', config.url, authState);
            authState.signOut();
        }
    }

    return config;
});

export const apiInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const promise = axiosInstance({
        ...config,
        ...options,
    }).then(({ data }) => data);

    return promise;
};

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
