import { AuthenticationForm } from '@/features/authentication/components/authentication-form.tsx';
import { Box } from '@/features/ui/box/box.tsx';
import { Center } from '@/features/ui/center/center.tsx';
import styles from './authentication-route.module.scss';

export const AuthenticationRoute = () => {
    return (
        <Box className={styles.container}>
            <section className={styles.info} />
            <Center
                as="section"
                className={styles.form}
            >
                <AuthenticationForm />
            </Center>
        </Box>
    );
};
