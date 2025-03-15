import type { AppIcon } from '/@/components/icon/icon';
import type {
    Dispatch,
    ReactNode,
    SetStateAction,
} from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import {
    createContext,
    useContext,
    useMemo,
    useState,
} from 'react';
import styles from './menu.module.css';
import { animationVariants } from '/@/components/animations/variants';
import { Icon } from '/@/components/icon/icon';
import { ScrollArea } from '/@/components/scroll-area/scroll-area';

interface MenuContextProps {
    align: 'start' | 'center' | 'end';
    closeOnSelect?: boolean;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    side: 'top' | 'right' | 'bottom' | 'left';
}

const MenuContext = createContext<MenuContextProps | null>(null);

export interface MenuProps {
    align?: 'start' | 'center' | 'end';
    children: ReactNode;
    closeOnSelect?: boolean;
    side?: 'top' | 'right' | 'bottom' | 'left';
}

export function Menu(props: MenuProps) {
    const { align = 'center', children, closeOnSelect = true, side = 'bottom' } = props;
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
    stickyContent?: ReactNode;
}

function Content(props: ContentProps) {
    const { children, isInPortal = true, stickyContent } = props;
    const { align, open, side } = useContext(MenuContext) as MenuContextProps;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {isInPortal
                        ? (
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
                                            {stickyContent}
                                            <ScrollArea className={styles.maxHeight}>{children}</ScrollArea>
                                        </motion.div>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                            )
                        : (
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
                                        {stickyContent}
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
    const { children, disabled, isSelected, leftIcon, onSelect, rightIcon } = props;

    const { closeOnSelect } = useContext(MenuContext) as MenuContextProps;

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
    const { disabled, isCloseDisabled, setOpen } = useContext(SubmenuContext) as SubmenuContextProps;

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
    stickyContent?: ReactNode;
}

function SubmenuContent(props: SubmenuContentProps) {
    const { children, stickyContent } = props;
    const { open, setOpen } = useContext(SubmenuContext) as SubmenuContextProps;

    return (
        <>
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
                            {stickyContent}
                            <ScrollArea className={styles.maxHeight}>{children}</ScrollArea>
                        </motion.div>
                    </DropdownMenu.SubContent>
                </DropdownMenu.Portal>
            )}
        </>
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
