import type { Ref } from 'react';
import { forwardRef } from 'react';
import clsx from 'clsx';
import type { Library } from '@/api/api-types.ts';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { MotionButton } from '@/features/ui/button/button.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { useAuthPermissions } from '@/permissions.ts';
import styles from './library-item.module.scss';

export type LibraryItemLibrary = Library & { isLocked: boolean };

export const LibraryItem = forwardRef(
    (
        props: {
            canEdit?: boolean;
            library: LibraryItemLibrary;
            onEdit: (library: LibraryItemLibrary) => void;
            onSelect: (library: LibraryItemLibrary) => void;
        },
        ref: Ref<HTMLButtonElement>,
    ) => {
        const { library, onEdit, onSelect } = props;

        const permissions = useAuthPermissions();
        const canEdit = permissions['library:edit'];

        const libraryItemClassNames = clsx(styles.libraryItem, {
            [styles.canEdit]: canEdit,
        });

        return (
            <div className={libraryItemClassNames}>
                <MotionButton
                    ref={ref}
                    justify="start"
                    leftIcon={library.isLocked ? 'lock' : 'check'}
                    leftIconProps={{
                        state: library.isLocked ? 'error' : 'success',
                    }}
                    rightIcon="arrowRight"
                    variant="filled"
                    variants={animationVariants.fadeIn}
                    onClick={() => onSelect(library)}
                >
                    {library.displayName}
                </MotionButton>
                {canEdit && <IconButton icon="edit" onClick={() => onEdit(library)} />}
            </div>
        );
    },
);

LibraryItem.displayName = 'LibraryItem';
