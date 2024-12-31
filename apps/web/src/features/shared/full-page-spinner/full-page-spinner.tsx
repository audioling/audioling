// From https://cssloaders.github.io/

import { Center } from '@/features/ui/center/center.tsx';
import styles from './full-page-spinner.module.scss';

export function FullPageSpinner() {
    return (
        <Center>
            <div className={styles.loader}></div>
        </Center>
    );
}
