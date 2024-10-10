import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Ping } from '@/api/api-types.ts';
import { CONSTANTS } from '@/constants.ts';
import { AuthenticateServer } from '@/features/authentication/sign-in/authenticate-server.tsx';
import { ValidateServer } from '@/features/authentication/sign-in/validate-server.tsx';
import { APP_ROUTE } from '@/routes/app-routes.ts';

enum AuthenticationStep {
    VALIDATE_SERVER = 0,
    AUTHENTICATE = 1,
}

export type AuthenticationFormValues = {
    password: string;
    username: string;
};

const steps = [AuthenticationStep.VALIDATE_SERVER, AuthenticationStep.AUTHENTICATE];

export const AuthenticationForm = () => {
    const navigate = useNavigate();
    const [serverUrl, setServerUrl] = useState(CONSTANTS.BASE_URL);
    const [step, setStep] = useState(steps[0]);
    const [pingResponse, setPingResponse] = useState<Ping | null>(null);

    const goToNextStep = (response: Ping | null) => {
        if (response?.isSetupComplete) {
            setStep(steps[1]);
            setPingResponse(response);
        } else {
            navigate(APP_ROUTE.SIGN_UP, { state: { pingResponse: response } });
        }
    };

    const goToPreviousStep = () => {
        setServerUrl('');
        setStep(steps[0]);
    };

    return (
        <AnimatePresence mode="sync">
            {step === steps[0] && (
                <ValidateServer
                    value={serverUrl}
                    onChange={setServerUrl}
                    onSubmit={goToNextStep}
                />
            )}
            {step === steps[1] && (
                <AuthenticateServer
                    pingResponse={pingResponse}
                    serverUrl={serverUrl}
                    onBack={goToPreviousStep}
                />
            )}
        </AnimatePresence>
    );
};
