import type { Dispatch, SetStateAction } from 'react';
import { createContext, Fragment, type ReactNode, useContext, useMemo, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import styles from './menu.module.scss';

interface MenuContext {
    align: 'start' | 'center' | 'end';
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    side: 'top' | 'right' | 'bottom' | 'left';
}

export const MenuContext = createContext<MenuContext | null>(null);

interface MenuProps {
    align?: 'start' | 'center' | 'end';
    children: ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
}

export function Menu(props: MenuProps) {
    const { children, align = 'center', side = 'bottom' } = props;
    const [open, setOpen] = useState(false);

    const context = useMemo(() => ({ align, open, setOpen, side }), [align, open, side]);

    return (
        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
            <MenuContext.Provider value={context}>{children}</MenuContext.Provider>
        </DropdownMenu.Root>
    );
}

function getVariantKey(side: MenuProps['side']) {
    switch (side) {
        case 'top':
            return 'slideInUp';
        case 'right':
            return 'slideInRight';
        case 'bottom':
            return 'slideInDown';
        case 'left':
            return 'slideInLeft';
        default:
            return 'slideInDown';
    }
}

interface ContentProps {
    children: ReactNode;
}

function Content(props: ContentProps) {
    const { children } = props;
    const { align, open, side } = useContext(MenuContext) as MenuContext;

    const variant = animationVariants[getVariantKey(side)];

    return (
        <AnimatePresence>
            {open && (
                <DropdownMenu.Portal forceMount>
                    <DropdownMenu.Content
                        asChild
                        align={align}
                        className={styles.content}
                        side={side}
                    >
                        <motion.div
                            animate="show"
                            exit="hidden"
                            initial="hidden"
                            variants={variant}
                        >
                            {children}
                        </motion.div>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            )}
        </AnimatePresence>
    );
}

interface ItemProps {
    children: ReactNode;
    disabled?: boolean;
    onSelect?: (event: Event) => void;
}

function Item(props: ItemProps) {
    const { children, disabled, onSelect } = props;

    return (
        <DropdownMenu.Item className={styles.item} disabled={disabled} onSelect={onSelect}>
            {children}
        </DropdownMenu.Item>
    );
}

interface TargetProps {
    children: ReactNode;
}

function Target(props: TargetProps) {
    const { children } = props;

    return (
        <DropdownMenu.Trigger asChild className={styles.target}>
            {children}
        </DropdownMenu.Trigger>
    );
}

interface LabelProps {
    children: ReactNode;
}

function Label(props: LabelProps) {
    const { children } = props;

    return <DropdownMenu.Label className={styles.label}>{children}</DropdownMenu.Label>;
}

interface DividerProps {}

function Divider(props: DividerProps) {
    return <DropdownMenu.Separator {...props} className={styles.divider} />;
}

interface SubmenuContext {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const SubmenuContext = createContext<SubmenuContext | null>(null);

interface SubmenuProps {
    children: ReactNode;
}

function Submenu(props: SubmenuProps) {
    const { children } = props;
    const [open, setOpen] = useState(false);
    const context = useMemo(() => ({ open, setOpen }), [open]);

    return (
        <DropdownMenu.Sub open={open}>
            <SubmenuContext.Provider value={context}>{children}</SubmenuContext.Provider>
        </DropdownMenu.Sub>
    );
}

interface SubmenuTargetProps {
    children: ReactNode;
}

function SubmenuTarget(props: SubmenuTargetProps) {
    const { children } = props;
    const { setOpen } = useContext(SubmenuContext) as SubmenuContext;

    return (
        <DropdownMenu.SubTrigger
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {children}
        </DropdownMenu.SubTrigger>
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
                <DropdownMenu.Portal forceMount>
                    <DropdownMenu.SubContent
                        className={styles.content}
                        onMouseEnter={() => setOpen(true)}
                        onMouseLeave={() => setOpen(false)}
                    >
                        <motion.div
                            animate="show"
                            initial="hidden"
                            variants={animationVariants.fadeIn}
                        >
                            {children}
                        </motion.div>
                    </DropdownMenu.SubContent>
                </DropdownMenu.Portal>
            )}
        </Fragment>
    );
}

Menu.Target = Target;
Menu.Content = Content;
Menu.Item = Item;
Menu.Label = Label;
Menu.Group = DropdownMenu.Group;
Menu.Submenu = Submenu;
Menu.SubmenuTarget = SubmenuTarget;
Menu.SubmenuContent = SubmenuContent;
Menu.Divider = Divider;
Menu.Arrow = DropdownMenu.Arrow;
