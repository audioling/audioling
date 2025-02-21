const path = require('node:path');
const TerserPlugin = require('terser-webpack-plugin');

/** @type { import('webpack').Configuration } */
module.exports = {
    mode: 'production', // Or 'development'
    target: 'electron-main', // The target environment is set to Node.js
    entry: {
        main: './dist-vite/index.cjs',
    // extensionWorker: './dist-vite/extensionWorker.cjs',
    },
    output: {
        path: path.resolve(__dirname, 'dist'), // Output directory
        filename: '[name].cjs', // Use [name] placeholder to ensure each chunk has a unique filename
    },
    node: {
        __dirname: false, // Keep __dirname as is (important in Node.js)
        __filename: false,
    },
    optimization: {
        minimize: true, // Enable code compression and obfuscation
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: true, // Enable code compression
                    mangle: true, // Obfuscate variable names
                },
                extractComments: false, // Disable generating LICENSE.txt file
            }),
        ],
        splitChunks: {
            chunks: 'all', // Split all types of code
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
                common: {
                    name: 'common',
                    minChunks: 2, // Modules shared by at least two chunks will be extracted to the common chunk
                    priority: -10,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    // module: {
    //   rules: [
    //     {
    //       test: /\.js$/,
    //       exclude: /node_modules/,
    //       use: 'babel-loader', // 如果需要转换现代 JavaScript 语法
    //     },
    //   ],
    // },
};
