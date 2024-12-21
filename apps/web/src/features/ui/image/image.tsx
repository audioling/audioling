import type { ImgHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Img } from 'react-image';
import TrackImage from '@/assets/placeholders/track.png';
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
                loading="eager"
                src={[src, TrackImage]}
            />
        );
    }

    return null;
}

function ImageLoader() {
    return (
        <div className={styles.loader}>
            <Skeleton height="100%" width="100%" />
        </div>
    );
}
