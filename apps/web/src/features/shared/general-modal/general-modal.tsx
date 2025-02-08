import { type ReactNode } from 'react';
import { createCallable } from 'react-call';
import { Modal } from '@/features/ui/modal/modal.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';

interface GeneralModalProps {
    children?: ReactNode;
    closeOnClickOutside?: boolean;
    title?: string;
}

export const GeneralModal = createCallable<GeneralModalProps, boolean>(
    ({ call, children, closeOnClickOutside, title }) => {
        // const handleCancel = async () => {
        //     await onCancel?.();
        //     call.end(false);
        // };

        // const handleConfirm = async () => {
        //     await onConfirm?.();
        //     call.end(true);
        // };

        return (
            <Modal
                closeOnClickOutside={closeOnClickOutside}
                isClosing={call.ended}
                title={title ?? ''}
                onClose={() => call.end(false)}
            >
                <Stack>{children}</Stack>
            </Modal>
        );
    },
    300,
);
