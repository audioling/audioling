import clsx from 'clsx';
import { MdArrowBack, MdArrowForward, MdCheck, MdClose } from 'react-icons/md';
import { RiLoader3Line } from 'react-icons/ri';
import styles from './icon.module.scss';

export const AppIcon = {
    arrowLeft: MdArrowBack,
    arrowRight: MdArrowForward,
    check: MdCheck,
    spinner: RiLoader3Line,
    x: MdClose,
} as const;

interface IconProps {
    icon: keyof typeof AppIcon;
    size?: number;
    state?: 'success' | 'error' | 'info' | 'warn';
}

export const Icon = (props: IconProps) => {
    const { size, icon } = props;

    const classNames = clsx({
        [styles.icon]: true,
        [styles.colorDefault]: !props.state,
        [styles[`color-${props.state}`]]: props.state,
    });

    const IconComponent = AppIcon[icon];

    return (
        <span className={classNames}>
            <IconComponent size={size} />
        </span>
    );
};
