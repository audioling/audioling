import { useLocation } from 'react-router-dom';
import type { Ping } from '@/api/api-types.ts';
import { RegistrationForm } from '@/features/authentication/registration/registration-form.tsx';
import { Center } from '@/features/ui/center/center.tsx';

export const RegistrationRoute = () => {
    const location = useLocation();

    const pingResponse = (location.state as { pingResponse: Ping | null })?.pingResponse;
    const isSetup = Boolean(pingResponse && !pingResponse.isSetupComplete);

    return (
        <Center>
            <RegistrationForm isSetup={isSetup} />
        </Center>
    );
};
