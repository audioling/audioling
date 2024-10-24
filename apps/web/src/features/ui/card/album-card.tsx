import styles from './album-card.module.scss';

interface AlbumCardProps {
    alt: string;
    descriptions: string[];
    image: string;
}

export function AlbumCard({ image, alt, descriptions }: AlbumCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img alt={alt} className={styles.image} src={image} />
            </div>
            <div className={styles.descriptionContainer}>
                {descriptions.map((description, index) => (
                    <p key={index} className={styles.description}>
                        {description}
                    </p>
                ))}
            </div>
        </div>
    );
}
