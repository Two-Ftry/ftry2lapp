const path = require('path')
const vueConfig = require('./vue-loader.config')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

// plugins
const plugins = [];
if (isProd) {
    plugins.push(new FriendlyErrorsPlugin());
}
plugins.push(new ExtractTextPlugin('style.css'));

module.exports = {
    devtool: isProd
        ? false
        : '#cheap-module-eval-source-map',
    entry: {
        app: './src/entry-client.js',
        vendor: [
            'es6-promise/auto',
            'firebase/app',
            'firebase/database',
            'vue',
            'vue-router',
            'vuex',
            'vuex-router-sync'
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        alias: {
            'public': path.resolve(__dirname, '../public')
        }
    },
    module: {
        noParse: /es6-promise\.js$/, // avoid webpack shimming process
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueConfig
            },
            {
                test: /\.js$/,
                loader: 'buble-loader',
                exclude: /node_modules/,
                options: {
                    objectAssign: 'Object.assign'
                }
            },
            {
                test: /\.less$/,
                // loaders: ['style-loader', 'css-loader', 'less-loader'],
                use: ExtractTextPlugin.extract({
                        use: [
                            'css-loader',
                            'less-loader'
                        ],
                        fallback: 'style-loader'
                }),
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    performance: {
        maxEntrypointSize: 300000,
        hints: isProd ? 'warning' : false
    },
    plugins: plugins
}
