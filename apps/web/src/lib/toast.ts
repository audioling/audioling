import { toast } from 'sonner';

interface ToastOptions {
    duration?: number;
    position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

export const showToast = {
    error: (message: string, options?: ToastOptions) => {
        const { duration, position = 'bottom-center' } = options ?? {};
        toast.error(message, { duration, position });
    },
    info: (message: string, options?: ToastOptions) => {
        const { duration, position = 'bottom-center' } = options ?? {};
        toast.info(message, { duration, position });
    },
    success: (message: string, options?: ToastOptions) => {
        const { duration, position = 'bottom-center' } = options ?? {};
        toast.success(message, { duration, position });
    },
    warning: (message: string, options?: ToastOptions) => {
        const { duration, position = 'bottom-center' } = options ?? {};
        toast.warning(message, { duration, position });
    },
};
