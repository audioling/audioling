// Common framer motion animations
import type { AnimationProps } from 'motion/react';

const fadeIn: AnimationProps = {
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    initial: { opacity: 0 },
    transition: { duration: 0.5 },
};

const fadeOut: AnimationProps = {
    animate: { opacity: 0 },
    exit: { opacity: 1 },
    initial: { opacity: 1 },
    transition: { duration: 0.5 },
};

const slideIn: AnimationProps = {
    animate: { x: 0 },
    exit: { x: -100 },
    initial: { x: -100 },
    transition: { duration: 0.5 },
};

const slideOut: AnimationProps = {
    animate: { x: 100 },
    exit: { x: 0 },
    initial: { x: 0 },
    transition: { duration: 0.5 },
};

const slideInLeft: AnimationProps = {
    animate: { x: 0 },
    exit: { x: -100 },
    initial: { x: -100 },
    transition: { duration: 0.5 },
};

const slideOutLeft: AnimationProps = {
    animate: { x: 100 },
    exit: { x: 0 },
    initial: { x: 0 },
    transition: { duration: 0.5 },
};

const slideInRight: AnimationProps = {
    animate: { x: 0 },
    exit: { x: -100 },
    initial: { x: -100 },
    transition: { duration: 0.5 },
};

const slideOutRight: AnimationProps = {
    animate: { x: 100 },
    exit: { x: 0 },
    initial: { x: 0 },
    transition: { duration: 0.5 },
};

const slideInUp: AnimationProps = {
    animate: { y: 0 },
    exit: { y: -100 },
    initial: { y: -100 },
    transition: { duration: 0.5 },
};

const slideOutUp: AnimationProps = {
    animate: { y: 100 },
    exit: { y: 0 },
    initial: { y: 0 },
    transition: { duration: 0.5 },
};

const slideInDown: AnimationProps = {
    animate: { y: 0 },
    exit: { y: -100 },
    initial: { y: -100 },
    transition: { duration: 0.5 },
};

const slideOutDown: AnimationProps = {
    animate: { y: 100 },
    exit: { y: 0 },
    initial: { y: 0 },
    transition: { duration: 0.5 },
};

const scale: AnimationProps = {
    animate: { scale: 1 },
    exit: { scale: 0 },
    initial: { scale: 0 },
    transition: { duration: 0.5 },
};

const rotate: AnimationProps = {
    animate: { rotate: 360 },
    exit: { rotate: 0 },
    initial: { rotate: 0 },
    transition: { duration: 0.5 },
};

const bounce: AnimationProps = {
    animate: { y: [0, -30, 0] },
    transition: { duration: 0.5, times: [0, 0.5, 1] },
};

const pulse: AnimationProps = {
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 1, repeat: Infinity },
};

const shake: AnimationProps = {
    animate: { x: [-10, 10, -10, 10, 0] },
    transition: { duration: 0.5 },
};

const flip: AnimationProps = {
    animate: { rotateY: 360 },
    exit: { rotateY: 0 },
    initial: { rotateY: 0 },
    transition: { duration: 0.5 },
};

const zoomIn: AnimationProps = {
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
    initial: { opacity: 0, scale: 0.5 },
    transition: { duration: 0.5 },
};

const zoomOut: AnimationProps = {
    animate: { opacity: 0, scale: 0.5 },
    exit: { opacity: 1, scale: 1 },
    initial: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
};

const rotateIn: AnimationProps = {
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: -180 },
    initial: { opacity: 0, rotate: -180 },
    transition: { duration: 0.5 },
};

const swing: AnimationProps = {
    animate: { rotate: [0, 15, -15, 0] },
    transition: { duration: 1, repeat: Infinity },
};

const rubberBand: AnimationProps = {
    animate: { scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1] },
    transition: { duration: 0.8 },
};

const fadeInUp: AnimationProps = {
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    initial: { opacity: 0, y: 50 },
    transition: { duration: 0.5 },
};

const fadeInDown: AnimationProps = {
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
    initial: { opacity: 0, y: -50 },
    transition: { duration: 0.5 },
};

const skew: AnimationProps = {
    animate: { skew: 0 },
    exit: { skew: 20 },
    initial: { skew: 20 },
    transition: { duration: 0.5 },
};

const rotateScale: AnimationProps = {
    animate: { rotate: 360, scale: 1.5 },
    exit: { rotate: 0, scale: 1 },
    initial: { rotate: 0, scale: 1 },
    transition: { duration: 0.7 },
};

export const animationProps = {
    bounce,
    fadeIn,
    fadeInDown,
    fadeInUp,
    fadeOut,
    flip,
    pulse,
    rotate,
    rotateIn,
    rotateScale,
    rubberBand,
    scale,
    shake,
    skew,
    slideIn,
    slideInDown,
    slideInLeft,
    slideInRight,
    slideInUp,
    slideOut,
    slideOutDown,
    slideOutLeft,
    slideOutRight,
    slideOutUp,
    swing,
    zoomIn,
    zoomOut,
};
