import { type ReactNode, useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import styles from './list-header.module.scss';

interface ListHeaderProps {
    children: ReactNode;
}

export function ListHeader(props: ListHeaderProps) {
    const { children } = props;

    return <div className={styles.container}>{children}</div>;
}

interface ListHeaderLeftProps {
    children: ReactNode;
}

function Left(props: ListHeaderLeftProps) {
    const { children } = props;

    return <div className={styles.left}>{children}</div>;
}

interface ListHeaderRightProps {
    children: ReactNode;
}

function Right(props: ListHeaderRightProps) {
    const { children } = props;

    return <div className={styles.right}>{children}</div>;
}

interface ListHeaderTitleProps {
    children: ReactNode;
}

function Title(props: ListHeaderTitleProps) {
    const { children } = props;

    return <div className={styles.title}>{children}</div>;
}

interface ListHeaderItemCountProps {
    value: number;
}

function ItemCount(props: ListHeaderItemCountProps) {
    const { value } = props;
    const spring = useSpring(value, { damping: 15, mass: 0.8, stiffness: 75 });
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

    const [previousValue, setPreviousValue] = useState(value);

    useEffect(() => {
        if (previousValue !== value && value !== 0) {
            spring.set(value);
            setPreviousValue(value);
        }
    }, [previousValue, spring, value]);

    return <motion.span className={styles.itemCount}>{display}</motion.span>;
}

interface ListHeaderFooterProps {
    children: ReactNode;
}

function Footer(props: ListHeaderFooterProps) {
    const { children } = props;

    return <div className={styles.footer}>{children}</div>;
}

ListHeader.Left = Left;
ListHeader.Right = Right;
ListHeader.Title = Title;
ListHeader.Footer = Footer;
ListHeader.ItemCount = ItemCount;
