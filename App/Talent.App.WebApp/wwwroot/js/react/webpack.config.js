module.exports = {
    context: __dirname,
    entry: {
        homePage: './ReactScripts/Home.js'
    },
    output:
    {
        path: __dirname + "/dist",
        filename: "[name].bundle.js"
    },
   resolve: {
        extensions: ['.js', '.jsx']        
    },
    watch: true,
    node: { fs: 'empty' },
    mode: 'development',

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },

            {
                test: /\.(s?)css$/,
                loaders: [
                    'style-loader',
                    'css-loader',                    
                    'sass-loader',
                ]
            },        

            {            
                test: /\.html/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                  loader: 'file-loader',
                  options: { name: '[name].[ext]' },
                }],
            },
            
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },
            
            {
                test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
                loader: require.resolve('file-loader'),
                options: {
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },

        ]
    }, 
}