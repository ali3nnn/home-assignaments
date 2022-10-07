const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    target: 'node',
    mode: 'production',
    context: path.resolve( __dirname),
    entry: {
        'handler': './src/main.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve( __dirname, 'dist' ),
        libraryTarget: 'commonjs',
        clean: true
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new MomentLocalesPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [ /node_modules/],
                loader: "ts-loader"
            }
        ]
    },
    cache: {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, '.webpackCache'),
    },
    optimization: {
        minimize: true,
        usedExports: true,
        sideEffects: false,
        minimizer: [new TerserPlugin({
            parallel: true,
            terserOptions: {
                keep_classnames: true,
                keep_fnames: true
            }
        })]
    }
};