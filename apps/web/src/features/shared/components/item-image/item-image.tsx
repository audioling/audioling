import type { AdapterAPI } from '@repo/shared-types/adapter-types';
import type { AuthServer } from '@repo/shared-types/app-types';
import { adapterAPI } from '@repo/adapter-api';
import { ServerItemType } from '@repo/shared-types/app-types';
import clsx from 'clsx';
import styles from './item-image.module.css';
import { Image } from '/@/components/image/image';
import { useAppContext } from '/@/features/authentication/context/app-context';

interface ItemImageProps {
    className?: string;
    containerClassName?: string;
    id?: string[] | string;
    size: 'table' | 'card';
}

export function ItemImage({ className, containerClassName, id, size }: ItemImageProps) {
    const { server } = useAppContext();
    const adapter = adapterAPI(server.type);
    const imageUrl = getImageUrl(id, size, adapter, server);

    return (
        <Image
            className={clsx(styles.image, className)}
            containerClassName={containerClassName}
            src={imageUrl}
        />
    );
}

function getImageUrl(
    id: string[] | string | undefined,
    size: 'table' | 'card',
    adapter: AdapterAPI,
    server: AuthServer,
) {
    if (!id) {
        return [];
    }

    return (Array.isArray(id) ? id : [id]).map(
        id => adapter._getCoverArtUrl({ id, size: size === 'card' ? 300 : 100, type: ServerItemType.ALBUM }, server),
    );
}
