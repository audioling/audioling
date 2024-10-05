module.exports = {
    plugins: {
        'postcss-preset-mantine': {},
        'postcss-simple-vars': {
            variables: {
                'mantine-breakpoint-lg': '75rem',
                'mantine-breakpoint-md': '62rem',
                'mantine-breakpoint-sm': '48rem',
                'mantine-breakpoint-xl': '88rem',
                'mantine-breakpoint-xs': '36rem',
            },
        },
    },
};
