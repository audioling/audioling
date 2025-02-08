import { type ReactNode, Suspense } from 'react';
import React from 'react';
import { createCallable } from 'react-call';
import { FullPageSpinner } from '@/features/shared/full-page-spinner/full-page-spinner.tsx';
import { Modal } from '@/features/ui/modal/modal.tsx';

interface GeneralModalProps {
    children?: ReactNode;
    closeOnClickOutside?: boolean;
    size?: 'sm' | 'md' | 'lg';
    title?: string;
}

export interface GeneralModalChildProps {
    closeModal: () => void;
}

export const GeneralModal = createCallable<GeneralModalProps, boolean>(
    ({ call, children, closeOnClickOutside, size, title }) => {
        const childrenWithProps = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<GeneralModalChildProps>, {
                    closeModal: () => call.end(false),
                });
            }
            return child;
        });

        return (
            <Modal
                closeOnClickOutside={closeOnClickOutside}
                isClosing={call.ended}
                size={size}
                title={title ?? ''}
                onClose={() => call.end(false)}
            >
                <Suspense fallback={<FullPageSpinner />}>{childrenWithProps}</Suspense>
            </Modal>
        );
    },
    300,
);
