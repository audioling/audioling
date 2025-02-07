import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { axiosInstance } from '@/api/api-instance.ts';
import type { Ping } from '@/api/api-types.ts';
import { animationProps } from '@/features/ui/animations/props.ts';
import { Button } from '@/features/ui/button/button.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';
import { Title } from '@/features/ui/title/title.tsx';
import { useDebouncedValue } from '@/hooks/use-debounced-value.ts';
import { useFocusTrap } from '@/hooks/use-focus-trap.ts';

enum ValidationState {
    INVALID = 'invalid',
    LOADING = 'loading',
    VALID = 'valid',
}
interface ValidateServerProps {
    onChange: (value: string) => void;
    onSubmit: (response: Ping | null) => void;
    value: string;
}

export const ValidateServer = (props: ValidateServerProps) => {
    const ref = useFocusTrap(true);
    const [serverUrl] = useDebouncedValue(props.value, 500);
    const [validationState, setValidationState] = useState<ValidationState>(
        ValidationState.INVALID,
    );

    const [pingResponse, setPingResponse] = useState<Ping | null>(null);

    const handleNext = () => {
        axiosInstance.defaults.baseURL = serverUrl;
    };

    useEffect(() => {
        if (serverUrl === '') {
            setValidationState(ValidationState.INVALID);
            return;
        }

        const pingServer = async () => {
            setValidationState(ValidationState.LOADING);
            const cleanURL = serverUrl.replace(/\/$/, '');

            try {
                const response = await axios.get<Ping>(`${cleanURL}/ping`, {
                    method: 'GET',
                });

                setPingResponse(response.data);

                // Check for a valid response from the server
                if (response.status !== 200) {
                    setValidationState(ValidationState.INVALID);
                    return;
                }

                // Check that the server is a valid server
                if (response.data?.status !== 'OK') {
                    setValidationState(ValidationState.INVALID);
                    return;
                }

                setValidationState(ValidationState.VALID);
            } catch (error) {
                console.error(error);
            }
        };

        pingServer();
    }, [serverUrl]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        props.onSubmit(pingResponse);
    };

    return (
        <motion.div {...animationProps.fadeIn}>
            <form onSubmit={handleSubmit}>
                <Stack ref={ref} w="350px">
                    <Title order={1} size="lg" weight="lg">
                        Connect to audioling
                    </Title>
                    <Text>Enter the full URL to your audioling server</Text>
                    <Text isSecondary>
                        The local server is available at <code>http://localhost:4544</code>.
                    </Text>
                    <Group>
                        <TextInput
                            data-autofocus
                            placeholder="http://localhost:4544"
                            rightIcon={validationState === 'valid' ? 'check' : 'x'}
                            rightIconProps={{
                                state: validationState === 'valid' ? 'success' : 'error',
                            }}
                            size="md"
                            value={props.value}
                            onChange={(e) => props.onChange(e.currentTarget.value)}
                        />
                    </Group>
                    <Button
                        isDisabled={validationState !== 'valid' || props.value === ''}
                        type="submit"
                        variant="filled"
                        onClick={handleNext}
                    >
                        Next
                    </Button>
                </Stack>
            </form>
        </motion.div>
    );
};
