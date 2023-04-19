const path = require("path");
const fs = require('fs')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

// const target = 'http://192.168.1.5:50021' // 测试
// const target = 'http://develop.iot-cas.com:8081' // 测试
const target = "http://dn.product.iot-cas.com:8081"; // 生产
// const target = 'https://cb.gzns.gov.cn'
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["js", "css"];
function resolve(dir) {
    return path.join(__dirname, dir);
}

if (process.env.NODE_ENV !== "production") {
    // 静态资源目录
    const child_process = require('child_process')
    child_process.exec('http-server -p 7070 ./static')
    console.log('启动静态资源服务')
}

const staticDirs = fs.readdirSync('static')
console.log('静态资源目录', staticDirs)
const proxy = {
    [process.env.VUE_APP_SCREEN_API]: {
        target: `${target}/screen`,
        // target: 'http://http://dn.product.iot-cas.com:8081/portal',//生产
        changeOrigin: true,
        pathRewrite: {
            ["^" + process.env.VUE_APP_SCREEN_API]: "",
        },
    },
    [process.env.VUE_APP_BASE_API]: {
        target: `${target}/vform`,
        // target: 'http://dn.product.iot-cas.com:8081/vform',//生产
        changeOrigin: true,
        pathRewrite: {
            ["^" + process.env.VUE_APP_BASE_API]: "",
        },
    },
    [process.env.VUE_APP_PORTAL_API]: {
        target: `${target}/portal`,
        changeOrigin: true,
        pathRewrite: {
            ["^" + process.env.VUE_APP_PORTAL_API]: "",
        },
    },
    "/yqfk": {
        target: `${target}`,
        // target: 'http://dn.product.iot-cas.com:8081',
        // target: 'http://dn.product.iot-cas.com:8081/vform',//生产
        changeOrigin: true,
        // pathRewrite: {
        //   ['^' + process.env.VUE_APP_BASE_API]: ''
        // }
    },
    "/cyjk": {
        target: `${target}`,
        // target: 'http://dn.product.iot-cas.com:8081',
        changeOrigin: true,
        // pathRewrite: {
        //   ['^' + process.env.VUE_APP_BASE_API]: ''
        // }
    },
    "/vform": {
        target: `${target}`,
        changeOrigin: true,
    },
    [process.env.VUE_APP_PORTAL_API]: {
        target: `${target}/portal`,
        // target: 'http://http://dn.product.iot-cas.com:8081/portal',//生产
        changeOrigin: true,
        pathRewrite: {
            ["^" + process.env.VUE_APP_PORTAL_API]: "",
        },
    },
    "/gzns": {
        //南沙区地图服务
        target: `https://cb.gzns.gov.cn`,
        changeOrigin: true,
        pathRewrite: {
            "^/gzns": "",
        },
    },
}
staticDirs.forEach(v => {
    proxy[v] = {
        target: `http://localhost:7070`,
        changeOrigin: true,
    }
})
// "/yqfk": {
//     target: `${target}`,
//         // target: 'http://dn.product.iot-cas.com:8081',
//         // target: 'http://dn.product.iot-cas.com:8081/vform',//生产
//         changeOrigin: true,
//                 // pathRewrite: {
//                 //   ['^' + process.env.VUE_APP_BASE_API]: ''
//                 // }
//             },

/* 打开系统方法：
现在大脑系统里打开对应的子系统
然后复制cookie里面的token
在本地打开的页面cookie里增加token，然后刷新
*/
module.exports = {
    // 解决高级语法的浏览器兼容性问题
    // transpileDependencies: process.env.NODE_ENV === "development" ? ["*"] : [],
    transpileDependencies: [/^((?!@arcgis).)+$/],
    // 基本路径
    publicPath: "",
    lintOnSave: false,

    configureWebpack: (config) => {
        if (process.env.NODE_ENV === "production") {
            config.optimization.minimizer.map((arg) => {
                // const option = arg.options.terserOptions.compress;
                // option.drop_console = true; // 打开开关
                return arg;
            });
            return {
                plugins: [
                    // moment只需要中文语言
                    new MomentLocalesPlugin({
                        localesToKeep: ['es-us', 'zh-cn'],
                    }),
                    // 构建结果输出可视化分析
                    //   new BundleAnalyzerPlugin(
                    //     {
                    //       analyzerMode: 'server',
                    //       analyzerHost: '127.0.0.1',
                    //       analyzerPort: 8891,
                    //       reportFilename: 'report.html',
                    //       defaultSizes: 'parsed',
                    //       openAnalyzer: true,
                    //       generateStatsFile: false,
                    //       statsFilename: 'stats.json',
                    //       statsOptions: null,
                    //       logLevel: 'info'
                    //     }
                    //   ),
                    new CompressionWebpackPlugin({
                        algorithm: "gzip",
                        test: new RegExp(
                            "\\.(" + productionGzipExtensions.join("|") + ")$"
                        ),
                        threshold: 10240,
                        minRatio: 0.6,
                    }),
                ],
            };
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set("@", resolve("src"))
            .set("@assets", resolve("src/assets"))
            .set("@components", resolve("src/components"))
            .set("@public", resolve("public"));

      const dir = path.resolve('src/assets/icons/svg')
      config.module
        .rule('svg-sprite')
        .test(/\.svg$/)
        .include
        .add(dir)
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]'
        })
        .end()
      config.plugin('svg-sprite').use(require('svg-sprite-loader/plugin'), [{ plainSprite: true }])
      config.module.rule('svg').exclude.add(dir)

    },

    // 生产环境 sourceMap
    productionSourceMap: false,

    devServer: {
        port: 8080,
        proxy
    },

    css: {
        loaderOptions: {
            sass: {
                additionalData: `@import "@/assets/css/variables.scss";`,
            },
        },
    },

    pages: {
        index: {
            // page 的入口
            entry: "src/main.js",
            // 模板来源
            template: "public/index.html",
            filename: "index.html",
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: "疫情防控",
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ["chunk-vendors", "chunk-common", "index"],
        },
        form: {
            entry: "src/client.js",
            template: "public/form.html",
            filename: "form.html",
            title: "南沙地图",
            chunks: ["chunk-vendors", "chunk-common", "form"],
        },
        supervision: {
            entry: "src/supervision.js",
            template: "public/supervision.html",
            filename: "supervision.html",
            title: "督查督办事项进度更新",
            chunks: ["chunk-vendors", "chunk-common", "supervision"],
        },
        mjcmryqx: {
            entry: "src/supervision.js",
            template: "public/supervision.html",
            filename: "mjcmryqx.html",
            title: "密接次密人员核查",
            chunks: ["chunk-vendors", "chunk-common", "supervision"],
        },
        yddgyjl: {
            entry: "src/supervision.js",
            template: "public/supervision.html",
            filename: "yddgyjl.html",
            title: "药店的购药记录",
            chunks: ["chunk-vendors", "chunk-common", "supervision"],
        },
        hmryhc: {
            entry: "src/supervision.js",
            template: "public/supervision.html",
            filename: "hmryhc.html",
            title: "黄码人员核查",
            chunks: ["chunk-vendors", "chunk-common", "supervision"],
        },
        gfxgwry: {
            entry: "src/supervision.js",
            template: "public/supervision.html",
            filename: "gfxgwry.html",
            title: "高风险岗位人员",
            chunks: ["chunk-vendors", "chunk-common", "supervision"],
        },
        sealarea: {
            entry: `src/sealarea.js`,
            template: `public/sealarea.html`,
            title: "封控管控区示例",
            chunks: ["chunk-vendors", "chunk-common", "sealarea"],
        },
        driver: {
            entry: "src/driver.js",
            template: "public/driver.html",
            title: "司机预约",
            chunks: ["chunk-vendors", "chunk-common", "driver"],
        },
        helpDocument: {
            entry: "src/entries/help-document.js",
            template: "public/help-document.html",
            filename: "help-document.html",
            title: "帮助文档",
            chunks: ["chunk-vendors", "chunk-common", "helpDocument"],
        },
        generateReport: {
            entry: "src/supervision.js",
            template: "public/report.html",
            filename: "generateReport.html",
            title: "平台使用分析报告",
            chunks: ["chunk-vendors", "chunk-common", "supervision"],
        },
        // 大屏GZ2000版
        bigGz2000: {
            entry: "src/big.js",
            template: "public/big.html",
            filename: "big.html",
            title: "南沙疫情防控指挥平台",
            chunks: ["chunk-vendors", "chunk-common", "bigGz2000"],
        },
        populationVerify: {
            entry: "src/supervision.js",
            template: "public/report.html",
            filename: "populationVerify.html",
            title: "人口核查",
            chunks: ["chunk-vendors", "chunk-common", "supervision"],
        },
        transferPage: {
            entry: "src/supervision.js",
            template: "public/transferPage.html",
            filename: "transferPage.html",
            title: "中转页面",
            chunks: ["chunk-vendors", "chunk-common", "supervision"],
        },
    },
};
