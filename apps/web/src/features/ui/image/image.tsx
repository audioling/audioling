import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

export function Image(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return <LazyLoadImage {...props} effect="opacity" />;
}
