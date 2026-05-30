import * as path from 'path'
import webpack, { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'


const config: Configuration = {
    mode: 'production',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].[contenthash].js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/i,
                exclude: ['/node_modules/', '/src/pages/adminPanel/'],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript',
                        ],
                        plugins: [
                            ['@babel/plugin-proposal-class-properties', { loose: true }],
                            ['@babel/plugin-proposal-private-methods', { loose: true }],
                            ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
                        ],
                    },
                },

            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.mp4$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    },
                }
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            favicon: 'public/favicon.ico',
        }),
        new ForkTsCheckerWebpackPlugin({
            async: false,
        }),
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env.REACT_APP_API_SOURCE': JSON.stringify(process.env.REACT_APP_API_SOURCE ?? 'http://localhost:3000'),
        }),
    ],
}

export default config
