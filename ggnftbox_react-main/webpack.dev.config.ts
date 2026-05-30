import path from 'path';
// import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import webpack from 'webpack';
import * as WebpackDevServer from 'webpack-dev-server';

type DevConfig = webpack.Configuration &
    { devServer?: WebpackDevServer.Configuration | undefined }

const devServerPort = Number(process.env.DEV_SERVER_PORT ?? process.env.PORT) || 8080

const config: DevConfig = {
    mode: 'development',
    entry: './src/index.tsx',
    output: {
        publicPath: '/',
    },
    devtool: 'eval-cheap-module-source-map',
    optimization: {
        minimize: false
    },
    devServer: {
        static: path.join(__dirname, 'build'),
        historyApiFallback: true,
        port: devServerPort,
        open: true,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/i,
                exclude: /node_modules/,
                use: ['thread-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
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
                    }],
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
            title: 'Hello',
        }),
        new ForkTsCheckerWebpackPlugin({
            async: false,
        }),
        new webpack.DefinePlugin({
            'process.env.REACT_APP_API_SOURCE': JSON.stringify(process.env.REACT_APP_API_SOURCE ?? 'http://localhost:3000'),
        }),
    ],
};

export default config;
