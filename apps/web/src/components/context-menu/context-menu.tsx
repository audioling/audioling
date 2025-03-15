import type { AppIcon } from '/@/components/icon/icon';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { ScrollArea, Text } from '@mantine/core';
import * as RadixContextMenu from '@radix-ui/react-context-menu';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { createContext, useContext, useMemo, useState } from 'react';
import styles from './context-menu.module.css';
import { animationVariants } from '/@/components/animations/variants';
import { Icon } from '/@/components/icon/icon';

interface ContextMenuContextProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const ContextMenuContext = createContext<ContextMenuContextProps | null>(null);

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
    stickyContent?: ReactNode;
}

function Content(props: ContentProps) {
    const { children, stickyContent } = props;
    const { open } = useContext(ContextMenuContext) as ContextMenuContextProps;

    return (
        <AnimatePresence>
            {open && (
                <RadixContextMenu.Portal forceMount>
                    <RadixContextMenu.Content asChild className={styles.content}>
                        <motion.div animate="show" exit="hidden" initial="hidden">
                            {stickyContent}
                            <ScrollArea className={styles.maxHeight}>{children}</ScrollArea>
                        </motion.div>
                    </RadixContextMenu.Content>
                </RadixContextMenu.Portal>
            )}
        </AnimatePresence>
    );
}

interface ItemProps {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    isSelected?: boolean;
    leftIcon?: keyof typeof AppIcon;
    onSelect?: (event: Event) => void;
    rightIcon?: keyof typeof AppIcon;
}

function Item(props: ItemProps) {
    const { children, className, disabled, isSelected, leftIcon, onSelect, rightIcon } = props;

    return (
        <RadixContextMenu.Item
            className={clsx(styles.item, className, {
                [styles.selected]: isSelected,
                [styles.disabled]: disabled,
            })}
            disabled={disabled}
            onSelect={onSelect}
        >
            {leftIcon && <Icon className={styles.leftIcon} icon={leftIcon} size="sm" />}
            <Text>{children}</Text>
            {rightIcon && <Icon className={styles.rightIcon} icon={rightIcon} size="sm" />}
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

interface LabelProps extends React.ComponentPropsWithoutRef<'div'> {
    children: ReactNode;
}

function Label(props: LabelProps) {
    const { children, className, ...htmlProps } = props;

    return (
        <RadixContextMenu.Label className={clsx(styles.label, className)} {...htmlProps}>
            {children}
        </RadixContextMenu.Label>
    );
}

interface DividerProps {}

function Divider(props: DividerProps) {
    return <RadixContextMenu.Separator {...props} className={styles.divider} />;
}

interface SubmenuContextProps {
    disabled?: boolean;
    isCloseDisabled?: boolean;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const SubmenuContext = createContext<SubmenuContextProps | null>(null);

interface SubmenuProps {
    children: ReactNode;
    disabled?: boolean;
    isCloseDisabled?: boolean;
    open?: boolean;
}

function Submenu(props: SubmenuProps) {
    const { children, disabled, isCloseDisabled, open: isManuallyOpen } = props;
    const [open, setOpen] = useState(isManuallyOpen ?? false);
    const context = useMemo(
        () => ({ disabled, isCloseDisabled, open, setOpen }),
        [disabled, isCloseDisabled, open],
    );

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
    const { disabled, setOpen } = useContext(SubmenuContext) as SubmenuContextProps;

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
    stickyContent?: ReactNode;
}

function SubmenuContent(props: SubmenuContentProps) {
    const { children, stickyContent } = props;
    const { isCloseDisabled, open, setOpen } = useContext(SubmenuContext) as SubmenuContextProps;

    return (
        <>
            {open && (
                <RadixContextMenu.Portal forceMount>
                    <RadixContextMenu.SubContent
                        className={styles.content}
                        onMouseEnter={() => setOpen(true)}
                        onMouseLeave={() => {
                            if (!isCloseDisabled) {
                                setOpen(false);
                            }
                        }}
                    >
                        <motion.div
                            animate="show"
                            className={styles.innerContent}
                            initial="hidden"
                            variants={animationVariants.fadeIn}
                        >
                            {stickyContent}
                            <ScrollArea className={styles.maxHeight}>{children}</ScrollArea>
                        </motion.div>
                    </RadixContextMenu.SubContent>
                </RadixContextMenu.Portal>
            )}
        </>
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
