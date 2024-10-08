import type { Ref } from 'react';
import { forwardRef } from 'react';
import type { Library } from '@/api/api-types.ts';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { MotionButton } from '@/features/ui/button/button.tsx';

export const LibraryItem = forwardRef(
    (
        props: { library: Library & { isLocked: boolean }; onClick: (id: string) => void },
        ref: Ref<HTMLButtonElement>,
    ) => {
        const { library, onClick } = props;

        return (
            <MotionButton
                ref={ref}
                align="between"
                leftIcon={library.displayName ? 'lock' : 'check'}
                leftIconProps={{
                    state: library.displayName ? 'error' : 'success',
                }}
                rightIcon="arrowRight"
                variant="filled"
                variants={animationVariants.fadeIn}
                onClick={() => onClick(library.id)}
            >
                {library.displayName}
            </MotionButton>
        );
    },
);

LibraryItem.displayName = 'LibraryItem';
