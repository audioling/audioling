import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as RSelect from '@radix-ui/react-select';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import type { AppIcon } from '@/features/ui/icon/icon.tsx';
import { Icon } from '@/features/ui/icon/icon.tsx';
import { ScrollArea } from '@/features/ui/scroll-area/scroll-area.tsx';
import styles from './select.module.scss';

interface SelectContext {
    align: 'start' | 'center' | 'end';
    hasLeftIcon: boolean;
    hasRightIcon: boolean;
    open: boolean;
    setHasLeftIcon: Dispatch<SetStateAction<boolean>>;
    setHasRightIcon: Dispatch<SetStateAction<boolean>>;
    setOpen: Dispatch<SetStateAction<boolean>>;
    side: 'top' | 'right' | 'bottom' | 'left';
}

export const SelectContext = createContext<SelectContext | null>(null);

interface SelectProps {
    align?: 'start' | 'center' | 'end';
    children: ReactNode;
    onChange: (value: string | null) => void;
    onOpenChange?: (open: boolean) => void;
    side?: 'top' | 'right' | 'bottom' | 'left';
    value: string;
}

export function Select(props: SelectProps) {
    const { children, align = 'center', side = 'bottom', onChange, onOpenChange, value } = props;
    const [open, setOpen] = useState(false);
    const [hasLeftIcon, setHasLeftIcon] = useState(false);
    const [hasRightIcon, setHasRightIcon] = useState(false);
    const context = useMemo(
        () => ({
            align,
            hasLeftIcon,
            hasRightIcon,
            open,
            setHasLeftIcon,
            setHasRightIcon,
            setOpen,
            side,
        }),
        [align, hasLeftIcon, hasRightIcon, open, side],
    );

    const handleOpenChange = (open: boolean) => {
        onOpenChange?.(open);
        setOpen(open);
    };

    return (
        <RSelect.Root value={value} onOpenChange={handleOpenChange} onValueChange={onChange}>
            <SelectContext.Provider value={context}>{children}</SelectContext.Provider>
        </RSelect.Root>
    );
}

interface ContentProps {
    children: ReactNode;
    stickyContent?: ReactNode;
}

function Content(props: ContentProps) {
    const { children, stickyContent } = props;
    const { open } = useContext(SelectContext) as SelectContext;

    return (
        <AnimatePresence>
            {open && (
                <RSelect.Content
                    hideWhenDetached
                    className={styles.content}
                    collisionPadding={{ bottom: 4, left: 4, right: 4, top: 4 }}
                    position="popper"
                    sideOffset={6}
                >
                    <motion.div
                        animate="show"
                        className={styles.innerContent}
                        initial="hidden"
                        variants={animationVariants.fadeIn}
                    >
                        {stickyContent}
                        <ScrollArea>{children}</ScrollArea>
                    </motion.div>
                </RSelect.Content>
            )}
        </AnimatePresence>
    );
}

interface ItemProps {
    children: ReactNode;
    disabled?: boolean;
    isSelected?: boolean;
    leftIcon?: keyof typeof AppIcon;
    rightIcon?: keyof typeof AppIcon;
    value: string;
}

function Item(props: ItemProps) {
    const { children, disabled, isSelected, leftIcon, rightIcon, value } = props;
    const { hasLeftIcon, hasRightIcon, setHasLeftIcon, setHasRightIcon } = useContext(
        SelectContext,
    ) as SelectContext;

    useEffect(() => {
        setHasLeftIcon?.(!!leftIcon);
        setHasRightIcon?.(!!rightIcon);
    }, [leftIcon, rightIcon, setHasLeftIcon, setHasRightIcon]);

    return (
        <RSelect.Item
            className={clsx(styles.item, {
                [styles.selected]: isSelected,
                [styles.disabled]: disabled,
                [styles.hasLeftIcon]: hasLeftIcon,
                [styles.hasRightIcon]: hasRightIcon,
            })}
            disabled={disabled}
            value={value}
        >
            {leftIcon && <Icon className={styles.leftIcon} icon={leftIcon} />}
            {children}
            {rightIcon && <Icon className={styles.rightIcon} icon={rightIcon} />}
        </RSelect.Item>
    );
}

interface LabelProps {
    children: ReactNode;
}

function Label(props: LabelProps) {
    const { children } = props;

    return <RSelect.Label className={styles.label}>{children}</RSelect.Label>;
}

interface DividerProps {}

function Divider(props: DividerProps) {
    return <RSelect.Separator {...props} className={styles.divider} />;
}

interface TargetProps {
    children: ReactNode;
}

function Target(props: TargetProps) {
    const { children } = props;

    return (
        <RSelect.Trigger asChild className={styles.target}>
            {children}
        </RSelect.Trigger>
    );
}

interface PortalProps {
    children: ReactNode;
}

function Portal(props: PortalProps) {
    const { children } = props;

    return <RSelect.Portal>{children}</RSelect.Portal>;
}

interface ViewportProps {
    children: ReactNode;
}

function Viewport(props: ViewportProps) {
    const { children } = props;

    return <RSelect.Viewport>{children}</RSelect.Viewport>;
}

Select.Content = Content;
Select.Item = Item;
Select.Label = Label;
Select.Divider = Divider;
Select.Target = Target;
Select.Portal = Portal;
Select.Viewport = Viewport;
