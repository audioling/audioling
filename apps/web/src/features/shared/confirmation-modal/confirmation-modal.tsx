import { type ReactNode } from 'react';
import { createCallable } from 'react-call';
import { Button } from '@/features/ui/button/button.tsx';
import { Modal } from '@/features/ui/modal/modal.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { Text } from '@/features/ui/text/text.tsx';

interface ConfirmationModalProps {
    children?: ReactNode;
    formId?: string;
    initialFocus?: 'cancel' | 'confirm';
    labels?: {
        cancel?: string;
        confirm?: string;
        description?: string;
        title?: string;
    };
    onCancel?: () => Promise<void>;
    onConfirm?: () => Promise<void>;
}

export const ConfirmationModal = createCallable<ConfirmationModalProps, boolean>(
    ({ call, children, formId, labels, onCancel, onConfirm }) => {
        const handleCancel = async () => {
            await onCancel?.();
            call.end(false);
        };

        const handleConfirm = async () => {
            await onConfirm?.();
            call.end(true);
        };

        return (
            <Modal
                closeOnClickOutside={true}
                isClosing={call.ended}
                title={labels?.title ?? 'Are you sure?'}
                onClose={handleCancel}
            >
                <Stack>
                    {children ? children : <Text>{labels?.description}</Text>}
                    <Modal.ButtonGroup>
                        <Button data-autofocus onClick={handleCancel}>
                            {labels?.cancel ?? 'Cancel'}
                        </Button>
                        <Button
                            form={formId}
                            type={formId ? 'submit' : 'button'}
                            variant="filled"
                            onClick={handleConfirm}
                        >
                            {labels?.confirm ?? 'Confirm'}
                        </Button>
                    </Modal.ButtonGroup>
                </Stack>
            </Modal>
        );
    },
    300,
);
