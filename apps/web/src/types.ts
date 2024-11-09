export type PolymorphicComponentType =
    | 'div'
    | 'span'
    | 'section'
    | 'article'
    | 'aside'
    | 'footer'
    | 'header'
    | 'main'
    | 'nav'
    | 'section'
    | 'summary';

export type Breakpoints = {
    isLargerThanLg: boolean;
    isLargerThanMd: boolean;
    isLargerThanSm: boolean;
    isLargerThanXl: boolean;
    isLargerThanXxl: boolean;
    isLargerThanXxxl: boolean;
};
