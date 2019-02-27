const path = require("path")


/* Configure HTMLWebpack plugin */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/src/html/index.html',
    filename: 'index.html',
    inject: 'body'
})

/* Configure assets */
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CopyWebpackPluginConfig = new CopyWebpackPlugin([{
    from: 'src/assets',
    to: 'assets'
}])


/* Configure BrowserSync */
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const BrowserSyncPluginConfig = new BrowserSyncPlugin({
    host: 'localhost',
    port: 8080,
    proxy: 'http://localhost:8080/'
}, config = {
    reload: false
})

/* Configure ProgressBar */
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const ProgressBarPluginConfig = new ProgressBarPlugin()

/* Export configuration */
module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: [
        './src/ts/index.ts'
    ],
    output: {
        path: __dirname + '/dist',
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'awesome-typescript-loader'
            }, {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            { test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/, loader: require.resolve("file-loader") + '?limit=100000' }
        ]
    },
    resolve: {
        alias: {
            'three-examples': path.join(__dirname, './node_modules/three/examples/js')
        },
        extensions: [".web.ts", ".web.js", ".ts", ".js"]
    },
    plugins: [HTMLWebpackPluginConfig, CopyWebpackPluginConfig, BrowserSyncPluginConfig, ProgressBarPluginConfig]
}
