import { ActionIcon, Title as MantineTitle } from '@mantine/core';
import { motion, useSpring, useTransform } from 'motion/react';
import { type ReactNode, useEffect, useState } from 'react';
import styles from './item-list.module.css';
import { Icon } from '/@/components/icon/icon';
import { ScrollArea } from '/@/components/scroll-area/scroll-area';

interface ItemListProps {
    children: ReactNode;
}

export function ItemList(props: ItemListProps) {
    const { children } = props;

    return <div className={styles.container}>{children}</div>;
}

interface ItemListHeaderProps {
    children: ReactNode;
}

function Header(props: ItemListHeaderProps) {
    const { children } = props;

    return <div className={styles.header}>{children}</div>;
}

interface ItemListLeftProps {
    children: ReactNode;
}

function Left(props: ItemListLeftProps) {
    const { children } = props;

    return <div className={styles.left}>{children}</div>;
}

interface ItemListRightProps {
    children: ReactNode;
}

function Right(props: ItemListRightProps) {
    const { children } = props;

    return <div className={styles.right}>{children}</div>;
}

interface ItemListTitleProps {
    children: ReactNode;
}

function Title(props: ItemListTitleProps) {
    const { children } = props;

    return <MantineTitle className={styles.title} order={1}>{children}</MantineTitle>;
}

interface ItemListItemCountProps {
    loading?: boolean;
    value: number;
}

function ItemCount({ loading, value }: ItemListItemCountProps) {
    const spring = useSpring(value, { damping: 15, mass: 0.8, stiffness: 75 });
    const display = useTransform(spring, current => Math.round(current).toLocaleString());

    const [previousValue, setPreviousValue] = useState(value);

    useEffect(() => {
        if (previousValue !== value && value !== undefined) {
            spring.set(value);
            setPreviousValue(value);
        }
    }, [previousValue, spring, value]);

    if (loading) {
        return <span className={styles.itemCount}>-</span>;
    }

    return <motion.span className={styles.itemCount}>{display}</motion.span>;
}

interface ItemListFooterProps {
    children: ReactNode;
}

function Footer(props: ItemListFooterProps) {
    const { children } = props;

    return <div className={styles.footer}>{children}</div>;
}

interface ItemListContentProps {
    children: ReactNode;
}

function Content(props: ItemListContentProps) {
    const { children } = props;

    return <div className={styles.content}>{children}</div>;
}

interface ItemListQueryBuilderProps {
    children: ReactNode;
    isOpen: boolean;
}

function QueryBuilder(props: ItemListQueryBuilderProps) {
    const { children, isOpen } = props;

    return (
        <motion.div
            animate={{ height: isOpen ? 'auto' : 0 }}
            className={styles.queryBuilder}
            initial={{ height: 0 }}
        >
            <ScrollArea>{children}</ScrollArea>
        </motion.div>
    );
}
interface PlayButtonProps {
    disabled?: boolean;
    isLoading?: boolean;
    onClick: () => void;
}

function PlayButton(props: PlayButtonProps) {
    const { disabled, isLoading, onClick } = props;

    return (
        <ActionIcon
            className={styles.playButton}
            disabled={disabled}
            loading={isLoading}
            variant="primary"
            onClick={onClick}
        >
            <Icon fill="secondary" icon={isLoading ? 'spinner' : 'mediaPlay'} />
        </ActionIcon>
    );
}

ItemList.Header = {
    Footer,
    ItemCount,
    Left,
    PlayButton,
    QueryBuilder,
    Right,
    Root: Header,
    Title,
};

ItemList.Content = Content;
