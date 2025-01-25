import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { Image } from '@/features/ui/image/image.tsx';

export function ItemImage(props: {
    className?: string;
    containerClassName?: string;
    size: 'table' | 'card';
    src: string[] | string;
}) {
    const baseUrl = useAuthBaseUrl();

    const imageUrl = (Array.isArray(props.src) ? props.src : [props.src]).map(
        (url) => `${baseUrl}${url}&size=${props.size === 'card' ? 300 : 100}`,
    );

    return (
        <Image
            className={props.className}
            containerClassName={props.containerClassName}
            src={imageUrl}
        />
    );
}
