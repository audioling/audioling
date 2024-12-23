import styles from './error-block.module.scss';

export function ErrorBlock({ error }: { error: Error | unknown }) {
    return (
        <code className={styles.block}>
            <pre>{JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}</pre>
        </code>
    );
}
