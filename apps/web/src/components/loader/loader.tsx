import { Loader } from '@mantine/core';
import styles from './loader.module.css';

export const LoaderComponentOverride = Loader.extend({
    classNames: {
        root: styles.root,
    },
});

export function FullPageLoader() {
    return (
        <div className={styles.loaderContainer}>
            <Loader />
        </div>
    );
}
