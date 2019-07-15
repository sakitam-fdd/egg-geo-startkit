module.exports = {
  publicPath: '/',
  lintOnSave: true,
  configureWebpack: {
    devtool: 'source-map',
    plugins: [],
    module: {
      rules: [
        {
          test: /\.glsl$/,
          loader: 'raw-loader',
        },
      ],
    },
  },
  chainWebpack: config => {
    // const el = config.module.rule('eslint');
    // el.uses.clear();
    // el
    //   .use('eslint')
    //   .loader('eslint-loader')
    //   .options({
    //     extensions: [
    //       '.js',
    //       '.jsx',
    //       '.vue',
    //       '.ts',
    //       '.tsx',
    //     ],
    //     cache: true,
    //     emitWarning: true,
    //     emitError: false,
    //     formatter: require('eslint-friendly-formatter'),
    //   });

    config
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map'));

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
              libs: {
                name: 'chunk-libs',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'initial', // only package third parties that are initially dependent
              },
              elementUI: {
                name: 'chunk-elementUI', // split elementUI into a single package
                priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
              },
              commons: {
                name: 'chunk-commons',
                test: path.resolve(__dirname, 'src/components'),
                minChunks: 3, //  minimum common number
                priority: 5,
                reuseExistingChunk: true,
              },
            },
          });
          config.optimization.runtimeChunk('single');
        });
  },
  devServer: {
    // host: '',
    port: 8080,
    // proxy: {
    //   '/api': {
    //     target: 'http://192.168.9.24:5532', // 接口的域名
    //     // target: 'http://192.168.42.187:8383', // 接口的域名
    //     // secure: false,  // 如果是https接口，需要配置这个参数
    //     changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
    //     pathRewrite: {
    //       '^/api': '',
    //     },
    //   },
    // },
  },
};
