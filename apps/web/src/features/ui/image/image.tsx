import type { ImgHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Img } from 'react-image';
import TrackImage from '@/assets/placeholders/track.png';
import { Center } from '@/features/ui/center/center.tsx';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import styles from './image.module.scss';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    thumbHash?: string;
}

export function Image(props: ImageProps) {
    const { src } = props;

    if (src) {
        return (
            <Img
                className={clsx(styles.image, props.className)}
                loader={<ImageLoader />}
                src={[src, TrackImage]}
            />
        );
    }

    return null;
}

function ImageLoader() {
    return (
        <Center>
            <Skeleton className={styles.loader} />
        </Center>
    );
}
