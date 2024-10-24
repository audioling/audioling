import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import styles from './album-card.module.scss';

interface AlbumCardProps {
    image: string;
    metadata: {
        path: string;
        text: string;
    }[];
    title: {
        path: string;
        text: string;
    };
}

export function AlbumCard({ image, metadata, title }: AlbumCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img className={styles.image} src={image} />
            </div>
            <div className={styles.descriptionContainer}>
                <NavLink className={styles.description} to={title.path}>
                    {title.text}
                </NavLink>
                {metadata.map(({ path, text }, index) => (
                    <NavLink
                        key={index}
                        className={clsx(styles.description, styles.secondary)}
                        to={path}
                    >
                        {text}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
