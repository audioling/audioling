import type { Dispatch, SetStateAction } from 'react';
import { createContext, Fragment, type ReactNode, useContext, useMemo, useState } from 'react';
import * as RadixContextMenu from '@radix-ui/react-context-menu';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import type { AppIcon } from '@/features/ui/icon/icon.tsx';
import { Icon } from '@/features/ui/icon/icon.tsx';
import { ScrollArea } from '@/features/ui/scroll-area/scroll-area.tsx';
import styles from './context-menu.module.scss';

interface ContextMenuContext {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const ContextMenuContext = createContext<ContextMenuContext | null>(null);

interface ContextMenuProps {
    children: ReactNode;
}

export function ContextMenu(props: ContextMenuProps) {
    const { children } = props;

    const [open, setOpen] = useState(false);
    const context = useMemo(() => ({ open, setOpen }), [open]);

    return (
        <RadixContextMenu.Root onOpenChange={setOpen}>
            <ContextMenuContext.Provider value={context}>{children}</ContextMenuContext.Provider>
        </RadixContextMenu.Root>
    );
}

interface ContentProps {
    children: ReactNode;
    onCloseAutoFocus?: (event: FocusEvent) => void;
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    onFocusOutside?: (event: FocusEvent) => void;
    onPointerDownOutside?: (event: PointerEvent) => void;
}

function Content(props: ContentProps) {
    const { children } = props;
    const { open } = useContext(ContextMenuContext) as ContextMenuContext;

    return (
        <AnimatePresence>
            {open && (
                <RadixContextMenu.Portal forceMount>
                    <RadixContextMenu.Content asChild className={styles.content}>
                        <motion.div animate="show" exit="hidden" initial="hidden">
                            {children}
                        </motion.div>
                    </RadixContextMenu.Content>
                </RadixContextMenu.Portal>
            )}
        </AnimatePresence>
    );
}

interface ItemProps {
    children: ReactNode;
    disabled?: boolean;
    isSelected?: boolean;
    leftIcon?: keyof typeof AppIcon;
    onSelect?: (event: Event) => void;
    rightIcon?: keyof typeof AppIcon;
}

function Item(props: ItemProps) {
    const { children, disabled, leftIcon, onSelect, rightIcon, isSelected } = props;

    return (
        <RadixContextMenu.Item
            className={clsx(styles.item, {
                [styles.selected]: isSelected,
                [styles.disabled]: disabled,
            })}
            disabled={disabled}
            onSelect={onSelect}
        >
            {leftIcon && <Icon className={styles.leftIcon} icon={leftIcon} />}
            {children}
            {rightIcon && <Icon className={styles.rightIcon} icon={rightIcon} />}
        </RadixContextMenu.Item>
    );
}

interface TargetProps {
    children: ReactNode;
}

function Target(props: TargetProps) {
    const { children } = props;

    return (
        <RadixContextMenu.Trigger asChild className={styles.target}>
            {children}
        </RadixContextMenu.Trigger>
    );
}

interface LabelProps {
    children: ReactNode;
}

function Label(props: LabelProps) {
    const { children } = props;

    return <RadixContextMenu.Label className={styles.label}>{children}</RadixContextMenu.Label>;
}

interface DividerProps {}

function Divider(props: DividerProps) {
    return <RadixContextMenu.Separator {...props} className={styles.divider} />;
}

interface SubmenuContext {
    disabled?: boolean;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const SubmenuContext = createContext<SubmenuContext | null>(null);

interface SubmenuProps {
    children: ReactNode;
    disabled?: boolean;
}

function Submenu(props: SubmenuProps) {
    const { children, disabled } = props;
    const [open, setOpen] = useState(false);
    const context = useMemo(() => ({ disabled, open, setOpen }), [disabled, open]);

    return (
        <RadixContextMenu.Sub open={open}>
            <SubmenuContext.Provider value={context}>{children}</SubmenuContext.Provider>
        </RadixContextMenu.Sub>
    );
}

interface SubmenuTargetProps {
    children: ReactNode;
}

function SubmenuTarget(props: SubmenuTargetProps) {
    const { children } = props;
    const { disabled, setOpen } = useContext(SubmenuContext) as SubmenuContext;

    return (
        <RadixContextMenu.SubTrigger
            className={clsx({ [styles.disabled]: disabled })}
            disabled={disabled}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {children}
        </RadixContextMenu.SubTrigger>
    );
}

interface SubmenuContentProps {
    children: ReactNode;
}

function SubmenuContent(props: SubmenuContentProps) {
    const { children } = props;
    const { open, setOpen } = useContext(SubmenuContext) as SubmenuContext;

    return (
        <Fragment>
            {open && (
                <RadixContextMenu.Portal forceMount>
                    <RadixContextMenu.SubContent
                        className={styles.content}
                        onMouseEnter={() => setOpen(true)}
                        onMouseLeave={() => setOpen(false)}
                    >
                        <motion.div
                            animate="show"
                            initial="hidden"
                            variants={animationVariants.fadeIn}
                        >
                            <ScrollArea className={styles.submenuContent}>{children}</ScrollArea>
                        </motion.div>
                    </RadixContextMenu.SubContent>
                </RadixContextMenu.Portal>
            )}
        </Fragment>
    );
}

ContextMenu.Target = Target;
ContextMenu.Content = Content;
ContextMenu.Item = Item;
ContextMenu.Label = Label;
ContextMenu.Group = RadixContextMenu.Group;
ContextMenu.Submenu = Submenu;
ContextMenu.SubmenuTarget = SubmenuTarget;
ContextMenu.SubmenuContent = SubmenuContent;
ContextMenu.Divider = Divider;
ContextMenu.Arrow = RadixContextMenu.Arrow;
