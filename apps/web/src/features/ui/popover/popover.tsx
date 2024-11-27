import {
    createContext,
    type CSSProperties,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useContext,
    useMemo,
    useState,
} from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { AnimatePresence, motion } from 'motion/react';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import styles from './popover.module.scss';

interface PopoverContext {
    align: 'start' | 'center' | 'end';
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    side: 'top' | 'right' | 'bottom' | 'left';
}

const PopoverContext = createContext<PopoverContext | null>(null);

interface PopoverProps {
    align?: 'start' | 'center' | 'end';
    children: ReactNode;
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    disabled?: boolean;
    onClose?: () => void;
    position?:
        | 'top'
        | 'top-start'
        | 'top-end'
        | 'bottom'
        | 'bottom-start'
        | 'bottom-end'
        | 'left'
        | 'left-start'
        | 'left-end'
        | 'right'
        | 'right-start'
        | 'right-end';
    side?: 'top' | 'right' | 'bottom' | 'left';
    trapFocus?: boolean;
    width?: CSSProperties['width'] | 'target';
}

export function Popover(props: PopoverProps) {
    const {
        align = 'center',
        side = 'bottom',
        children,
        position,
        closeOnClickOutside,
        closeOnEscape,
        disabled,
        onClose,
        trapFocus,
        width,
    } = props;

    const [open, setOpen] = useState(false);

    const context: PopoverContext = useMemo(
        () => ({
            align,
            open,
            setOpen,
            side,
        }),
        [align, open, side],
    );

    return (
        <RadixPopover.Root
            closeOnClickOutside={closeOnClickOutside}
            closeOnEscape={closeOnEscape}
            disabled={disabled}
            position={position}
            trapFocus={trapFocus}
            width={width}
            onClose={onClose}
            onOpenChange={setOpen}
            {...props}
        >
            <PopoverContext.Provider value={context}>{children}</PopoverContext.Provider>
        </RadixPopover.Root>
    );
}

interface TargetProps {
    children: ReactNode;
}

function Target(props: TargetProps) {
    const { children } = props;
    const { setOpen } = useContext(PopoverContext) as PopoverContext;

    return (
        <RadixPopover.Trigger asChild onClick={() => setOpen((prev) => !prev)}>
            {children}
        </RadixPopover.Trigger>
    );
}

interface ContentProps {
    children: ReactNode;
}

function Content(props: ContentProps) {
    const { children } = props;
    const { align, open, side } = useContext(PopoverContext) as PopoverContext;

    return (
        <AnimatePresence>
            {open && (
                <RadixPopover.Portal forceMount>
                    <RadixPopover.Content
                        asChild
                        align={align}
                        className={styles.content}
                        side={side}
                        sideOffset={10}
                    >
                        <motion.div
                            animate="show"
                            exit="hidden"
                            initial="hidden"
                            variants={animationVariants.fadeIn}
                        >
                            {children}
                        </motion.div>
                    </RadixPopover.Content>
                </RadixPopover.Portal>
            )}
        </AnimatePresence>
    );
}

Popover.Target = Target;
Popover.Dropdown = Content;
