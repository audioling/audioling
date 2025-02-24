import { Center } from '@mantine/core';
import { useState } from 'react';
import { SignInFormContent } from '/@/features/authentication/sign-in/components/sign-in';

export function SignInRoute() {
    const [step, setStep] = useState(0);

    return (
        <Center
            component="main"
            h="100%"
            id="sign-in-route"
        >
            <SignInFormContent setStep={setStep} step={step} />
        </Center>
    );
}
