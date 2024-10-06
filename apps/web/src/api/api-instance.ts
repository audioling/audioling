import type { AxiosError, AxiosRequestConfig } from 'axios';
import Axios from 'axios';

export const axiosInstance = Axios.create();

axiosInstance.interceptors.request.use((config) => {
    // const token = localStorage.getItem('token');

    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }

    // config.baseURL = 'http://localhost:4544';

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
