import type { ImgHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Img } from 'react-image';
import styles from './image.module.css';
import { Icon } from '/@/components/icon/icon';
import { Skeleton } from '/@/components/skeleton/skeleton';

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    containerClassName?: string;
    src: string | string[];
    thumbHash?: string;
}

export function Image({ className, containerClassName, src }: ImageProps) {
    if (src) {
        return (
            <Img
                className={clsx(styles.image, className)}
                container={children => (
                    <ImageContainer className={containerClassName}>{children}</ImageContainer>
                )}
                loader={(
                    <ImageContainer className={containerClassName}>
                        <ImageLoader className={className} />
                    </ImageContainer>
                )}
                loading="eager"
                src={src}
                unloader={(
                    <ImageContainer className={containerClassName}>
                        <ImageUnloader className={className} />
                    </ImageContainer>
                )}
            />
        );
    }

    return <ImageUnloader />;
}

interface ImageLoaderProps {
    className?: string;
}

function ImageLoader({ className }: ImageLoaderProps) {
    return (
        <div className={clsx(styles.loader, className)}>
            <Skeleton className={clsx(styles.skeleton, className)} />
        </div>
    );
}

interface ImageUnloaderProps {
    className?: string;
}

function ImageUnloader({ className }: ImageUnloaderProps) {
    return (
        <div className={clsx(styles.unloader, className)}>
            <Icon icon="emptyImage" size="xl" />
        </div>
    );
}

interface ImageContainerProps {
    children: React.ReactNode;
    className?: string;
}

function ImageContainer({ children, className }: ImageContainerProps) {
    return <div className={clsx(styles.imageContainer, className)}>{children}</div>;
}
