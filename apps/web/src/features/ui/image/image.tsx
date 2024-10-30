import type { ImgHTMLAttributes } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    thumbHash?: string;
}

export function Image(props: ImageProps) {
    const { ...imgProps } = props;

    return <LazyLoadImage {...imgProps} effect="opacity" />;

    // const placeholderSrc = thumbHash ? imageUtils.thumbHashToDataURL(thumbHash) : undefined;

    // return (
    //     <div style={{ position: 'relative' }}>
    //         {placeholderSrc && (
    //             <img
    //                 alt=""
    //                 src={placeholderSrc}
    //                 style={{
    //                     height: '100%',
    //                     left: 0,
    //                     position: 'absolute',
    //                     top: 0,
    //                     width: '100%',
    //                     zIndex: -1,
    //                 }}
    //             />
    //         )}
    //         <LazyLoadImage
    //             {...imgProps}
    //             effect="opacity"
    //             wrapperProps={{ style: { transitionDelay: '1s', transitionDuration: '0.5s' } }}
    //         />
    //     </div>
    // );
}
