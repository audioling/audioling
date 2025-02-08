import React, { type ReactNode, Suspense } from 'react';
import { createCallable } from 'react-call';
import { FullPageSpinner } from '@/features/shared/full-page-spinner/full-page-spinner.tsx';
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
    size?: 'sm' | 'md' | 'lg';
}

export interface ConfirmationModalChildProps {
    closeModal: () => void;
}

export const ConfirmationModal = createCallable<ConfirmationModalProps, boolean>(
    ({ call, children, formId, labels, onCancel, onConfirm, size }) => {
        const handleCancel = async () => {
            await onCancel?.();
            call.end(false);
        };

        const handleConfirm = async () => {
            await onConfirm?.();
            call.end(true);
        };

        const childrenWithProps = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(
                    child as React.ReactElement<ConfirmationModalChildProps>,
                    {
                        closeModal: () => call.end(false),
                    },
                );
            }
            return child;
        });

        return (
            <Modal
                closeOnClickOutside={true}
                isClosing={call.ended}
                size={size}
                title={labels?.title ?? 'Are you sure?'}
                onClose={handleCancel}
            >
                <Stack>
                    <Suspense fallback={<FullPageSpinner />}>
                        {children ? childrenWithProps : <Text>{labels?.description}</Text>}
                    </Suspense>
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
