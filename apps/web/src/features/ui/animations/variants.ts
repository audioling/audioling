import type { Variants } from 'framer-motion';

const fadeIn: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
};

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
};

const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 },
};

const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: 10 },
    show: { opacity: 1, x: 0 },
};

const fadeInRight: Variants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
};

const zoomIn: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    show: { opacity: 1, scale: 1 },
};

const zoomOut: Variants = {
    hidden: { opacity: 1, scale: 1 },
    show: { opacity: 0, scale: 0.5 },
};

const slideInUp: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
};

const slideInDown: Variants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 },
};

const slideInLeft: Variants = {
    hidden: { opacity: 0, x: 10 },
    show: { opacity: 1, x: 0 },
};

const slideInRight: Variants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
};

const stagger = (variants: Variants, delay?: number) => ({
    ...variants,
    show: {
        ...variants.show,
        transition: {
            staggerChildren: delay ?? 0.1,
        },
    },
});

export const animationVariants = {
    fadeIn,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    fadeInUp,
    slideInDown,
    slideInLeft,
    slideInRight,
    slideInUp,
    stagger,
    zoomIn,
    zoomOut,
};
