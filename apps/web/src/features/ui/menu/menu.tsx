import type { Dispatch, SetStateAction } from 'react';
import { createContext, Fragment, type ReactNode, useContext, useMemo, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { type AppIcon, Icon } from '@/features/ui/icon/icon.tsx';
import { ScrollArea } from '@/features/ui/scroll-area/scroll-area.tsx';
import styles from './menu.module.scss';

interface MenuContext {
    align: 'start' | 'center' | 'end';
    closeOnSelect?: boolean;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    side: 'top' | 'right' | 'bottom' | 'left';
}

export const MenuContext = createContext<MenuContext | null>(null);

interface MenuProps {
    align?: 'start' | 'center' | 'end';
    children: ReactNode;
    closeOnSelect?: boolean;
    side?: 'top' | 'right' | 'bottom' | 'left';
}

export function Menu(props: MenuProps) {
    const { children, align = 'center', closeOnSelect = true, side = 'bottom' } = props;
    const [open, setOpen] = useState(false);

    const context = useMemo(
        () => ({ align, closeOnSelect, open, setOpen, side }),
        [align, closeOnSelect, open, side],
    );

    return (
        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
            <MenuContext.Provider value={context}>{children}</MenuContext.Provider>
        </DropdownMenu.Root>
    );
}

// function getVariantKey(side: MenuProps['side']) {
//     switch (side) {
//         case 'top':
//             return 'fadeIn';
//         case 'right':
//             return 'fadeIn';
//         case 'bottom':
//             return 'fadeIn';
//         case 'left':
//             return 'fadeIn';
//         default:
//             return 'fadeIn';
//     }
// }

interface ContentProps {
    children: ReactNode;
    isInPortal?: boolean;
}

function Content(props: ContentProps) {
    const { children, isInPortal = true } = props;
    const { align, open, side } = useContext(MenuContext) as MenuContext;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {isInPortal ? (
                        <DropdownMenu.Portal forceMount>
                            <DropdownMenu.Content
                                asChild
                                align={align}
                                className={styles.content}
                                collisionPadding={{ bottom: 4, left: 4, right: 4, top: 4 }}
                                side={side}
                                sideOffset={6}
                            >
                                <motion.div
                                    animate="show"
                                    exit="hidden"
                                    initial="hidden"
                                    variants={animationVariants.fadeIn}
                                >
                                    <ScrollArea>{children}</ScrollArea>
                                </motion.div>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    ) : (
                        <DropdownMenu.Content
                            asChild
                            align={align}
                            className={styles.content}
                            collisionPadding={{ bottom: 4, left: 4, right: 4, top: 4 }}
                            side={side}
                            sideOffset={6}
                        >
                            <motion.div
                                animate="show"
                                exit="hidden"
                                initial="hidden"
                                variants={animationVariants.fadeIn}
                            >
                                <ScrollArea>{children}</ScrollArea>
                            </motion.div>
                        </DropdownMenu.Content>
                    )}
                </>
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

    const { closeOnSelect } = useContext(MenuContext) as MenuContext;

    const handleSelect = (e: Event) => {
        if (!closeOnSelect) {
            e.preventDefault();
        }

        onSelect?.(e);
    };

    return (
        <DropdownMenu.Item
            className={clsx(styles.item, {
                [styles.selected]: isSelected,
                [styles.disabled]: disabled,
            })}
            disabled={disabled}
            onSelect={handleSelect}
        >
            {leftIcon && <Icon className={styles.leftIcon} icon={leftIcon} />}
            {children}
            {rightIcon && <Icon className={styles.rightIcon} icon={rightIcon} />}
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
    disabled?: boolean;
    isCloseDisabled?: boolean;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const SubmenuContext = createContext<SubmenuContext | null>(null);

interface SubmenuProps {
    children: ReactNode;
    disabled?: boolean;
    isCloseDisabled?: boolean;
}

function Submenu(props: SubmenuProps) {
    const { children, disabled, isCloseDisabled } = props;
    const [open, setOpen] = useState(false);
    const context = useMemo(
        () => ({ disabled, isCloseDisabled, open, setOpen }),
        [disabled, isCloseDisabled, open],
    );

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
    const { disabled, isCloseDisabled, setOpen } = useContext(SubmenuContext) as SubmenuContext;

    return (
        <DropdownMenu.SubTrigger
            className={clsx({ [styles.disabled]: disabled })}
            disabled={disabled}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => {
                if (!isCloseDisabled) {
                    setOpen(false);
                }
            }}
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
                            <ScrollArea className={styles.submenuContent}>{children}</ScrollArea>
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
