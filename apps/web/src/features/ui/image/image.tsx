import type { ImgHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Img } from 'react-image';
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
                container={(children) => <ImageContainer>{children}</ImageContainer>}
                loader={<ImageLoader className={props.className} />}
                loading="eager"
                src={[src]}
                unloader={<ImageUnloader />}
            />
        );
    }

    return <ImageUnloader />;
}

function ImageLoader(props: { className?: string }) {
    return (
        <div className={clsx(styles.loader, props.className)}>
            <Skeleton height="100%" width="100%" />
        </div>
    );
}

function ImageUnloader() {
    return <div className={styles.unloader}></div>;
}

function ImageContainer(props: { children: React.ReactNode }) {
    return <div className={styles.imageContainer}>{props.children}</div>;
}
