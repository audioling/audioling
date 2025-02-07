import type { ImgHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Img } from 'react-image';
import { Icon } from '@/features/ui/icon/icon.tsx';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import styles from './image.module.scss';

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    containerClassName?: string;
    src: string | string[];
    thumbHash?: string;
}

export function Image(props: ImageProps) {
    const { src, containerClassName } = props;

    if (src) {
        return (
            <Img
                className={clsx(styles.image, props.className)}
                container={(children) => (
                    <ImageContainer className={containerClassName}>{children}</ImageContainer>
                )}
                loader={
                    <ImageContainer className={containerClassName}>
                        <ImageLoader className={props.className} />
                    </ImageContainer>
                }
                loading="eager"
                src={src}
                unloader={
                    <ImageContainer className={containerClassName}>
                        <ImageUnloader className={props.className} />
                    </ImageContainer>
                }
            />
        );
    }

    return <ImageUnloader />;
}

function ImageLoader(props: { className?: string }) {
    return (
        <div className={clsx(styles.loader, props.className)}>
            <Skeleton className={props.className} height="100%" width="100%" />
        </div>
    );
}

function ImageUnloader(props: { className?: string }) {
    return (
        <div className={clsx(styles.unloader, props.className)}>
            <Icon icon="emptyImage" size="xl" />
        </div>
    );
}

function ImageContainer(props: { children: React.ReactNode; className?: string }) {
    return <div className={clsx(styles.imageContainer, props.className)}>{props.children}</div>;
}
