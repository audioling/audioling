import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/features/ui/button/button.tsx';
import { Grid } from '@/features/ui/grid/grid.tsx';
import { Icon } from '@/features/ui/icon/icon.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';
import { Title } from '@/features/ui/title/title.tsx';
import { useDebouncedValue } from '@/hooks/use-debounced-value.ts';
import { useFocusTrap } from '@/hooks/use-focus-trap.ts';
import { Ping } from '@/api/api-types.ts';

enum ValidationState {
    INVALID = 'invalid',
    LOADING = 'loading',
    VALID = 'valid',
}
interface ValidateServerProps {
    onChange: (value: string) => void;
    onSubmit: () => void;
    value: string;
}

export const ValidateServer = (props: ValidateServerProps) => {
    const ref = useFocusTrap(true);
    const [serverUrl] = useDebouncedValue(props.value, 500);
    const [validationState, setValidationState] = useState<ValidationState>(
        ValidationState.INVALID,
    );

    const handleNext = () => {
        OpenAPIConfig.BASE = serverUrl;
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
        props.onSubmit();
    };

    return (
        <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Stack
                ref={ref}
                as="form"
                w="350px"
                onSubmit={handleSubmit}
            >
                <Title
                    order={1}
                    size="md"
                    weight="lg"
                >
                    Connect to server
                </Title>
                <Grid>
                    <Grid.Col span={10}>
                        <TextInput
                            data-autofocus
                            placeholder="http://localhost:5174"
                            size="md"
                            value={props.value}
                            onChange={(e) => props.onChange(e.currentTarget.value)}
                        />
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Icon
                            icon={validationState === 'valid' ? 'check' : 'x'}
                            state={validationState === 'valid' ? 'success' : 'error'}
                        />
                    </Grid.Col>
                </Grid>
                <Button
                    isDisabled={validationState !== 'valid' || props.value === ''}
                    type="submit"
                    variant="filled"
                    onClick={handleNext}
                >
                    Next
                </Button>
            </Stack>
        </motion.div>
    );
};
