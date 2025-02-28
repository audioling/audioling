import type { Variants } from 'motion/react';
import merge from 'lodash/merge';

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
    hidden: { scale: 0.5 },
    show: { scale: 1 },
};

const zoomOut: Variants = {
    hidden: { scale: 1 },
    show: { scale: 0.5 },
};

const slideInUp: Variants = {
    hidden: { y: 10 },
    show: { y: 0 },
};

const slideInDown: Variants = {
    hidden: { y: -10 },
    show: { y: 0 },
};

const slideInLeft: Variants = {
    hidden: { x: 10 },
    show: { x: 0 },
};

const slideInRight: Variants = {
    hidden: { x: 10 },
    show: { x: 0 },
};

const scaleY: Variants = {
    hidden: { height: 0, opacity: 0, overflow: 'hidden' },
    show: { height: 'auto', opacity: 1 },
};

const blurIn: Variants = {
    hidden: { filter: 'blur(4px)' },
    show: { filter: 'blur(0px)' },
};

const flipHorizontal: Variants = {
    hidden: { x: '-100%' },
    show: { x: 0 },
};

const flipVertical: Variants = {
    hidden: { y: '-100%' },
    show: { y: 0 },
};

function combine(...variants: Variants[]) {
    const merged = merge({}, ...variants);

    return merged as Variants;
}

function stagger(variants: Variants, delay?: number): Variants {
    return {
        ...variants,
        show: {
            ...variants.show,
            transition: {
                staggerChildren: delay ?? 0.1,
            },
        },
    };
}

export const animationVariants = {
    blurIn,
    combine,
    fadeIn,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    fadeInUp,
    flipHorizontal,
    flipVertical,
    scaleY,
    slideInDown,
    slideInLeft,
    slideInRight,
    slideInUp,
    stagger,
    zoomIn,
    zoomOut,
};
