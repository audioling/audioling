import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { Image } from '@/features/ui/image/image.tsx';

export function ItemImage(props: { className?: string; size: 'table' | 'card'; src: string[] }) {
    const baseUrl = useAuthBaseUrl();

    const imageUrl = (props.src || []).map(
        (url) => `${baseUrl}${url}&size=${props.size === 'card' ? 300 : 100}`,
    );

    return <Image className={props.className} src={imageUrl} />;
}
