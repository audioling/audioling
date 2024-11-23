import { AuthenticationForm } from '@/features/authentication/sign-in/authentication-form.tsx';
import { Box } from '@/features/ui/box/box.tsx';
import { Center } from '@/features/ui/center/center.tsx';
import styles from './sign-in-route.module.scss';

export const SignInRoute = () => {
    return (
        <Box className={styles.container}>
            <section className={styles.info} />
            <Center className={styles.form}>
                <AuthenticationForm />
            </Center>
        </Box>
    );
};
