const path = require('node:path');
const TerserPlugin = require('terser-webpack-plugin');

/** @type { import('webpack').Configuration } */
module.exports = {
    entry: {
        main: './dist-vite/index.cjs',
    // extensionWorker: './dist-vite/extensionWorker.cjs',
    },
    mode: 'production', // Or 'development'
    node: {
        __dirname: false, // Keep __dirname as is (important in Node.js)
        __filename: false,
    },
    optimization: {
        minimize: true, // Enable code compression and obfuscation
        minimizer: [
            new TerserPlugin({
                extractComments: false, // Disable generating LICENSE.txt file
                terserOptions: {
                    compress: true, // Enable code compression
                    mangle: true, // Obfuscate variable names
                },
            }),
        ],
        splitChunks: {
            cacheGroups: {
                common: {
                    minChunks: 2, // Modules shared by at least two chunks will be extracted to the common chunk
                    name: 'common',
                    priority: -10,
                    reuseExistingChunk: true,
                },
                defaultVendors: {
                    chunks: 'all',
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                },
            },
            chunks: 'all', // Split all types of code
        },
    },
    output: {
        filename: '[name].cjs', // Use [name] placeholder to ensure each chunk has a unique filename
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
    target: 'electron-main', // The target environment is set to Node.js
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
