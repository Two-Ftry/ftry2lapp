const ExtractTextPlugin = require('extract-text-webpack-plugin');
const cssLoader = {
    loader: 'css-loader',
    options: {
        minimize: { discardComments: { removeAll: true, mergeLonghand: true, core: true }, discardDuplicates: true }
    }
};

module.exports = {
    preserveWhitespace: false,
    postcss: [
        require('autoprefixer')({
            browsers: ['last 3 versions']
        })
    ],
    loaders: {
        css: ExtractTextPlugin.extract({
            use: [cssLoader],
            fallback: 'vue-style-loader'
        }),
        less: ExtractTextPlugin.extract({
            use: [cssLoader, 'less-loader'],
            fallback: 'vue-style-loader'
        })
    }
}
