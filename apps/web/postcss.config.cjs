module.exports = {
    plugins: {
        'postcss-preset-mantine': {
            mixins: {
                textEllipsis: {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                },
            },
        },
        'postcss-simple-vars': {
            variables: {
                'mantine-breakpoint-2xl': '120em', // 1920px 4K
                'mantine-breakpoint-3xl': '160em', // 2560px 8K
                'mantine-breakpoint-lg': '75em', // 1200px Large Desktop
                'mantine-breakpoint-md': '62em', // 992px Small Desktop
                'mantine-breakpoint-sm': '48em', // 768px Tablet
                'mantine-breakpoint-xl': '88em', // 1408px Ultrawide
                'mantine-breakpoint-xs': '36em', // 576px Large Mobile
            },
        },
    },
};
